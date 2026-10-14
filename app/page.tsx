"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/Button";
import { InputText } from "@/components/InputText";
import { Card } from "@/components/Card";
import { Dialog } from "@/components/Dialog";
import Link from "next/link";

type List = {
  id: string;
  name: string;
  createdAt: Date;
  description: string;
};

export async function loadLists(setLists: (lists: List[]) => void) {
  const res = await fetch("/api/lists");
  const data = await res.json();
  setLists(data);
}

async function postList(newList: Omit<List, "id" | "createdAt">) {
  await fetch("/api/lists", {
    method: "POST",
    body: JSON.stringify(newList),
  });
}

export default function Home() {
  const [lists, setLists] = useState<List[]>([]);

  useEffect(() => {
    loadLists(setLists);
  }, []);

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  async function addList(event: React.SubmitEvent) {
    event.preventDefault();

    await postList({ name, description });
    await loadLists(setLists);
  }

  return (
    <div className="w-80 mx-auto mt-20">
      <h1 className="mb-5 text-xl">Lists</h1>
      <Button className="ml-auto" onClick={() => setIsDialogOpen(true)}>
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

            <Button className="ml-auto" onClick={() => setIsDialogOpen(false)}>
              Submit
            </Button>
          </form>
        </Card>
      </Dialog>

      <Card className="mt-7 flex flex-col gap-4">
        <ul>
          {lists.length ? (
            lists.map((list: List) => (
              <li className="flex justify-between" key={list.id}>
                <p>{list.name}</p>
                <Link
                  href={`/list/${list.id}`}
                  className="text-blue-400 underline"
                >
                  Go to list
                </Link>
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
