import { useMemo, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { LoadingNotice, Page } from "@/components/ui";
import { ProductForm } from "@/features/products/components/ProductForm";
import { RecentProductList } from "@/features/products/components/RecentProductList";
import { useProductStore } from "@/features/products/productStore";
import { usePurchaseStore } from "@/features/purchases/purchaseStore";
import { useSpaceStore } from "@/features/spaces/spaceStore";
import { scrollToPageTop } from "@/lib/scroll";
import { sortByIsoDesc } from "@/lib/utils";
import type { Product } from "@/lib/types";

export const ProductsPage = () => {
  const currentSpaceId = useSpaceStore((state) => state.currentSpaceId);
  const products = useProductStore((state) => state.products);
  const createProduct = useProductStore((state) => state.createProduct);
  const updateProduct = useProductStore((state) => state.updateProduct);
  const deleteProduct = useProductStore((state) => state.deleteProduct);
  const purchases = usePurchaseStore((state) => state.purchases);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

  const scopedProducts = useMemo(
    () => sortByIsoDesc(
      products.filter((product) => product.spaceId === currentSpaceId),
      (product) => product.createdAt
    ),
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

        {isSubmitting ? (
          <LoadingNotice message="Guardando producto..." />
        ) : null}

        <ProductForm
          initialValue={editingProduct}
          onSubmit={async (values) => {
            if (!currentSpaceId) {
              return;
            }

            setIsSubmitting(true);
            try {
              if (editingProduct) {
                await updateProduct(editingProduct.id, values);
                setEditingProduct(null);
                return;
              }

              await createProduct({ ...values, spaceId: currentSpaceId });
            } finally {
              setIsSubmitting(false);
            }
          }}
          isSubmitting={isSubmitting}
          onCancel={editingProduct ? () => setEditingProduct(null) : undefined}
        />

        <RecentProductList
          products={scopedProducts}
          purchases={scopedPurchases}
          onEdit={(product) => {
            setEditingProduct(product);
            scrollToPageTop();
          }}
          onDelete={async (productId) => {
            setDeletingProductId(productId);
            try {
              await deleteProduct(productId);
            } finally {
              setDeletingProductId(null);
            }
          }}
          busyDeleteId={deletingProductId}
        />
      </div>
    </Page>
  );
};
