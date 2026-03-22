import { useMemo, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Page, Panel } from "@/components/ui";
import { PurchaseForm } from "@/features/purchases/components/PurchaseForm";
import { RecentPurchaseList } from "@/features/purchases/components/RecentPurchaseList";
import { useLocationStore } from "@/features/locations/locationStore";
import { usePurchaseStore } from "@/features/purchases/purchaseStore";
import { useProductStore } from "@/features/products/productStore";
import { useSpaceStore } from "@/features/spaces/spaceStore";
import { scrollToPageTop } from "@/lib/scroll";
import type { Purchase } from "@/lib/types";

export const PurchasesPage = () => {
  const currentSpaceId = useSpaceStore((state) => state.currentSpaceId);
  const products = useProductStore((state) => state.products);
  const createProduct = useProductStore((state) => state.createProduct);
  const updateProduct = useProductStore((state) => state.updateProduct);
  const locations = useLocationStore((state) => state.locations);
  const createLocation = useLocationStore((state) => state.createLocation);
  const updateLocation = useLocationStore((state) => state.updateLocation);
  const purchases = usePurchaseStore((state) => state.purchases);
  const createPurchase = usePurchaseStore((state) => state.createPurchase);
  const updatePurchase = usePurchaseStore((state) => state.updatePurchase);
  const deletePurchase = usePurchaseStore((state) => state.deletePurchase);
  const [editingPurchase, setEditingPurchase] = useState<Purchase | null>(null);

  const scopedProducts = useMemo(
    () => products.filter((product) => product.spaceId === currentSpaceId),
    [products, currentSpaceId]
  );
  const scopedPurchases = useMemo(
    () =>
      purchases
        .filter((purchase) => purchase.spaceId === currentSpaceId)
        .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)),
    [purchases, currentSpaceId]
  );
  const scopedLocations = useMemo(
    () => locations.filter((location) => location.spaceId === currentSpaceId),
    [locations, currentSpaceId]
  );

  return (
    <Page>
      <div className="space-y-4">
        <AppHeader
          eyebrow="Compras"
          title="Compras recientes"
          description="Vista simple de las ultimas compras creadas dentro del espacio activo."
        />

        {scopedProducts.length === 0 ? (
          <Panel>
            <p className="theme-muted text-sm leading-6">
              Aun no hay productos en este espacio, pero ya puedes registrar una
              compra y crear el producto al mismo tiempo.
            </p>
          </Panel>
        ) : null}

        <PurchaseForm
          products={scopedProducts}
          locations={scopedLocations}
          initialValue={editingPurchase}
          onSubmit={(values) => {
            if (!currentSpaceId) {
              return;
            }

            let productId = values.productId;
            let locationId = values.locationId;

            if (!values.productName.trim()) {
              return;
            }

            if (!values.productId || values.productId === "__new__") {
              const nextProduct = createProduct({
                spaceId: currentSpaceId,
                name: values.productName.trim(),
                category: values.productCategory.trim(),
                description: values.productDescription.trim()
              });
              productId = nextProduct.id;
            } else {
              updateProduct(values.productId, {
                spaceId: currentSpaceId,
                name: values.productName.trim(),
                category: values.productCategory.trim(),
                description: values.productDescription.trim()
              });
            }

            if (!values.locationName.trim()) {
              return;
            }

            if (!values.locationId || values.locationId === "__new__") {
              const nextLocation = createLocation({
                spaceId: currentSpaceId,
                name: values.locationName.trim(),
                gps: "",
                imageBase64: ""
              });
              locationId = nextLocation.id;
            } else {
              updateLocation(values.locationId, {
                spaceId: currentSpaceId,
                name: values.locationName.trim()
              });
            }

            const payload = {
              productId,
              locationId,
              spaceId: currentSpaceId,
              price: Number(values.price),
              quantity: Number(values.quantity),
              date: new Date(values.date).toISOString(),
              note: values.note,
              imageBase64: values.imageBase64
            };

            if (editingPurchase) {
              updatePurchase(editingPurchase.id, payload);
              setEditingPurchase(null);
              return;
            }

            createPurchase(payload);
          }}
          onCancel={editingPurchase ? () => setEditingPurchase(null) : undefined}
        />

        <RecentPurchaseList
          purchases={scopedPurchases}
          products={scopedProducts}
          locations={scopedLocations}
          onEdit={(purchase) => {
            setEditingPurchase(purchase);
            scrollToPageTop();
          }}
          onDelete={deletePurchase}
        />
      </div>
    </Page>
  );
};
