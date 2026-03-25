import { useMemo } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Panel, Page, SectionHeader } from "@/components/ui";
import { useLocationStore } from "@/features/locations/locationStore";
import { PurchaseList } from "@/features/purchases/components/PurchaseList";
import { useSpaceStore } from "@/features/spaces/spaceStore";
import { useProductStore } from "@/features/products/productStore";
import { usePurchaseStore } from "@/features/purchases/purchaseStore";
import { currency, sortByIsoDesc } from "@/lib/utils";

export const DashboardPage = () => {
  const currentSpaceId = useSpaceStore((state) => state.currentSpaceId);
  const spaces = useSpaceStore((state) => state.spaces);
  const allProducts = useProductStore((state) => state.products);
  const allLocations = useLocationStore((state) => state.locations);
  const allPurchases = usePurchaseStore((state) => state.purchases);
  const products = useMemo(
    () => allProducts.filter((product) => product.spaceId === currentSpaceId),
    [allProducts, currentSpaceId]
  );
  const purchases = useMemo(
    () => allPurchases.filter((purchase) => purchase.spaceId === currentSpaceId),
    [allPurchases, currentSpaceId]
  );
  const locations = useMemo(
    () => allLocations.filter((location) => location.spaceId === currentSpaceId),
    [allLocations, currentSpaceId]
  );
  const detailedPurchases = useMemo(
    () => sortByIsoDesc(purchases, (purchase) => purchase.createdAt),
    [purchases]
  );
  const currentSpace = spaces.find((space) => space.id === currentSpaceId);
  const totalSpend = purchases.reduce(
    (sum, purchase) => sum + purchase.price * purchase.quantity,
    0
  );

  return (
    <Page>
      <AppHeader
        eyebrow="Panel principal"
        title={currentSpace?.name ?? "Mi espacio"}
        description="Un lugar simple para seguir tus compras recurrentes y detectar movimientos de precio con contexto."
      />

      <div className="space-y-4">
        <Panel className="grid grid-cols-2 gap-3">
          <div className="theme-soft rounded-[24px] p-4">
            <p className="theme-muted text-xs uppercase tracking-[0.2em]">
              Productos
            </p>
            <p className="theme-text mt-3 text-3xl font-semibold">
              {products.length}
            </p>
          </div>
          <div className="theme-soft rounded-[24px] p-4">
            <p className="theme-muted text-xs uppercase tracking-[0.2em]">
              Compras
            </p>
            <p className="theme-text mt-3 text-3xl font-semibold">
              {purchases.length}
            </p>
          </div>
          <div className="theme-primary-button col-span-2 rounded-[24px] p-4">
            <p className="text-xs uppercase tracking-[0.2em] opacity-60">
              Gasto acumulado
            </p>
            <p className="mt-3 text-3xl font-semibold">
              {currency.format(totalSpend)}
            </p>
          </div>
        </Panel>

        <Panel>
          <SectionHeader
            title="Resumen del espacio"
            subtitle="Los datos ya se cargan desde el backend y reflejan el estado real del espacio activo."
          />
          <p className="theme-muted text-sm leading-6">
            Aqui vive ahora el historial principal y detallado para revisar la
            evolucion de precios dentro del espacio activo.
          </p>
        </Panel>

        <PurchaseList
          purchases={detailedPurchases}
          products={products}
          locations={locations}
          title="Historial principal"
          subtitle="Vista detallada de todas las compras del espacio."
        />
      </div>
    </Page>
  );
};
