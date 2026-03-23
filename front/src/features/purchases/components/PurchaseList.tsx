import { useEffect, useMemo, useRef, useState } from "react";
import { Button, Input, Panel, SectionHeader, Select } from "@/components/ui";
import { SortBuilder } from "@/components/SortBuilder";
import {
  applySortRules,
  compareDate,
  compareNumber,
  compareText,
  type SortRule
} from "@/lib/sorting";
import type { Location, Product, Purchase } from "@/lib/types";
import { currency, formatDate } from "@/lib/utils";

export const PurchaseList = ({
  purchases,
  products,
  locations,
  onEdit,
  onDelete,
  title = "Historial de compras",
  subtitle = "Filtra por producto y compara rapidamente la evolucion del precio."
}: {
  purchases: Purchase[];
  products: Product[];
  locations: Location[];
  onEdit?: (purchase: Purchase) => void;
  onDelete?: (purchaseId: string) => void;
  title?: string;
  subtitle?: string;
}) => {
  const [search, setSearch] = useState("");
  const [selectedPurchaseId, setSelectedPurchaseId] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(() => Math.min(10, purchases.length));
  const previousLength = useRef(purchases.length);
  const categoryOptions = useMemo(
    () =>
      Array.from(
        new Set(
          purchases
            .map((purchase) => products.find((product) => product.id === purchase.productId)?.category ?? "")
            .filter(Boolean)
        )
      ).sort((a, b) => a.localeCompare(b)),
    [purchases, products]
  );
  const [selectedCategory, setSelectedCategory] = useState("");
  type PurchaseSortField = "name" | "category" | "description" | "date" | "price" | "quantity";
  const [sortRules, setSortRules] = useState<SortRule<PurchaseSortField>[]>([
    { field: "date", direction: "desc" }
  ]);
  const filteredPurchases = useMemo(() => {
    const query = search.trim().toLowerCase();

    return purchases.filter((purchase) => {
      const product = products.find((item) => item.id === purchase.productId);
      const category = product?.category ?? "";
      const matchesCategory = selectedCategory ? category === selectedCategory : true;
      const locationName =
        locations.find((location) => location.id === purchase.locationId)?.name ?? "";
      const haystack =
        `${product?.name ?? ""} ${category} ${product?.description ?? ""} ${locationName} ${purchase.note}`.toLowerCase();
      const matchesSearch = query ? haystack.includes(query) : true;

      return matchesCategory && matchesSearch;
    });
  }, [purchases, products, locations, search, selectedCategory]);
  const sortedPurchases = useMemo(
    () =>
      applySortRules(filteredPurchases, sortRules, {
        name: (left, right, direction) =>
          compareText(
            products.find((item) => item.id === left.productId)?.name ?? "",
            products.find((item) => item.id === right.productId)?.name ?? "",
            direction
          ),
        category: (left, right, direction) =>
          compareText(
            products.find((item) => item.id === left.productId)?.category ?? "",
            products.find((item) => item.id === right.productId)?.category ?? "",
            direction
          ),
        description: (left, right, direction) =>
          compareText(
            products.find((item) => item.id === left.productId)?.description ?? "",
            products.find((item) => item.id === right.productId)?.description ?? "",
            direction
          ),
        date: (left, right, direction) => compareDate(left.date, right.date, direction),
        price: (left, right, direction) => compareNumber(left.price, right.price, direction),
        quantity: (left, right, direction) =>
          compareNumber(left.quantity, right.quantity, direction)
      }),
    [filteredPurchases, products, sortRules]
  );
  const selectedPurchase = selectedPurchaseId
    ? purchases.find((purchase) => purchase.id === selectedPurchaseId) ?? null
    : null;
  const selectedProduct = selectedPurchase
    ? products.find((item) => item.id === selectedPurchase.productId)
    : null;
  const selectedLocation = selectedPurchase
    ? locations.find((item) => item.id === selectedPurchase.locationId)
    : null;

  useEffect(() => {
    if (purchases.length > previousLength.current) {
      const delta = purchases.length - previousLength.current;
      setVisibleCount((current) => current + delta);
    } else if (purchases.length < previousLength.current) {
      setVisibleCount((current) => Math.min(current, purchases.length));
    }

    previousLength.current = purchases.length;
  }, [purchases.length]);

  return (
    <div className="space-y-4">
      <SectionHeader
        title={
          <>
            {title}{" "}
            <span className="theme-muted text-sm font-medium">
              (Total {purchases.length} - {filteredPurchases.length} visibles)
            </span>
          </>
        }
        subtitle={subtitle}
      />

      <Panel className="grid gap-3">
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar compra o producto..."
        />
        <Select
          value={selectedCategory}
          onChange={(event) => setSelectedCategory(event.target.value)}
        >
          <option value="">Todas las categorias</option>
          {categoryOptions.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </Select>
      </Panel>

      <SortBuilder
        label="Orden"
        rules={sortRules}
        options={[
          { value: "name", label: "Nombre" },
          { value: "category", label: "Categoria" },
          { value: "description", label: "Descripcion" },
          { value: "date", label: "Fecha" },
          { value: "price", label: "Precio" },
          { value: "quantity", label: "Cantidad" }
        ]}
        onChange={setSortRules}
      />

      {sortedPurchases.length === 0 ? (
        <Panel>
          <p className="theme-muted text-sm">
            No hay compras para el filtro actual.
          </p>
        </Panel>
      ) : (
        sortedPurchases.slice(0, visibleCount).map((purchase, index) => {
          const product = products.find((item) => item.id === purchase.productId);
          const location = locations.find((item) => item.id === purchase.locationId);

          return (
            <Panel key={purchase.id} className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="theme-muted text-xs uppercase tracking-[0.2em]">
                    #{index + 1}
                  </p>
                  <p className="theme-text text-base font-medium">
                    {product?.name ?? "Producto eliminado"}
                  </p>
                  <p className="theme-muted mt-1 text-sm">
                    {location?.name ?? "Ubicacion eliminada"} · {formatDate(purchase.date)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="theme-text text-lg font-semibold">
                    {currency.format(purchase.price)}
                  </p>
                  <p className="theme-muted text-sm">
                    x {purchase.quantity}
                  </p>
                </div>
              </div>

              {purchase.note ? (
                <p className="theme-soft theme-muted rounded-2xl p-3 text-sm">
                  {purchase.note}
                </p>
              ) : null}

              {purchase.imageUrl ? (
                <button
                  type="button"
                  className="block w-full overflow-hidden rounded-[24px]"
                  onClick={() => setSelectedPurchaseId(purchase.id)}
                >
                  <img
                    src={purchase.imageUrl}
                    alt={`Compra de ${product?.name ?? "producto"}`}
                    className="h-40 w-full rounded-[24px] object-cover transition hover:opacity-90"
                  />
                </button>
              ) : null}

              {purchase.imageUrl ? (
                <p className="theme-muted text-xs">Toca la imagen para ver el detalle completo.</p>
              ) : null}

              {onEdit && onDelete ? (
                <div className="flex gap-3">
                  <Button variant="secondary" className="flex-1" onClick={() => onEdit(purchase)}>
                    Editar
                  </Button>
                  <Button variant="ghost" className="flex-1" onClick={() => onDelete(purchase.id)}>
                    Borrar
                  </Button>
                </div>
              ) : null}
            </Panel>
          );
        })
      )}

      {visibleCount < sortedPurchases.length ? (
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => setVisibleCount(sortedPurchases.length)}
        >
          Mostrar el resto
        </Button>
      ) : null}

      {selectedPurchase && selectedProduct ? (
        <div
          className="bg-black/95 fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPurchaseId(null)}
        >
          <div
            className="theme-panel theme-text max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[32px] border p-5 shadow-panel"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="theme-muted text-xs uppercase tracking-[0.24em]">Detalle</p>
                <h3 className="mt-2 text-2xl font-semibold">{selectedProduct.name}</h3>
                <p className="theme-muted mt-1 text-sm">
                  {selectedLocation?.name ?? "Ubicacion eliminada"} · {formatDate(selectedPurchase.date)}
                </p>
              </div>
              <Button variant="ghost" className="px-3" onClick={() => setSelectedPurchaseId(null)}>
                Cerrar
              </Button>
            </div>

            {selectedPurchase.imageUrl ? (
              <img
                src={selectedPurchase.imageUrl}
                alt={`Compra de ${selectedProduct.name}`}
                className="h-auto max-h-[24rem] w-full rounded-[28px] object-contain"
              />
            ) : null}

            <div className="mt-5 grid gap-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="theme-soft rounded-[20px] p-3">
                  <p className="theme-muted text-xs uppercase tracking-[0.2em]">Categoria</p>
                  <p className="mt-1 font-medium">{selectedProduct.category || "Sin categoria"}</p>
                </div>
                <div className="theme-soft rounded-[20px] p-3">
                  <p className="theme-muted text-xs uppercase tracking-[0.2em]">Cantidad</p>
                  <p className="mt-1 font-medium">{selectedPurchase.quantity}</p>
                </div>
                <div className="theme-soft rounded-[20px] p-3">
                  <p className="theme-muted text-xs uppercase tracking-[0.2em]">Precio unitario</p>
                  <p className="mt-1 font-medium">{currency.format(selectedPurchase.price)}</p>
                </div>
                <div className="theme-soft rounded-[20px] p-3">
                  <p className="theme-muted text-xs uppercase tracking-[0.2em]">Total</p>
                  <p className="mt-1 font-medium">
                    {currency.format(selectedPurchase.price * selectedPurchase.quantity)}
                  </p>
                </div>
              </div>

              {selectedProduct.description ? (
                <div>
                  <p className="theme-muted text-xs uppercase tracking-[0.2em]">Descripcion</p>
                  <p className="mt-1 text-sm leading-6">{selectedProduct.description}</p>
                </div>
              ) : null}

              {selectedPurchase.note ? (
                <div>
                  <p className="theme-muted text-xs uppercase tracking-[0.2em]">Nota</p>
                  <p className="mt-1 text-sm leading-6">{selectedPurchase.note}</p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
