"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/Button";
import { InputText } from "@/components/InputText";
import { Card } from "@/components/Card";
import { Checkbox } from "@/components/Checkbox";
import { Dialog } from "@/components/Dialog";
import { Breadcrumbs, BreadcrumbItem } from "@/components/Breadcrumbs";
import { useParams } from "next/navigation";

type Item = {
  id: string;
  listId: string;
  name: string;
  quantity: number;
};

const BASE = "/api/items";

async function loadItems(filters?: {
  listId: string;
}): Promise<Item[] | undefined> {
  let endpoint = BASE;

  if (filters) {
    endpoint += "?" + new URLSearchParams(filters).toString();
  }

  try {
    const res = await fetch(endpoint);

    const items = await res.json();

    return items;
  } catch (error) {
    console.warn(error);
  }
}

async function postItem(item: Omit<Item, "id">): Promise<Item | undefined> {
  try {
    const res = await fetch(BASE, {
      method: "POST",
      body: JSON.stringify(item),
      headers: { "Content-Type": "application/json" },
    });

    const insertedItem: Item = await res.json();

    return insertedItem;
  } catch (error) {
    console.error(error);
  }
}

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);

  const { id } = useParams<{ id: string }>();
  const listId = id;

  useEffect(() => {
    async function run() {
      const items = await loadItems({ listId });

      if (!items) return;

      setItems(items);
    }

    run();
  }, []);

  const [name, setName] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const [activeItems, setActiveItems] = useState<string[]>([]);

  const breadcrumbs: BreadcrumbItem[] = [
    {
      text: "Lists",
      href: "/",
    },
    {
      text: "This list",
    },
  ];

  async function addItem(event: React.SubmitEvent) {
    event.preventDefault();

    const createItem = {
      name,
      quantity,
      listId: Number(listId),
    };

    const item = await postItem(createItem);

    if (!item) return;

    setItems([...items, item]);
    setIsDialogOpen(false);
    clearFields();
  }

  function clearFields() {
    setName("");
    setQuantity(1);
  }

  return (
    <div className="w-80 mx-auto mt-20">
      <Card className="mb-5 bg-gray-200" variant="flat">
        <Breadcrumbs breadcrumbs={breadcrumbs}></Breadcrumbs>
      </Card>

      <h1 className="mb-5 text-xl">List</h1>

      <Button className="ml-auto" onClick={() => setIsDialogOpen(true)}>
        Add Item
      </Button>

      <Dialog open={isDialogOpen} onClose={setIsDialogOpen}>
        <Card>
          <p className="text-md font-bold mb-4">Add new item to list</p>

          <form onSubmit={addItem} className="flex flex-col gap-3">
            <InputText label="Name" state={name} setState={setName}></InputText>

            <InputText
              label="Number"
              state={quantity}
              setState={setQuantity}
              type="number"
              min={1}
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
              id={item.id}
              value={item.id}
              state={activeItems}
              setState={setActiveItems}
              hasStrikeThrough
            >
              <span className="flex justify-between ml-2 w-full">
                <p>{item.name}</p>
                <p className="font-bold">#{item.quantity}</p>
              </span>
            </Checkbox>
          ))
        ) : (
          <div>Nothing yet, Add something!</div>
        )}
      </Card>
    </div>
  );
}
