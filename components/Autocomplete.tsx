import { useId, useMemo, useState } from "react";
import { Menu } from "./Menu";

type Item = {
  text: string;
  value: string;
};

type AutocompleteProps = {
  className?: string;
  label?: string;
  id?: string;
  items: Item[];
  onSelectItem: (item: Item) => void;
};

export function Autocomplete({
  className,
  label,
  id,
  items,
  onSelectItem,
}: AutocompleteProps) {
  id ?? useId();

  const [search, setSearch] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const filteredItems = useMemo(() => {
    if (!search) return items;

    return items.filter((item) => item.text.includes(search));
  }, [search]);

  function onChange(event: React.ChangeEvent) {
    const value = (event.target as HTMLInputElement).value;

    setSearch(value);
  }

  return (
    <div className={className}>
      {label && <label htmlFor={id}>{label}</label>}
      <Menu
        activator={
          <input
            type="text"
            id={id}
            className="border border-gray-0 rounded p-1"
            value={search}
            onChange={onChange}
            onClick={() => setIsOpen(true)}
          />
        }
        className="w-full"
        open={isOpen}
        onToggle={(event) => setIsOpen(event.newState === "open")}
      >
        <ul className="p-5">
          {filteredItems.map((item) => (
            <li
              value={item.value}
              onClick={() => onSelectItem(item)}
              key={item.value}
              className="cursor-pointer"
            >
              {item.text}
            </li>
          ))}
        </ul>
      </Menu>
    </div>
  );
}
