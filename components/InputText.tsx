import { BaseComponent } from "@/types/Component";
import { InputHTMLAttributes } from "react";

type InputTextProps = BaseComponent &
  Partial<InputHTMLAttributes<HTMLInputElement>> & {
    state?: string | number | readonly string[];
    setState?: (value: string) => void;
    label?: string;
  };

export function InputText({
  state: value,
  setState,
  label,
  id,
  ...nativeProps
}: InputTextProps) {
  id ??= crypto.randomUUID();

  function onChange(event: React.ChangeEvent) {
    if (!setState) return;

    const value = (event.target as HTMLInputElement).value;

    setState(value);
  }

  return (
    <div className="flex flex-col">
      {label && <label htmlFor={id}>{label}</label>}{" "}
      <input
        type="text"
        id={id}
        onChange={onChange}
        value={value}
        className="border border-gray-0 rounded p-1"
        {...nativeProps}
      />
    </div>
  );
}
