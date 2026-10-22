import { InputHTMLAttributes, useId } from "react";
import { classesMerge } from "@/utils/component-classes";
import { Icon } from "./Icon";

type InputTextProps<T> = Partial<InputHTMLAttributes<HTMLInputElement>> & {
  state?: T;
  setState?: (value: T) => void;
  label?: string;
  /** Icon name pinned inside the input's right edge, e.g. "mdi:magnifier". */
  appendIcon?: string;
};

export function InputText<
  T extends string | number | readonly string[] | undefined,
>({ state, setState, label, appendIcon, id, ...nativeProps }: InputTextProps<T>) {
  // Hooks run unconditionally; the prop, when provided, wins.
  const autoId = useId();
  const inputId = id ?? autoId;

  function onChange(event: React.ChangeEvent) {
    if (!setState) return;

    const value = (event.target as HTMLInputElement).value;

    setState(value as T);
  }

  return (
    <div className="flex flex-col">
      {label && <label htmlFor={inputId}>{label}</label>}{" "}
      <div className="relative">
        <input
          type="text"
          id={inputId}
          onChange={onChange}
          value={state}
          className={classesMerge(
            "border border-gray-0 rounded p-1 w-full",
            appendIcon && "pr-8",
          )}
          {...nativeProps}
        />
        {appendIcon && (
          <Icon
            icon={appendIcon}
            className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-0"
          />
        )}
      </div>
    </div>
  );
}
