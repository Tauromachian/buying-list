import { useEffect, useId, useMemo, useState } from "react";
import { classesMerge } from "@/utils/component-classes";
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
  // Hooks run unconditionally; the prop, when provided, wins.
  const autoId = useId();
  const inputId = id ?? autoId;

  const listboxId = `${inputId}-listbox`;
  const optionId = (index: number) => `${listboxId}-${index}`;

  const [search, setSearch] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [highlightIndex, setHighlightIndex] = useState<number>(0);

  const filteredItems = useMemo(() => {
    if (!search) return items;

    return items.filter((item) => item.text.includes(search));
  }, [items, search]);

  // Filtering reshuffles which candidate is "current", so the highlight
  // restarts from the top whenever the list or query changes.
  useEffect(() => {
    setHighlightIndex(0);
  }, [items, search]);

  // Keep the highlighted option visible when the listbox scrolls.
  useEffect(() => {
    if (!isOpen) return;

    document
      .getElementById(optionId(highlightIndex))
      ?.scrollIntoView({ block: "nearest" });
  }, [highlightIndex, isOpen]);

  function onChange(event: React.ChangeEvent) {
    const value = (event.target as HTMLInputElement).value;

    setSearch(value);
  }

  function onToggle(event: React.ToggleEvent) {
    const open = event.newState === "open";

    setIsOpen(open);

    if (!open) setHighlightIndex(0);
  }

  function selectItem(item: Item) {
    onSelectItem(item);
    setSearch(item.text);
    setIsOpen(false);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (filteredItems.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();

      if (isOpen) {
        setHighlightIndex((index) =>
          Math.min(index + 1, filteredItems.length - 1),
        );
      } else {
        setIsOpen(true);
      }
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      if (isOpen) {
        setHighlightIndex((index) => Math.max(index - 1, 0));
      } else {
        // Open straight onto the last item.
        setIsOpen(true);
        setHighlightIndex(filteredItems.length - 1);
      }
    }

    if (event.key === "Enter" && isOpen) {
      const highlighted = filteredItems[highlightIndex];

      if (highlighted) {
        event.preventDefault();
        selectItem(highlighted);
      }
    }
  }

  return (
    <div className={className}>
      {label && <label htmlFor={inputId}>{label}</label>}
      <Menu
        activator={
          <input
            type="text"
            id={inputId}
            className="border border-gray-0 rounded p-1"
            role="combobox"
            aria-expanded={isOpen}
            aria-controls={listboxId}
            aria-activedescendant={
              isOpen ? optionId(highlightIndex) : undefined
            }
            aria-autocomplete="list"
            value={search}
            onChange={onChange}
            onKeyDown={onKeyDown}
            onClick={() => setIsOpen(true)}
          />
        }
        className="w-full"
        open={isOpen}
        onToggle={onToggle}
      >
        <ul
          id={listboxId}
          role="listbox"
          className="max-h-64 overflow-y-auto p-5"
        >
          {filteredItems.map((item, index) => (
            <li
              id={optionId(index)}
              role="option"
              aria-selected={index === highlightIndex}
              onClick={() => selectItem(item)}
              key={item.value}
              className={classesMerge(
                "cursor-pointer rounded-sm p-3",
                index === highlightIndex && "bg-gray-300 text-black",
              )}
            >
              {item.text}
            </li>
          ))}
        </ul>
      </Menu>
    </div>
  );
}
