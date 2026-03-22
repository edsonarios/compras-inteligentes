import { useMemo, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Page } from "@/components/ui";
import { ProductForm } from "@/features/products/components/ProductForm";
import { RecentProductList } from "@/features/products/components/RecentProductList";
import { useProductStore } from "@/features/products/productStore";
import { usePurchaseStore } from "@/features/purchases/purchaseStore";
import { useSpaceStore } from "@/features/spaces/spaceStore";
import { scrollToPageTop } from "@/lib/scroll";
import type { Product } from "@/lib/types";

export const ProductsPage = () => {
  const currentSpaceId = useSpaceStore((state) => state.currentSpaceId);
  const products = useProductStore((state) => state.products);
  const createProduct = useProductStore((state) => state.createProduct);
  const updateProduct = useProductStore((state) => state.updateProduct);
  const deleteProduct = useProductStore((state) => state.deleteProduct);
  const purchases = usePurchaseStore((state) => state.purchases);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const scopedProducts = useMemo(
    () =>
      products
        .filter((product) => product.spaceId === currentSpaceId)
        .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)),
    [products, currentSpaceId]
  );
  const scopedPurchases = useMemo(
    () => purchases.filter((purchase) => purchase.spaceId === currentSpaceId),
    [purchases, currentSpaceId]
  );

  return (
    <Page>
      <div className="space-y-4">
        <AppHeader
          eyebrow="Productos"
          title="Productos recientes"
          description="Vista simple de los ultimos productos creados en el espacio activo."
        />

        <ProductForm
          initialValue={editingProduct}
          onSubmit={(values) => {
            if (!currentSpaceId) {
              return;
            }

            if (editingProduct) {
              updateProduct(editingProduct.id, values);
              setEditingProduct(null);
              return;
            }

            createProduct({ ...values, spaceId: currentSpaceId });
          }}
          onCancel={editingProduct ? () => setEditingProduct(null) : undefined}
        />

        <RecentProductList
          products={scopedProducts}
          purchases={scopedPurchases}
          onEdit={(product) => {
            setEditingProduct(product);
            scrollToPageTop();
          }}
          onDelete={deleteProduct}
        />
      </div>
    </Page>
  );
};
