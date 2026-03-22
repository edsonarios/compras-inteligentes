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

export const RecentPurchaseList = ({
  purchases,
  products,
  locations,
  onEdit,
  onDelete
}: {
  purchases: Purchase[];
  products: Product[];
  locations: Location[];
  onEdit: (purchase: Purchase) => void;
  onDelete: (purchaseId: string) => void;
}) => {
  const [visibleCount, setVisibleCount] = useState(() => Math.min(10, purchases.length));
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  type PurchaseSortField = "name" | "category" | "description" | "date" | "price" | "quantity";
  const [sortRules, setSortRules] = useState<SortRule<PurchaseSortField>[]>([
    { field: "date", direction: "desc" }
  ]);
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
  const filteredPurchases = useMemo(() => {
    const query = search.trim().toLowerCase();

    return purchases.filter((purchase) => {
      const product = products.find((item) => item.id === purchase.productId);
      const category = product?.category ?? "";
      const matchesCategory = selectedCategory ? category === selectedCategory : true;
      const locationName =
        locations.find((location) => location.id === purchase.locationId)?.name ?? "";
      const haystack =
        `${product?.name ?? ""} ${category} ${locationName} ${purchase.note}`.toLowerCase();
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

  useEffect(() => {
    if (purchases.length > previousLength.current) {
      const delta = purchases.length - previousLength.current;
      setVisibleCount((current) => current + delta);
    } else if (purchases.length < previousLength.current) {
      setVisibleCount((current) => Math.min(current, purchases.length));
    }

    previousLength.current = purchases.length;
  }, [purchases.length]);

  if (purchases.length === 0) {
    return (
      <Panel>
        <p className="theme-muted text-sm">
          Todavia no hay compras registradas en este espacio.
        </p>
      </Panel>
    );
  }

  return (
    <div className="space-y-4">
      <SectionHeader
        title={
          <>
            Ultimas compras{" "}
            <span className="theme-muted text-sm font-medium">
              (Total {purchases.length} - {filteredPurchases.length} visibles)
            </span>
          </>
        }
        subtitle="Lista rapida de las compras mas recientes."
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
            No hay compras que coincidan con la busqueda o categoria.
          </p>
        </Panel>
      ) : null}

      {sortedPurchases.slice(0, visibleCount).map((purchase, index) => {
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
                <p className="theme-muted text-sm">x {purchase.quantity}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => onEdit(purchase)}>
                Editar
              </Button>
              <Button variant="ghost" className="flex-1" onClick={() => onDelete(purchase.id)}>
                Borrar
              </Button>
            </div>
          </Panel>
        );
      })}

      {visibleCount < sortedPurchases.length ? (
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => setVisibleCount(sortedPurchases.length)}
        >
          Mostrar el resto
        </Button>
      ) : null}
    </div>
  );
};
