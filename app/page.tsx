"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/Button";
import { InputText } from "@/components/InputText";
import { Card } from "@/components/Card";
import { Dialog } from "@/components/Dialog";
import Link from "next/link";
import { GeneralResNotOk } from "@/utils/errors";
import { DeleteConfirmationDialog } from "@/components/DeleteConfirmationDialog";

type List = {
  id: number;
  name: string;
  createdAt: string;
  description?: string;
};

type FormList = Omit<List, "id" | "createdAt">;

function assertList(list?: List, msg?: string): asserts list is List {
  msg ??= "This object should be of type List.";

  if (!list) throw new Error(msg);

  if (!list.id || !list.name) throw new Error(msg);
}

export async function loadLists() {
  try {
    const res = await fetch("/api/lists");
    const data = await res.json();

    return data;
  } catch (error) {
    console.warn(error);
  }
}

async function postList(newList: FormList): Promise<List | undefined> {
  try {
    const res = await fetch("/api/lists", {
      method: "POST",
      body: JSON.stringify(newList),
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) throw new GeneralResNotOk(res);

    const insertedList: List = await res.json();
    return insertedList;
  } catch (error) {
    console.warn(error);
  }
}

async function patchList(list: List) {
  try {
    const res = await fetch(`/api/lists/${list.id}`, {
      method: "PATCH",
      body: JSON.stringify(list),
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) throw new GeneralResNotOk(res);
  } catch (error) {
    console.error(error);
  }
}

export async function deleteList(id: number) {
  try {
    const res = await fetch(`/api/lists/${id}`, { method: "DELETE" });

    if (!res.ok) throw new GeneralResNotOk(res);
  } catch (error) {
    console.error(error);
  }
}

export default function Home() {
  const [lists, setLists] = useState<List[]>([]);

  async function loadData() {
    const lists = await loadLists();

    if (!lists) return;

    setLists(lists);
  }

  useEffect(() => {
    loadData();
  }, []);

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedList, setSelectedList] = useState<List>();

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isDeleteConfirmationDialogOpen, setIsDeleteConfirmationDialogOpen] =
    useState<boolean>();

  async function addList(data: FormList) {
    const inserted = await postList(data);

    if (!inserted) return;

    setLists((prev) => [...prev, inserted]);
    setIsDialogOpen(false);
    clearFields();
  }

  async function editList(formData: FormList) {
    assertList(selectedList);

    const data = { ...selectedList, ...formData };

    await patchList(data);

    setIsDialogOpen(false);
    clearFields();
    setSelectedList(undefined);
    loadData();
  }

  function clearFields() {
    setName("");
    setDescription("");
  }

  function submit(event: React.SubmitEvent) {
    event.preventDefault();

    const data: FormList = { name, description };

    if (!selectedList) {
      addList(data);
    } else {
      editList(data);
    }
  }

  async function removeList() {
    assertList(selectedList);

    await deleteList(selectedList.id);
    loadData();
    setIsDeleteConfirmationDialogOpen(false);
    setSelectedList(undefined);
  }

  function openDialog(type: "add" | "edit", list?: List) {
    if (type === "edit") {
      if (!list) {
        throw new Error("Open dialog in edit mode should always have a list");
      }

      setSelectedList(list);

      setName(list.name);
      setDescription(list.description ?? "");
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

  return (
    <div className="w-140 mx-auto mt-20">
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
              state={name}
              setState={setName}
              name="name"
            ></InputText>

            <InputText
              label="Description (optional)"
              state={description}
              name="description"
              setState={setDescription}
            ></InputText>

            <Button className="ml-auto">Submit</Button>
          </form>
        </Card>
      </Dialog>

      <Card className="mt-7 flex flex-col gap-4">
        <ul className="flex flex-col gap-4">
          {lists.length ? (
            lists.map((list: List) => (
              <li className="flex justify-between items-center" key={list.id}>
                <p>{list.name}</p>
                <div className="flex gap-4 ml-auto items-center">
                  <Link
                    href={`/list/${list.id}`}
                    className="text-blue-400 underline ml-auto mr-4"
                  >
                    Go to list
                  </Link>
                  <Button onClick={() => openDialog("edit", list)}>Edit</Button>
                  <Button onClick={() => openDeleteConfirmationDialog(list)}>
                    Delete
                  </Button>
                </div>
              </li>
            ))
          ) : (
            <li>Nothing yet, Add something!</li>
          )}
        </ul>
      </Card>

      <DeleteConfirmationDialog
        open={isDeleteConfirmationDialogOpen}
        onClose={() => setIsDeleteConfirmationDialogOpen(false)}
        onDelete={() => removeList()}
      ></DeleteConfirmationDialog>
    </div>
  );
}
