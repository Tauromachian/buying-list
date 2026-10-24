"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { DeleteConfirmationDialog } from "@/components/DeleteConfirmationDialog";
import { Dialog } from "@/components/Dialog";
import { EmptyState } from "@/components/EmptyState";
import { InputText } from "@/components/InputText";

import { createList, deleteList, getLists, updateList } from "@/lib/api/lists";
import type { CreateList, List } from "@/lib/dto/list";
import { Loader } from "@/components/Loader";
import { toast } from "react-toastify";

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
}: {
  list: List;
  onEdit: (list: List) => void;
  onDelete: (list: List) => void;
}) {
  return (
    <li className="flex justify-between items-center">
      <p>{list.name}</p>
      <div className="flex gap-2 ml-auto items-center">
        <Link
          href={`/list/${list.id}`}
          className="text-blue-400 underline ml-auto mr-4"
        >
          Go to list
        </Link>
        <Button onClick={() => onEdit(list)}>Edit</Button>
        <Button onClick={() => onDelete(list)}>Delete</Button>
      </div>
    </li>
  );
}

export default function Home() {
  const [lists, setLists] = useState<List[]>([]);

  const [form, setForm] = useState<CreateList>(EMPTY_FORM);
  const [selectedList, setSelectedList] = useState<List>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isDeleteConfirmationDialogOpen, setIsDeleteConfirmationDialogOpen] =
    useState<boolean>();
  const [search, setSearch] = useState<string>("");

  const filteredLists = useMemo<List[]>(() => {
    if (!search) return lists;

    const newLists = [];

    for (const list of lists) {
      if (list.name.includes(search)) {
        newLists.push(list);
      }
    }

    return newLists;
  }, [lists, search]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async function () {
    setIsLoading(true);
    setLoadError(null);

    try {
      setLists(await getLists());
    } catch (error) {
      console.error(error);
      setLoadError("Couldn't load lists.");
    }

    setIsLoading(false);
  };

  async function addList(data: CreateList) {
    try {
      const inserted = await createList(data);

      setLists((prev) => [...prev, inserted]);
      setIsDialogOpen(false);
      setForm(EMPTY_FORM);
      toast.success("List created!");
    } catch (error) {
      console.error(error);
      toast.error("Couldn't create the list.");
    }
  }

  async function editList(formData: CreateList) {
    assertList(selectedList);

    try {
      await updateList(selectedList.id, formData);

      setIsDialogOpen(false);
      setForm(EMPTY_FORM);
      setSelectedList(undefined);
      await loadData();
      toast.success("List updated!");
    } catch (error) {
      console.error(error);
      toast.error("Couldn't update the list.");
    }
  }

  function submit(event: React.SubmitEvent) {
    event.preventDefault();

    if (!selectedList) {
      addList(form);
    } else {
      editList(form);
    }
  }

  async function removeList() {
    assertList(selectedList);

    try {
      await deleteList(selectedList.id);
      await loadData();
      setIsDeleteConfirmationDialogOpen(false);
      setSelectedList(undefined);
      toast.success("List deleted!");
    } catch (error) {
      console.error(error);
      toast.error("Couldn't delete the list.");
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
  if (loadError) {
    content = (
      <div className="flex flex-col items-center gap-3" role="alert">
        <p>{loadError}</p>
        <Button onClick={() => loadData()}>Try again</Button>
      </div>
    );
  } else if (isLoading) {
    content = <Loader size="md" className="my-10"></Loader>;
  } else if (lists.length === 0) {
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
        onDelete={() => removeList()}
      ></DeleteConfirmationDialog>
    </div>
  );
}
