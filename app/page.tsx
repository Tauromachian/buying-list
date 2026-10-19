"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/Button";
import { InputText } from "@/components/InputText";
import { Card } from "@/components/Card";
import { Dialog } from "@/components/Dialog";
import Link from "next/link";

type List = {
  id: number;
  name: string;
  createdAt: string;
  description?: string;
};

export async function loadLists() {
  try {
    const res = await fetch("/api/lists");
    const data = await res.json();

    return data;
  } catch (error) {
    console.warn(error);
  }
}

async function postList(
  newList: Omit<List, "id" | "createdAt">,
): Promise<List | undefined> {
  try {
    const res = await fetch("/api/lists", {
      method: "POST",
      body: JSON.stringify(newList),
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      throw new Error("Res not ok");
    }

    const insertedList: List = await res.json();
    return insertedList;
  } catch (error) {
    console.warn(error);
  }
}

export default function Home() {
  const [lists, setLists] = useState<List[]>([]);

  useEffect(() => {
    async function run() {
      const lists = await loadLists();

      if (!lists) return;

      setLists(lists);
    }

    run();
  }, []);

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  async function addList(event: React.SubmitEvent) {
    event.preventDefault();

    const inserted = await postList({ name, description });

    if (!inserted) return;

    setLists((prev) => [...prev, inserted]);
    setIsDialogOpen(false);
    clearFields();
  }

  function clearFields() {
    setName("");
    setDescription("");
  }

  function submit(event: React.SubmitEvent) {
    event.preventDefault();

    const form = new FormData(event.target);
    const data = Object.fromEntries(form.entries()) as unknown as List;

    if (!selectedList) {
      addList(data);
    }
  }

  function openDialog(type: "add" | "edit", list?: List) {
    if (type === "edit") {
      if (!list) {
        throw new Error("Open dialog in edit mode should always have a list");
      }

      selectedList = list;
    }

    setIsDialogOpen(true);
  }

  return (
    <div className="w-80 mx-auto mt-20">
      <h1 className="mb-5 text-xl">Lists</h1>
      <Button className="ml-auto" onClick={() => openDialog("add")}>
        Create List
      </Button>

      <Dialog open={isDialogOpen} onClose={setIsDialogOpen}>
        <Card>
          <p className="text-md font-bold mb-4">Add new item to list</p>

          <form onSubmit={addList} className="flex flex-col gap-3">
            <InputText label="Name" state={name} setState={setName}></InputText>

            <InputText
              label="Description (optional)"
              state={description}
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
                <Link
                  href={`/list/${list.id}`}
                  className="text-blue-400 underline ml-auto mr-4"
                >
                  Go to list
                </Link>
                <Button>Edit</Button>
              </li>
            ))
          ) : (
            <li>Nothing yet, Add something!</li>
          )}
        </ul>
      </Card>
    </div>
  );
}
