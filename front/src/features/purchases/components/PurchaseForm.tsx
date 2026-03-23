import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Field,
  Input,
  Panel,
  SectionHeader,
  Textarea
} from "@/components/ui";
import type { Location, Product, Purchase } from "@/lib/types";
import { toInputDate } from "@/lib/utils";

type PurchaseFormValues = {
  productId: string;
  productName: string;
  productCategory: string;
  productDescription: string;
  locationId: string;
  locationName: string;
  price: string;
  quantity: string;
  date: string;
  note: string;
  imageUrl?: string;
  imageFile?: File | null;
};

const defaultValues: PurchaseFormValues = {
  productId: "__new__",
  productName: "",
  productCategory: "",
  productDescription: "",
  locationId: "__new__",
  locationName: "",
  price: "",
  quantity: "1",
  date: toInputDate(new Date().toISOString()),
  note: "",
  imageUrl: "",
  imageFile: null
};

export const PurchaseForm = ({
  products,
  locations,
  initialValue,
  onSubmit,
  onCancel,
  isSubmitting = false
}: {
  products: Product[];
  locations: Location[];
  initialValue?: Purchase | null;
  onSubmit: (values: PurchaseFormValues) => Promise<void> | void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}) => {
  const [values, setValues] = useState<PurchaseFormValues>(defaultValues);
  const [isProductPickerOpen, setIsProductPickerOpen] = useState(false);
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const isCreatingProduct = !values.productId || values.productId === "__new__";
  const isCreatingLocation = !values.locationId || values.locationId === "__new__";
  const filteredProducts = useMemo(() => {
    const query = productSearch.trim().toLowerCase();
    if (!query) {
      return products;
    }

    return products.filter((product) => {
      const haystack = `${product.name} ${product.category} ${product.description}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [products, productSearch]);
  const selectedProduct = products.find((product) => product.id === values.productId);
  const filteredLocations = useMemo(() => {
    const query = locationSearch.trim().toLowerCase();
    if (!query) {
      return locations;
    }

    return locations.filter((location) =>
      `${location.name} ${location.gps}`.toLowerCase().includes(query)
    );
  }, [locations, locationSearch]);
  const selectedLocation = locations.find((location) => location.id === values.locationId);
  const productButtonLabel = initialValue
    ? selectedProduct?.name ?? "Producto"
    : isCreatingProduct
      ? "Nuevo producto"
      : selectedProduct?.name ?? "Selecciona un producto";
  const locationButtonLabel = initialValue
    ? selectedLocation?.name ?? "Ubicacion"
    : isCreatingLocation
      ? "Nueva ubicacion"
      : selectedLocation?.name ?? "Selecciona una ubicacion";

  useEffect(() => {
    if (!initialValue) {
      setValues({
        ...defaultValues
      });
      return;
    }

    setValues({
      productId: initialValue.productId,
      productName: products.find((product) => product.id === initialValue.productId)?.name ?? "",
      productCategory:
        products.find((product) => product.id === initialValue.productId)?.category ?? "",
      productDescription:
        products.find((product) => product.id === initialValue.productId)?.description ?? "",
      locationId: initialValue.locationId,
      locationName:
        locations.find((location) => location.id === initialValue.locationId)?.name ?? "",
      price: initialValue.price.toString(),
      quantity: initialValue.quantity.toString(),
      date: toInputDate(initialValue.date),
      note: initialValue.note,
      imageUrl: initialValue.imageUrl ?? "",
      imageFile: null
    });
  }, [initialValue, products, locations]);

  useEffect(() => {
    if (isCreatingProduct) {
      setProductSearch(values.productName);
    } else {
      setProductSearch("");
    }
  }, [values.productId, values.productName, isCreatingProduct]);

  useEffect(() => {
    if (isCreatingLocation) {
      setLocationSearch(values.locationName);
    } else {
      setLocationSearch("");
    }
  }, [values.locationId, values.locationName, isCreatingLocation]);

  useEffect(() => {
    if (!selectedProduct || isCreatingProduct) {
      return;
    }

    setValues((prev) => {
      if (
        prev.productName === selectedProduct.name &&
        prev.productCategory === selectedProduct.category &&
        prev.productDescription === selectedProduct.description
      ) {
        return prev;
      }

      return {
        ...prev,
        productName: selectedProduct.name,
        productCategory: selectedProduct.category,
        productDescription: selectedProduct.description
      };
    });
  }, [selectedProduct, isCreatingProduct]);

  useEffect(() => {
    if (!selectedLocation || isCreatingLocation) {
      return;
    }

    setValues((prev) => {
      if (prev.locationName === selectedLocation.name) {
        return prev;
      }

      return {
        ...prev,
        locationName: selectedLocation.name
      };
    });
  }, [selectedLocation, isCreatingLocation]);

  const onImageChange = async (file?: File) => {
    if (!file) {
      setValues((prev) => ({ ...prev, imageFile: null }));
      return;
    }
    setValues((prev) => ({ ...prev, imageFile: file }));
  };

  return (
    <Panel className="space-y-4">
      <SectionHeader
        title={initialValue ? "Editar compra" : "Registrar compra"}
        subtitle="Guarda precio, tienda, cantidad e imagen temporal."
      />

      <div className="grid gap-3">
        <Field label="Producto">
          <div className="relative">
            <button
              type="button"
              className="theme-input theme-text flex min-h-11 w-full items-center justify-between rounded-2xl border px-3 text-left text-sm"
              onClick={() => setIsProductPickerOpen((value) => !value)}
            >
              <span className="truncate">{productButtonLabel}</span>
              <span className="theme-muted">{isProductPickerOpen ? "▲" : "▼"}</span>
            </button>

            {isProductPickerOpen ? (
              <div className="theme-elevated absolute left-0 top-14 z-20 w-full rounded-[24px] border p-3 shadow-panel">
                <div className="space-y-3">
                  <Input
                    value={productSearch}
                    onChange={(event) => setProductSearch(event.target.value)}
                    placeholder="Buscar producto..."
                    autoFocus
                  />

                  <div className="max-h-56 space-y-2 overflow-y-auto">
                    <button
                      type="button"
                      className="theme-soft theme-text w-full rounded-2xl px-3 py-3 text-left text-sm"
                      onClick={() => {
                        setValues((prev) => ({
                          ...prev,
                          productId: "__new__",
                          productName: productSearch.trim(),
                          productCategory: "",
                          productDescription: ""
                        }));
                        setIsProductPickerOpen(false);
                      }}
                    >
                      Nuevo producto
                    </button>

                    {filteredProducts.length === 0 ? (
                      <p className="theme-muted px-2 py-3 text-sm">
                        No hay coincidencias para tu busqueda.
                      </p>
                    ) : (
                      filteredProducts.map((product) => (
                        <button
                          key={product.id}
                          type="button"
                          className="theme-text w-full rounded-2xl border border-[var(--theme-border)] px-3 py-3 text-left text-sm"
                          onClick={() => {
                            setValues((prev) => ({
                              ...prev,
                              productId: product.id,
                              productName: product.name,
                              productCategory: product.category,
                              productDescription: product.description
                            }));
                            setIsProductPickerOpen(false);
                            setProductSearch("");
                          }}
                        >
                          <span className="block">{product.name}</span>
                          {product.category || product.description ? (
                            <span className="theme-muted mt-1 block text-xs">
                              {[product.category, product.description]
                                .filter(Boolean)
                                .join(" · ")}
                            </span>
                          ) : null}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </Field>

        <Field label="Ubicacion">
          <div className="relative">
            <button
              type="button"
              className="theme-input theme-text flex min-h-11 w-full items-center justify-between rounded-2xl border px-3 text-left text-sm"
              onClick={() => setIsLocationPickerOpen((value) => !value)}
            >
              <span className="truncate">{locationButtonLabel}</span>
              <span className="theme-muted">{isLocationPickerOpen ? "▲" : "▼"}</span>
            </button>

            {isLocationPickerOpen ? (
              <div className="theme-elevated absolute left-0 top-14 z-20 w-full rounded-[24px] border p-3 shadow-panel">
                <div className="space-y-3">
                  <Input
                    value={locationSearch}
                    onChange={(event) => setLocationSearch(event.target.value)}
                    placeholder="Buscar ubicacion..."
                    autoFocus
                  />

                  <div className="max-h-56 space-y-2 overflow-y-auto">
                    <button
                      type="button"
                      className="theme-soft theme-text w-full rounded-2xl px-3 py-3 text-left text-sm"
                      onClick={() => {
                        setValues((prev) => ({
                          ...prev,
                          locationId: "__new__",
                          locationName: locationSearch.trim()
                        }));
                        setIsLocationPickerOpen(false);
                      }}
                    >
                      Nueva ubicacion
                    </button>

                    {filteredLocations.length === 0 ? (
                      <p className="theme-muted px-2 py-3 text-sm">
                        No hay coincidencias para tu busqueda.
                      </p>
                    ) : (
                      filteredLocations.map((location) => (
                        <button
                          key={location.id}
                          type="button"
                          className="theme-text w-full rounded-2xl border border-[var(--theme-border)] px-3 py-3 text-left text-sm"
                          onClick={() => {
                            setValues((prev) => ({
                              ...prev,
                              locationId: location.id,
                              locationName: location.name
                            }));
                            setIsLocationPickerOpen(false);
                            setLocationSearch("");
                          }}
                        >
                          <span className="block">{location.name}</span>
                          {location.gps ? (
                            <span className="theme-muted mt-1 block text-xs">
                              Referencia detallada disponible
                            </span>
                          ) : null}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </Field>

        <Field label="Nombre de la ubicacion">
          <Input
            value={values.locationName}
            onChange={(event) => {
              const nextValue = event.target.value;
              setValues((prev) => ({ ...prev, locationName: nextValue }));
              if (isCreatingLocation) {
                setLocationSearch(nextValue);
              }
            }}
            placeholder="SuperMercado Hipermaxi - Multicine Rioseco"
          />
        </Field>

        <div className="grid gap-3">
          <Field label="Nombre del producto">
            <Input
              value={values.productName}
              onChange={(event) => {
                const nextValue = event.target.value;
                setValues((prev) => ({ ...prev, productName: nextValue }));
                if (isCreatingProduct) {
                  setProductSearch(nextValue);
                }
              }}
              placeholder="Arroz"
            />
          </Field>
          <Field label="Categoria">
            <Input
              value={values.productCategory}
              onChange={(event) =>
                setValues((prev) => ({ ...prev, productCategory: event.target.value }))
              }
              placeholder="Despensa"
            />
          </Field>
          <Field label="Descripcion">
            <Input
              value={values.productDescription}
              onChange={(event) =>
                setValues((prev) => ({
                  ...prev,
                  productDescription: event.target.value
                }))
              }
              placeholder="Bolsa de 5 kg, integral, pack ahorro"
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Precio">
            <Input
              type="number"
              min="0"
              step="0.01"
              value={values.price}
              onChange={(event) => setValues((prev) => ({ ...prev, price: event.target.value }))}
            />
          </Field>
          <Field label="Cantidad">
            <Input
              type="number"
              min="0.01"
              step="0.01"
              value={values.quantity}
              onChange={(event) =>
                setValues((prev) => ({ ...prev, quantity: event.target.value }))
              }
            />
          </Field>
        </div>

        <Field label="Fecha">
          <Input
            type="date"
            value={values.date}
            onChange={(event) => setValues((prev) => ({ ...prev, date: event.target.value }))}
          />
        </Field>

        <Field label="Nota">
          <Textarea
            value={values.note}
            onChange={(event) => setValues((prev) => ({ ...prev, note: event.target.value }))}
            placeholder="Oferta de fin de semana"
          />
        </Field>

        <Field label="Imagen">
          <Input
            type="file"
            accept="image/*"
            onChange={(event) => onImageChange(event.target.files?.[0])}
            className="pt-2"
          />
        </Field>

        {values.imageUrl ? (
          <img
            src={values.imageUrl}
            alt={values.productName || "Compra"}
            className="h-32 w-full rounded-[24px] object-cover"
          />
        ) : null}
      </div>

      <div className="flex gap-3">
        <Button
          className="flex-1"
          isLoading={isSubmitting}
          onClick={async () => {
            if ((isCreatingProduct && !values.productName.trim()) || !values.locationName.trim()) {
              return;
            }
            await onSubmit(values);
            if (!initialValue) {
              setValues(defaultValues);
            }
          }}
        >
          {initialValue ? "Guardar compra" : "Agregar compra"}
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
