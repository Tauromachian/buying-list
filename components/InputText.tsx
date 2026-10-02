type InputTextProps = {
  value?: string | number | readonly string[];
  setValue?: (value: string) => void;
  label?: string;
  id?: string;
};

export function InputText({ value, setValue, label, id }: InputTextProps) {
  id ??= crypto.randomUUID();

  function onChange(event: React.ChangeEvent) {
    if (!setValue) return;

    const value = (event.target as HTMLInputElement).value;

    setValue(value);
  }

  return (
    <>
      {label && <label htmlFor={id}>{label}</label>}{" "}
      <input type="text" id={id} onChange={onChange} value={value} />
    </>
  );
}
