"use client";

import { useState } from "react";

import { Button } from "@/components/Button";
import { InputText } from "@/components/InputText";
import { Card } from "@/components/Card";
import { Dialog } from "@/components/Dialog";

type Item = {
  id: string;
  name: string;
  createdAt: Date;
  description: string;
};

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  function addItem(event: React.SubmitEvent) {
    event.preventDefault();

    setItems([
      ...items,
      { id: crypto.randomUUID(), name, createdAt: new Date(), description },
    ]);
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

          <form onSubmit={addItem} className="flex flex-col gap-3">
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
          {items.length ? (
            items.map((item: Item) => <li>{item.name}</li>)
          ) : (
            <div>Nothing yet, Add something!</div>
          )}
        </ul>
      </Card>
    </div>
  );
}
