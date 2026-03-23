import { useEffect, useState } from "react";
import { Button, Field, Input, Panel, SectionHeader } from "@/components/ui";
import type { Product } from "@/lib/types";

type ProductFormValues = {
  name: string;
  category: string;
  description: string;
};

const emptyValues: ProductFormValues = {
  name: "",
  category: "",
  description: ""
};

export const ProductForm = ({
  initialValue,
  onSubmit,
  onCancel,
  isSubmitting = false
}: {
  initialValue?: Product | null;
  onSubmit: (values: ProductFormValues) => Promise<void> | void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}) => {
  const [values, setValues] = useState<ProductFormValues>(emptyValues);

  useEffect(() => {
    if (!initialValue) {
      setValues(emptyValues);
      return;
    }

    setValues({
      name: initialValue.name,
      category: initialValue.category,
      description: initialValue.description
    });
  }, [initialValue]);

  const isEditing = Boolean(initialValue);

  return (
    <Panel className="space-y-4">
      <SectionHeader
        title={isEditing ? "Editar producto" : "Nuevo producto"}
        subtitle="Cada producto queda asociado al space activo."
      />

      <div className="grid gap-3">
        <Field label="Nombre">
          <Input
            value={values.name}
            onChange={(event) => setValues((prev) => ({ ...prev, name: event.target.value }))}
            placeholder="Arroz"
          />
        </Field>
        <Field label="Categoria">
          <Input
            value={values.category}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, category: event.target.value }))
            }
            placeholder="Despensa"
          />
        </Field>
        <Field label="Descripcion">
          <Input
            value={values.description}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, description: event.target.value }))
            }
            placeholder="Bolsa de 5 kg, integral, oferta semanal"
          />
        </Field>
      </div>

      <div className="flex gap-3">
        <Button
          className="flex-1"
          isLoading={isSubmitting}
          onClick={async () => {
            await onSubmit(values);
            if (!isEditing) {
              setValues(emptyValues);
            }
          }}
        >
          {isEditing ? "Guardar cambios" : "Crear producto"}
        </Button>
        {onCancel ? (
          <Button className="flex-1" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
        ) : null}
      </div>
    </Panel>
  );
};
