import { classesMerge } from "@/utils/component-classes";

type StepProps = {
  label: string;
  stepsValues: {
    start: string | number;
    middle?: string | number;
    end: string | number;
  };
  state: string | number;
  setState: (state: string | number) => void;
  className?: string;
};

export function Switch({ label, state, setState, stepsValues }: StepProps) {
  let knobClasses = ["bg-text-0"];

  const knobClassesByStep: Record<string, string[]> = {
    [stepsValues.start]: [],
    [stepsValues.end]: ["translate-x-6"],
  };

  if (stepsValues.middle) {
    knobClassesByStep[stepsValues.middle] = ["translate-x-3"];
  }

  knobClasses.push(...knobClassesByStep[state]);

  function nextStep() {
    let step = state;

    if (step === stepsValues.start) {
      if (stepsValues.middle) {
        setState(stepsValues.middle);
      } else {
        setState(stepsValues.end);
      }
    }

    if (step === stepsValues.middle) {
      setState(stepsValues.end);
    }

    if (step === stepsValues.end) {
      setState(stepsValues.start);
    }
  }

  return (
    <div className="flex items-center">
      <button
        type="button"
        className="rounded-full bg-neutral-1 w-12 h-6 cursor-pointer"
        onClick={nextStep}
      >
        <div
          className={classesMerge(
            "rounded-full h-4 w-4 transition duration-200 ease-in-out cursor-pointer ml-1",
            knobClasses,
          )}
        ></div>
      </button>
      <label className="cursor-pointer pl-1 text-text-1" onClick={nextStep}>
        {label}
      </label>
    </div>
  );
}
