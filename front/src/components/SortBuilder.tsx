import { Button, Panel, Select } from "@/components/ui";
import type { SortDirection, SortRule } from "@/lib/sorting";

type SortOption<Field extends string> = {
  value: Field;
  label: string;
};

export const SortBuilder = <Field extends string>({
  label,
  rules,
  options,
  onChange
}: {
  label: string;
  rules: SortRule<Field>[];
  options: SortOption<Field>[];
  onChange: (rules: SortRule<Field>[]) => void;
}) => {
  const addRule = () => {
    const firstOption = options[0];
    if (!firstOption) {
      return;
    }

    onChange([...rules, { field: firstOption.value, direction: "asc" }]);
  };

  const updateRule = (
    index: number,
    updates: Partial<SortRule<Field>>
  ) => {
    onChange(
      rules.map((rule, ruleIndex) =>
        ruleIndex === index ? { ...rule, ...updates } : rule
      )
    );
  };

  const removeRule = (index: number) => {
    onChange(rules.filter((_, ruleIndex) => ruleIndex !== index));
  };

  return (
    <Panel className="grid gap-3">
      <p className="theme-muted text-sm">{label}</p>

      {rules.length === 0 ? (
        <p className="theme-muted text-sm">
          Sin orden personalizado. Puedes agregar una o varias capas.
        </p>
      ) : null}

      {rules.map((rule, index) => (
        <div key={`${rule.field}-${index}`} className="grid grid-cols-[1fr_112px_84px] gap-2">
          <Select
            value={rule.field}
            onChange={(event) =>
              updateRule(index, { field: event.target.value as Field })
            }
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>

          <Select
            value={rule.direction}
            onChange={(event) =>
              updateRule(index, {
                direction: event.target.value as SortDirection
              })
            }
          >
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </Select>

          <Button variant="ghost" onClick={() => removeRule(index)}>
            Quitar
          </Button>
        </div>
      ))}

      <Button variant="secondary" className="w-full" onClick={addRule}>
        Agregar orden
      </Button>
    </Panel>
  );
};
