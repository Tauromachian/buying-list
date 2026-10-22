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
import { Loader } from "@/components/Loader";
import { Menu } from "@/components/Menu";

import { createItem, getItems, deleteItem, updateItem } from "@/lib/api/items";
import type { CreateItem, Item } from "@/lib/dto/item";
import { Icon } from "@/components/Icon";
import { DeleteConfirmationDialog } from "@/components/DeleteConfirmationDialog";
import { toast } from "react-toastify";

function assertItem(item?: Item, msg?: string): asserts item is Item {
  msg ??= "This object should be of type Item.";

  if (!item) throw new Error(msg);

  if (!item.id || !item.name) throw new Error(msg);
}

type ItemForm = Pick<CreateItem, "name" | "quantity" | "listId">;

const EMPTY_FORM: ItemForm = { name: "", quantity: 1, listId: 0 };

function ItemRow({
  item,
  activeItems,
  setActiveItems,
  onClickEdit,
  onClickDelete,
}: {
  item: Item;
  activeItems: string[];
  setActiveItems: (ids: string[]) => void;
  onClickEdit: () => void;
  onClickDelete: () => void;
}) {
  const itemId = String(item.id);

  return (
    <div className="flex items-center">
      <Checkbox
        id={itemId}
        value={itemId}
        state={activeItems}
        setState={setActiveItems}
        hasStrikeThrough
      >
        <span className="flex justify-between ml-2 w-full">
          <p>{item.name}</p>
        </span>
      </Checkbox>

      <p className="font-bold ml-auto mr-3">#{item.quantity}</p>

      <Menu
        activator={
          <Button variant="outlined" icon>
            <Icon icon="mdi:dots-vertical"></Icon>
          </Button>
        }
      >
        <Button variant="text" onClick={onClickEdit}>
          Edit
        </Button>
        <Button variant="text" onClick={onClickDelete}>
          Delete
        </Button>
      </Menu>
    </div>
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
  const [isDeleteConfirmationDialogOpen, setIsDeleteConfirmationDialogOpen] =
    useState<boolean>();

  const [activeItems, setActiveItems] = useState<string[]>([]);

  const [selectedItem, setSelectedItem] = useState<Item>();

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

  function submit(event: React.SubmitEvent) {
    event.preventDefault();

    if (!selectedItem) {
      addItem({ ...form, checked: false, listId: Number(listId) });
    } else {
      editItem(form);
    }
  }

  async function addItem(data: CreateItem) {
    try {
      const inserted = await createItem(data);

      setItems((prev) => [...prev, inserted]);
      setIsDialogOpen(false);
      setForm({ ...EMPTY_FORM, listId: Number(listId) });
      toast.success("Item added!");
    } catch (error) {
      console.error(error);
      toast.error("Couldn't add the item.");
    }
  }

  async function editItem(formData: Partial<Item>) {
    assertItem(selectedItem);

    try {
      await updateItem(selectedItem.id, formData);

      setIsDialogOpen(false);
      setForm(EMPTY_FORM);
      setSelectedItem(undefined);
      await loadData(Number(listId));
      toast.success("Item updated!");
    } catch (error) {
      console.error(error);
      toast.error("Couldn't update the item.");
    }
  }

  function openFormDialog(type: "add" | "edit", item?: Item) {
    if (type === "edit") {
      if (!item) {
        throw new Error("Open dialog in edit mode should always have a item");
      }

      setSelectedItem(item);

      setForm({
        name: item.name,
        quantity: item.quantity,
        listId: Number(listId),
      });
    } else {
      setForm(EMPTY_FORM);
    }

    setIsDialogOpen(true);
  }

  function openDeleteConfirmationDialog(item: Item) {
    setSelectedItem(item);
    setIsDeleteConfirmationDialogOpen(true);
  }

  async function removeItem() {
    assertItem(selectedItem);

    try {
      await deleteItem(selectedItem.id);
      await loadData(Number(listId));
      setIsDeleteConfirmationDialogOpen(false);
      setSelectedItem(undefined);
      toast.success("Item deleted!");
    } catch (error) {
      console.error(error);
      toast.error("Couldn't delete the item.");
    }
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
    content = <Loader size="md" className="my-10"></Loader>;
  } else if (items.length === 0) {
    content = <EmptyState />;
  } else {
    content = items.map((item) => (
      <ItemRow
        key={item.id}
        item={item}
        activeItems={activeItems}
        setActiveItems={setActiveItems}
        onClickEdit={() => openFormDialog("edit", item)}
        onClickDelete={() => openDeleteConfirmationDialog(item)}
      />
    ));
  }

  return (
    <div className="w-80 mx-auto mt-20">
      <Card className="mb-5 bg-gray-200" variant="flat">
        <Breadcrumbs breadcrumbs={breadcrumbs}></Breadcrumbs>
      </Card>

      <h1 className="mb-5 text-xl">List</h1>

      <Button className="ml-auto" onClick={() => openFormDialog("add")}>
        Add Item
      </Button>

      <Dialog open={isDialogOpen} onClose={setIsDialogOpen}>
        <Card>
          <p className="text-md font-bold mb-4">Add new item to list</p>

          <form onSubmit={submit} className="flex flex-col gap-3">
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

      <DeleteConfirmationDialog
        open={isDeleteConfirmationDialogOpen}
        onClose={() => setIsDeleteConfirmationDialogOpen(false)}
        onDelete={() => removeItem()}
      ></DeleteConfirmationDialog>
    </div>
  );
}
