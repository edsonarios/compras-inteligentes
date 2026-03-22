import { useEffect, useState } from "react";
import { Button, Field, Input, Panel, SectionHeader } from "@/components/ui";
import type { Location } from "@/lib/types";

type LocationFormValues = {
  name: string;
  gps: string;
  imageBase64?: string;
};

const emptyValues: LocationFormValues = {
  name: "",
  gps: "",
  imageBase64: ""
};

export const LocationForm = ({
  initialValue,
  onSubmit,
  onCancel
}: {
  initialValue?: Location | null;
  onSubmit: (values: LocationFormValues) => void;
  onCancel?: () => void;
}) => {
  const [values, setValues] = useState<LocationFormValues>(emptyValues);

  useEffect(() => {
    if (!initialValue) {
      setValues(emptyValues);
      return;
    }

    setValues({
      name: initialValue.name,
      gps: initialValue.gps,
      imageBase64: initialValue.imageBase64 ?? ""
    });
  }, [initialValue]);

  const onImageChange = async (file?: File) => {
    if (!file) {
      setValues((prev) => ({ ...prev, imageBase64: "" }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setValues((prev) => ({ ...prev, imageBase64: String(reader.result ?? "") }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <Panel className="space-y-4">
      <SectionHeader
        title={initialValue ? "Editar ubicacion" : "Nueva ubicacion"}
        subtitle="Guarda una referencia simple del lugar y, si quieres, agrega GPS e imagen."
      />

      <Field label="Nombre">
        <Input
          value={values.name}
          onChange={(event) => setValues((prev) => ({ ...prev, name: event.target.value }))}
          placeholder="SuperMercado Hipermaxi - Multicine Rioseco"
        />
      </Field>

      <Field label="GPS o URL del mapa">
        <Input
          value={values.gps}
          onChange={(event) => setValues((prev) => ({ ...prev, gps: event.target.value }))}
          placeholder="https://maps.app.goo.gl/..."
        />
      </Field>

      <Field label="Imagen referencial">
        <Input
          type="file"
          accept="image/*"
          onChange={(event) => onImageChange(event.target.files?.[0])}
          className="pt-2"
        />
      </Field>

      <div className="flex gap-3">
        <Button
          className="flex-1"
          onClick={() => {
            if (!values.name.trim()) {
              return;
            }
            onSubmit(values);
            if (!initialValue) {
              setValues(emptyValues);
            }
          }}
        >
          {initialValue ? "Guardar cambios" : "Crear ubicacion"}
        </Button>
        {onCancel ? (
          <Button className="flex-1" variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
        ) : null}
      </div>
    </Panel>
  );
};
