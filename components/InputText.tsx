import { InputHTMLAttributes } from "react";

type InputTextProps<T> = Partial<InputHTMLAttributes<HTMLInputElement>> & {
  state?: T;
  setState?: (value: T) => void;
  label?: string;
};

export function InputText<
  T extends string | number | readonly string[] | undefined,
>({ state, setState, label, id, ...nativeProps }: InputTextProps<T>) {
  id ??= crypto.randomUUID();

  function onChange(event: React.ChangeEvent) {
    if (!setState) return;

    const value = (event.target as HTMLInputElement).value;

    setState(value as T);
  }

  return (
    <div className="flex flex-col">
      {label && <label htmlFor={id}>{label}</label>}{" "}
      <input
        type="text"
        id={id}
        onChange={onChange}
        value={state}
        className="border border-gray-0 rounded p-1"
        {...nativeProps}
      />
    </div>
  );
}
