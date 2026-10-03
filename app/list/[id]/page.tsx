"use client";

import { useState } from "react";

import { Button } from "@/components/Button";
import { InputText } from "@/components/InputText";
import { Card } from "@/components/Card";
import { Checkbox } from "@/components/Checkbox";
import { Dialog } from "@/components/Dialog";

type Item = {
  id: string;
  name: string;
  itemsNumber: number;
  description: string;
};

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);

  const [name, setName] = useState<string>("");
  const [itemsNumber, setItemsNumber] = useState<number>(1);
  const [description, setDescription] = useState<string>("");

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const [activeItems, setActiveItems] = useState<string[]>([]);

  function addItem(event: React.SubmitEvent) {
    event.preventDefault();

    setItems([
      ...items,
      { id: crypto.randomUUID(), name, itemsNumber, description },
    ]);
  }

  return (
    <div className="w-80 mx-auto mt-20">
      <h1 className="mb-5 text-xl">List</h1>
      <Button className="ml-auto mb-5" onClick={() => setIsDialogOpen(true)}>
        Add Item
      </Button>

      <Dialog open={isDialogOpen} onClose={setIsDialogOpen}>
        <Card>
          <p className="text-md font-bold mb-4">Add new item to list</p>

          <form onSubmit={addItem} className="flex flex-col gap-3">
            <InputText label="Name" state={name} setState={setName}></InputText>

            <InputText
              label="Number"
              state={itemsNumber}
              setState={setItemsNumber}
              type="number"
              min={1}
            ></InputText>

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
        {items.length ? (
          items.map((item: Item) => (
            <Checkbox
              key={item.id}
              label={item.name}
              id={item.id}
              value={item.id}
              state={activeItems}
              setState={setActiveItems}
              hasStrikeThrough
            ></Checkbox>
          ))
        ) : (
          <div>Nothing yet, Add something!</div>
        )}
      </Card>
    </div>
  );
}
