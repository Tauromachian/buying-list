import { useEffect, useState } from "react";

import { FormInput } from "@/types/Component";
import { classesMerge } from "@/utils/component-classes";

type CheckboxProps = FormInput & {
  value?: string;
  state: readonly string[];
  setState?: (value: string[]) => void;
};

export function Checkbox({ label, id, value, state, setState }: CheckboxProps) {
  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    if (!value) return;

    console.log(state);

    setIsActive(state.includes(value));
  }, [state]);

  id ??= crypto.randomUUID();

  function update() {
    if (!setState || !value) return;

    const indexOfValue = state.indexOf(value);

    if (indexOfValue === -1) {
      setState([...state, value]);
    } else {
      setState([...state.toSpliced(indexOfValue, 1)]);
    }
  }

  return (
    <label htmlFor={id} className="cursor-pointer flex">
      <div
        className={classesMerge(
          "h-6 w-6 border border-gray-50 rounded flex justify-center items-center",
          isActive && "bg-amber-600",
        )}
      >
        {isActive && <iconify-icon icon="mdi:check" height={20} width={20} />}
      </div>

      <input
        type="checkbox"
        id={id}
        value={value}
        onChange={update}
        className="w-0 h-0"
      />
      <span className="ml-2">{label}</span>
    </label>
  );
}
