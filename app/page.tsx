"use client";

import { useState } from "react";

import { Button } from "@/components/Button";
import { InputText } from "@/components/InputText";
import { Card } from "@/components/Card";
import { Checkbox } from "@/components/Checkbox";

type Item = {
  id: string;
  name: string;
  description: string;
};

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const [activeItems, setActiveItems] = useState<string[]>([]);

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
            label="Description (optional)"
            value={description}
            setValue={setDescription}
          ></InputText>

          <Button className="ml-auto">Add Item</Button>
        </form>
      </Card>
      <Card className="mt-7">
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
