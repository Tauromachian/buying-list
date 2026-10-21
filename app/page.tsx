"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { DeleteConfirmationDialog } from "@/components/DeleteConfirmationDialog";
import { Dialog } from "@/components/Dialog";
import { InputText } from "@/components/InputText";

import { createList, deleteList, getLists, updateList } from "@/lib/api/lists";
import type { CreateList, List } from "@/lib/dto/list";

function assertList(list?: List, msg?: string): asserts list is List {
  msg ??= "This object should be of type List.";

  if (!list) throw new Error(msg);

  if (!list.id || !list.name) throw new Error(msg);
}

export default function Home() {
  const [lists, setLists] = useState<List[]>([]);

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedList, setSelectedList] = useState<List>();

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isDeleteConfirmationDialogOpen, setIsDeleteConfirmationDialogOpen] =
    useState<boolean>();

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLists(await getLists());
    } catch (error) {
      console.error(error);
    }
  }

  async function addList(data: CreateList) {
    try {
      const inserted = await createList(data);

      setLists((prev) => [...prev, inserted]);
      setIsDialogOpen(false);
      clearFields();
    } catch (error) {
      console.error(error);
    }
  }

  async function editList(formData: CreateList) {
    assertList(selectedList);

    try {
      await updateList(selectedList.id, formData);

      setIsDialogOpen(false);
      clearFields();
      setSelectedList(undefined);
      await loadData();
    } catch (error) {
      console.error(error);
    }
  }

  function clearFields() {
    setName("");
    setDescription("");
  }

  function submit(event: React.SubmitEvent) {
    event.preventDefault();

    const data: CreateList = { name, description };

    if (!selectedList) {
      addList(data);
    } else {
      editList(data);
    }
  }

  async function removeList() {
    assertList(selectedList);

    try {
      await deleteList(selectedList.id);
      await loadData();
      setIsDeleteConfirmationDialogOpen(false);
      setSelectedList(undefined);
    } catch (error) {
      console.error(error);
    }
  }

  function openDialog(type: "add" | "edit", list?: List) {
    if (type === "edit") {
      if (!list) {
        throw new Error("Open dialog in edit mode should always have a list");
      }

      setSelectedList(list);

      setName(list.name);
      setDescription(list.description ?? "");
    } else {
      clearFields();
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
