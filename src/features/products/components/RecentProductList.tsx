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
import type { Product, Purchase } from "@/lib/types";
import { currency } from "@/lib/utils";

const getLatestPrice = (productId: string, purchases: Purchase[]) =>
  purchases
    .filter((purchase) => purchase.productId === productId)
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))[0];

export const RecentProductList = ({
  products,
  purchases,
  onEdit,
  onDelete
}: {
  products: Product[];
  purchases: Purchase[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
}) => {
  const [visibleCount, setVisibleCount] = useState(() => Math.min(10, products.length));
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  type ProductSortField = "name" | "category" | "description" | "date" | "price";
  const [sortRules, setSortRules] = useState<SortRule<ProductSortField>[]>([
    { field: "date", direction: "desc" }
  ]);
  const previousLength = useRef(products.length);
  const categoryOptions = useMemo(
    () =>
      Array.from(
        new Set(products.map((product) => product.category.trim()).filter(Boolean))
      ).sort((a, b) => a.localeCompare(b)),
    [products]
  );
  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory = selectedCategory
        ? product.category === selectedCategory
        : true;
      const haystack =
        `${product.name} ${product.category} ${product.description}`.toLowerCase();
      const matchesSearch = query ? haystack.includes(query) : true;
      return matchesCategory && matchesSearch;
    });
  }, [products, search, selectedCategory]);
  const sortedProducts = useMemo(
    () =>
      applySortRules(filteredProducts, sortRules, {
        name: (left, right, direction) =>
          compareText(left.name, right.name, direction),
        category: (left, right, direction) =>
          compareText(left.category, right.category, direction),
        description: (left, right, direction) =>
          compareText(left.description, right.description, direction),
        date: (left, right, direction) =>
          compareDate(left.createdAt, right.createdAt, direction),
        price: (left, right, direction) =>
          compareNumber(
            getLatestPrice(left.id, purchases)?.price ?? -1,
            getLatestPrice(right.id, purchases)?.price ?? -1,
            direction
          )
      }),
    [filteredProducts, purchases, sortRules]
  );

  useEffect(() => {
    if (products.length > previousLength.current) {
      const delta = products.length - previousLength.current;
      setVisibleCount((current) => current + delta);
    } else if (products.length < previousLength.current) {
      setVisibleCount((current) => Math.min(current, products.length));
    }

    previousLength.current = products.length;
  }, [products.length]);

  if (products.length === 0) {
    return (
      <Panel>
        <p className="theme-muted text-sm">
          Todavia no hay productos en este espacio.
        </p>
      </Panel>
    );
  }

  return (
    <div className="space-y-4">
      <SectionHeader
        title={
          <>
            Ultimos productos{" "}
            <span className="theme-muted text-sm font-medium">
              (Total {products.length} - {filteredProducts.length} visibles)
            </span>
          </>
        }
        subtitle="Vista rapida de los productos creados mas recientemente."
      />

      <Panel className="grid gap-3">
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar producto..."
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
          { value: "price", label: "Ultimo precio" }
        ]}
        onChange={setSortRules}
      />

      {sortedProducts.length === 0 ? (
        <Panel>
          <p className="theme-muted text-sm">
            No hay productos que coincidan con la busqueda o categoria.
          </p>
        </Panel>
      ) : null}

      {sortedProducts.slice(0, visibleCount).map((product, index) => {
        const latestPurchase = getLatestPrice(product.id, purchases);
        const purchaseCount = purchases.filter(
          (purchase) => purchase.productId === product.id
        ).length;

        return (
          <Panel key={product.id} className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="theme-muted text-xs uppercase tracking-[0.2em]">
                  #{index + 1}
                </p>
                <h3 className="theme-text text-base font-medium">{product.name}</h3>
                <p className="theme-muted mt-1 text-sm">
                  {product.category || "General"}
                </p>
                {product.description ? (
                  <p className="theme-muted mt-2 text-sm leading-6">
                    {product.description}
                  </p>
                ) : null}
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" className="px-3" onClick={() => onEdit(product)}>
                  Editar
                </Button>
                <Button variant="ghost" className="px-3" onClick={() => onDelete(product.id)}>
                  Borrar
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="theme-soft rounded-[22px] p-3">
                <p className="theme-muted text-xs uppercase tracking-[0.2em]">
                  Compras
                </p>
                <p className="theme-text mt-2 text-xl font-semibold">
                  {purchaseCount}
                </p>
              </div>
              <div className="theme-soft rounded-[22px] p-3">
                <p className="theme-muted text-xs uppercase tracking-[0.2em]">
                  Ultimo precio
                </p>
                <p className="theme-text mt-2 text-xl font-semibold">
                  {latestPurchase ? currency.format(latestPurchase.price) : "--"}
                </p>
              </div>
            </div>
          </Panel>
        );
      })}

      {visibleCount < sortedProducts.length ? (
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => setVisibleCount(sortedProducts.length)}
        >
          Mostrar el resto
        </Button>
      ) : null}
    </div>
  );
};
