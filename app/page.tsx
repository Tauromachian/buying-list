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
  description: string;
};

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const [activeItems, setActiveItems] = useState<string[]>([]);

  function addItem(event: React.SubmitEvent) {
    event.preventDefault();

    setItems([...items, { id: crypto.randomUUID(), name, description }]);
  }

  return (
    <div className="w-80 mx-auto mt-20">
      <h1 className="mb-5 text-xl">Add Item</h1>
      <Button className="ml-auto mb-5" onClick={() => setIsDialogOpen(true)}>
        Add Item
      </Button>

      <Dialog open={isDialogOpen} onClose={setIsDialogOpen}>
        <Card>
          <form onSubmit={addItem} className="flex flex-col gap-3">
            <InputText label="Name" value={name} setValue={setName}></InputText>
            <InputText
              label="Description (optional)"
              value={description}
              setValue={setDescription}
            ></InputText>

            <Button className="ml-auto">Submit</Button>
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
            ></Checkbox>
          ))
        ) : (
          <div>Nothing yet, Add something!</div>
        )}
      </Card>
    </div>
  );
}
