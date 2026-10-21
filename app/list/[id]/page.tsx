"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { type BreadcrumbItem, Breadcrumbs } from "@/components/Breadcrumbs";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Checkbox } from "@/components/Checkbox";
import { Dialog } from "@/components/Dialog";
import { InputText } from "@/components/InputText";
import { createItem, getItems } from "@/lib/api/items";
import type { CreateItem, Item } from "@/lib/dto/item";

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);

  const { id } = useParams<{ id: string }>();
  const listId = id;

  useEffect(() => {
    loadData(Number(listId));
  }, [listId]);

  async function loadData(listId: number) {
    try {
      setItems(await getItems({ listId }));
    } catch (error) {
      console.error(error);
    }
  }

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

    const data: CreateItem = {
      name,
      quantity,
      listId: Number(listId),
      checked: false,
    };

    try {
      const item = await createItem(data);

      setItems((prev) => [...prev, item]);
      setIsDialogOpen(false);
      clearFields();
    } catch (error) {
      console.error(error);
    }
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
              id={String(item.id)}
              value={String(item.id)}
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
