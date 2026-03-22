import { Button, Panel, SectionHeader } from "@/components/ui";
import type { Product, Purchase } from "@/lib/types";
import { currency, formatDate } from "@/lib/utils";

const getHistory = (productId: string, purchases: Purchase[]) =>
  purchases
    .filter((purchase) => purchase.productId === productId)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));

export const ProductList = ({
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
        title="Catalogo de productos"
        subtitle="Revisa rapido el historial de precio por cada item."
      />

      {products.map((product) => {
        const history = getHistory(product.id, purchases);
        const latest = history[0];
        const previous = history[1];

        return (
          <Panel key={product.id} className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="theme-text text-base font-medium">
                  {product.name}
                </h3>
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
                  Ultimo precio
                </p>
                <p className="theme-text mt-2 text-xl font-semibold">
                  {latest ? currency.format(latest.price) : "--"}
                </p>
              </div>
              <div className="theme-soft rounded-[22px] p-3">
                <p className="theme-muted text-xs uppercase tracking-[0.2em]">
                  Variacion
                </p>
                <p className="theme-text mt-2 text-xl font-semibold">
                  {latest && previous
                    ? currency.format(latest.price - previous.price)
                    : "--"}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="theme-muted text-xs uppercase tracking-[0.2em]">
                Historial
              </p>
              {history.length === 0 ? (
                <p className="theme-muted text-sm">
                  Sin compras registradas todavia.
                </p>
              ) : (
                history.slice(0, 4).map((purchase) => (
                  <div
                    key={purchase.id}
                    className="flex items-center justify-between rounded-2xl border border-[var(--theme-border)] px-3 py-2 text-sm"
                  >
                    <span className="theme-muted">
                      {formatDate(purchase.date)}
                    </span>
                    <span className="theme-text font-medium">
                      {currency.format(purchase.price)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </Panel>
        );
      })}
    </div>
  );
};
