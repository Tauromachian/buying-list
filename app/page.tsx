"use client";

import { useState } from "react";

import { Button } from "@/components/Button";
import { InputText } from "@/components/InputText";
import { Card } from "@/components/Card";

type Item = {
  id: string;
  name: string;
  description: string;
};

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  function addItem(event: React.SubmitEvent) {
    event.preventDefault();

    setItems([...items, { id: crypto.randomUUID(), name, description }]);
  }

  return (
    <div className="w-80 mx-auto">
      <Card className="mt-20">
        <form onSubmit={addItem} className="flex flex-col gap-3">
          <InputText label="Name" value={name} setValue={setName}></InputText>
          <InputText
            label="Description"
            value={description}
            setValue={setDescription}
          ></InputText>

          <Button className="ml-auto">Add Item</Button>
        </form>
      </Card>
      <Card className="mt-7">
        <ul>
          {items.length ? (
            items.map((item: Item) => (
              <li>
                <p className="font-bold">{item.name}</p>
                <p className="opacity-80">{item.description}</p>
              </li>
            ))
          ) : (
            <div>Nothing yet, Add something!</div>
          )}
        </ul>
      </Card>
    </div>
  );
}
