"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { DeleteConfirmationDialog } from "@/components/DeleteConfirmationDialog";
import { Dialog } from "@/components/Dialog";
import { EmptyState } from "@/components/EmptyState";
import { InputText } from "@/components/InputText";

import {
  createList,
  deleteList,
  getLists,
  updateList,
  cloneList,
} from "@/lib/api/lists";
import type { CreateList, List } from "@/lib/dto/list";
import { Loader } from "@/components/Loader";
import { toast } from "react-toastify";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function assertList(list?: List, msg?: string): asserts list is List {
  msg ??= "This object should be of type List.";

  if (!list) throw new Error(msg);

  if (!list.id || !list.name) throw new Error(msg);
}

const EMPTY_FORM: CreateList = { name: "", description: "" };

function ListRow({
  list,
  onEdit,
  onDelete,
  onClone,
}: {
  list: List;
  onEdit: (list: List) => void;
  onDelete: (list: List) => void;
  onClone: (list: List) => void;
}) {
  return (
    <li className="flex justify-between items-center">
      <p>{list.name}</p>
      <div className="flex gap-2 ml-auto items-center">
        <Link
          href={`/list/${list.id}`}
          className="text-blue-400 underline ml-auto mr-2"
        >
          Go to list
        </Link>
        <Button onClick={() => onClone(list)}>Clone</Button>
        <Button onClick={() => onEdit(list)}>Edit</Button>
        <Button onClick={() => onDelete(list)}>Delete</Button>
      </div>
    </li>
  );
}

export default function Home() {
  const [form, setForm] = useState<CreateList>(EMPTY_FORM);
  const [selectedList, setSelectedList] = useState<List>();

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isDeleteConfirmationDialogOpen, setIsDeleteConfirmationDialogOpen] =
    useState<boolean>();
  const [search, setSearch] = useState<string>("");

  const queryClient = useQueryClient();

  const { isPending, data, isError, error } = useQuery({
    queryKey: ["lists"],
    queryFn: async function () {
      const data = await getLists();
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async function addList(data: CreateList) {
      await createList(data);
    },
    onSuccess() {
      setIsDialogOpen(false);
      toast.success("List created!");
      queryClient.invalidateQueries({ queryKey: ["lists"] });
      setForm(EMPTY_FORM);
    },
    onError(error) {
      console.error(error);
      toast.error("Couldn't create the list.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async function editList(formData: CreateList) {
      assertList(selectedList);
      await updateList(selectedList.id, formData);
    },
    onSuccess() {
      setIsDialogOpen(false);
      setForm(EMPTY_FORM);
      setSelectedList(undefined);
      toast.success("List updated!");
      queryClient.invalidateQueries({ queryKey: ["lists"] });
    },
    onError(error) {
      console.error(error);
      toast.error("Couldn't update the list.");
    },
  });

  const cloneMutation = useMutation({
    mutationFn: async function clone(list: List) {
      await cloneList(list.id);
    },
    onSuccess() {
      toast.success("Cloned list successfully");
      queryClient.invalidateQueries({ queryKey: ["lists"] });
    },
    onError(error) {
      console.error(error);
      toast.error("Couldn't clone list");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async function removeList() {
      assertList(selectedList);
      await deleteList(selectedList.id);
    },
    onSuccess() {
      setIsDeleteConfirmationDialogOpen(false);
      setSelectedList(undefined);
      toast.success("List deleted!");
      queryClient.invalidateQueries({ queryKey: ["lists"] });
    },
    onError(error) {
      console.error(error);
      toast.error("Couldn't delete the list.");
    },
  });

  const filteredLists = useMemo<List[]>(() => {
    if (!data) return [];
    if (!search) return data;

    const newLists = [];

    for (const item of data) {
      if (item.name.includes(search)) {
        newLists.push(item);
      }
    }

    return newLists;
  }, [data, search]);

  function submit(event: React.SubmitEvent) {
    event.preventDefault();

    if (!selectedList) {
      createMutation.mutate(form);
    } else {
      updateMutation.mutate(form);
    }
  }

  function openDialog(type: "add" | "edit", list?: List) {
    if (type === "edit") {
      if (!list) {
        throw new Error("Open dialog in edit mode should always have a list");
      }

      setSelectedList(list);

      setForm({
        name: list.name,
        description: list.description ?? "",
      });
    } else {
      setForm(EMPTY_FORM);
    }

    setIsDialogOpen(true);
  }

  function openDeleteConfirmationDialog(list: List) {
    setSelectedList(list);
    setIsDeleteConfirmationDialogOpen(true);
  }

  function closeDialog() {
    setSelectedList(undefined);
    setIsDialogOpen(false);
  }

  let content: React.ReactNode;
  if (isError) {
    content = (
      <div className="flex flex-col items-center gap-3" role="alert">
        <p>Couldn't load lists.</p>
      </div>
    );
  } else if (isPending) {
    content = <Loader size="md" className="my-10"></Loader>;
  } else if (data?.length === 0) {
    content = <EmptyState />;
  } else {
    content = (
      <div>
        <InputText
          setState={(search) => setSearch(search as string)}
          placeholder="Search"
          appendIcon="mdi:search"
        ></InputText>

        <ul className="flex flex-col gap-4 mt-5">
          {filteredLists.map((list) => (
            <ListRow
              key={list.id}
              list={list}
              onClone={(list) => cloneMutation.mutate(list)}
              onEdit={(list) => openDialog("edit", list)}
              onDelete={openDeleteConfirmationDialog}
            />
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="w-140 mx-auto">
      <h1 className="mb-5 text-xl">Lists</h1>
      <Button className="ml-auto" onClick={() => openDialog("add")}>
        Create List
      </Button>

      <Dialog
        open={isDialogOpen}
        onClose={closeDialog}
        title={selectedList ? "Edit list" : "Add new list"}
      >
        <Card>
          <form onSubmit={submit} className="flex flex-col gap-3">
            <InputText
              label="Name"
              state={form.name}
              setState={(name) => setForm((prev) => ({ ...prev, name }))}
              name="name"
            ></InputText>

            <InputText
              label="Description (optional)"
              state={form.description ?? ""}
              name="description"
              setState={(description) =>
                setForm((prev) => ({ ...prev, description }))
              }
            ></InputText>

            <Button className="ml-auto">Submit</Button>
          </form>
        </Card>
      </Dialog>

      <Card className="mt-7 flex flex-col gap-4">{content}</Card>

      <DeleteConfirmationDialog
        open={isDeleteConfirmationDialogOpen}
        onClose={() => setIsDeleteConfirmationDialogOpen(false)}
        onDelete={() => deleteMutation.mutate()}
      ></DeleteConfirmationDialog>
    </div>
  );
}
