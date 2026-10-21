"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { type BreadcrumbItem, Breadcrumbs } from "@/components/Breadcrumbs";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Checkbox } from "@/components/Checkbox";
import { EmptyState } from "@/components/EmptyState";
import { Dialog } from "@/components/Dialog";
import { InputText } from "@/components/InputText";
import { createItem, getItems } from "@/lib/api/items";
import type { CreateItem, Item } from "@/lib/dto/item";
import { Loader } from "@/components/Loader";

type ItemForm = Pick<CreateItem, "name" | "quantity">;

const EMPTY_FORM: ItemForm = { name: "", quantity: 1 };

function ItemRow({
  item,
  activeItems,
  setActiveItems,
}: {
  item: Item;
  activeItems: string[];
  setActiveItems: (ids: string[]) => void;
}) {
  const itemId = String(item.id);

  return (
    <Checkbox
      id={itemId}
      value={itemId}
      state={activeItems}
      setState={setActiveItems}
      hasStrikeThrough
    >
      <span className="flex justify-between ml-2 w-full">
        <p>{item.name}</p>
        <p className="font-bold">#{item.quantity}</p>
      </span>
    </Checkbox>
  );
}

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);

  const { id } = useParams<{ id: string }>();
  const listId = id;

  useEffect(() => {
    loadData(Number(listId));
  }, [listId]);

  const [form, setForm] = useState<ItemForm>(EMPTY_FORM);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [activeItems, setActiveItems] = useState<string[]>([]);

  const loadData = async function (currentListId: number) {
    setIsLoading(true);
    setLoadError(null);

    try {
      setItems(await getItems({ listId: currentListId }));
    } catch (error) {
      console.error(error);
      setLoadError("Couldn't load items.");
    }

    setIsLoading(false);
  };

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
      ...form,
      listId: Number(listId),
      checked: false,
    };

    try {
      const item = await createItem(data);

      setItems((prev) => [...prev, item]);
      setIsDialogOpen(false);
      setForm(EMPTY_FORM);
    } catch (error) {
      console.error(error);
    }
  }

  function openAddItemDialog() {
    setForm(EMPTY_FORM);
    setIsDialogOpen(true);
  }

  let content: React.ReactNode;
  if (loadError) {
    content = (
      <div className="flex flex-col items-center gap-3" role="alert">
        <p>{loadError}</p>
        <Button onClick={() => loadData(Number(listId))}>Try again</Button>
      </div>
    );
  } else if (isLoading) {
    content = <Loader size="md"></Loader>;
  } else if (items.length === 0) {
    content = <EmptyState />;
  } else {
    content = items.map((item) => (
      <ItemRow
        key={item.id}
        item={item}
        activeItems={activeItems}
        setActiveItems={setActiveItems}
      />
    ));
  }

  return (
    <div className="w-80 mx-auto mt-20">
      <Card className="mb-5 bg-gray-200" variant="flat">
        <Breadcrumbs breadcrumbs={breadcrumbs}></Breadcrumbs>
      </Card>

      <h1 className="mb-5 text-xl">List</h1>

      <Button className="ml-auto" onClick={openAddItemDialog}>
        Add Item
      </Button>

      <Dialog open={isDialogOpen} onClose={setIsDialogOpen}>
        <Card>
          <p className="text-md font-bold mb-4">Add new item to list</p>

          <form onSubmit={addItem} className="flex flex-col gap-3">
            <InputText
              label="Name"
              state={form.name}
              setState={(name) => setForm((prev) => ({ ...prev, name }))}
            ></InputText>

            <InputText
              label="Number"
              state={form.quantity}
              // InputText always emits the raw DOM value (a string), even for
              // type="number" — coerce explicitly so `quantity` stays a number.
              setState={(quantity) =>
                setForm((prev) => ({ ...prev, quantity: Number(quantity) }))
              }
              type="number"
              min={1}
            ></InputText>

            <Button className="ml-auto">Submit</Button>
          </form>
        </Card>
      </Dialog>

      <Card className="mt-7 flex flex-col gap-4">{content}</Card>
    </div>
  );
}
