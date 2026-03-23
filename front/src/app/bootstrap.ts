import { useAuthStore } from "@/features/auth/authStore";
import { useLocationStore } from "@/features/locations/locationStore";
import { useProductStore } from "@/features/products/productStore";
import { usePurchaseStore } from "@/features/purchases/purchaseStore";
import { useSpaceStore } from "@/features/spaces/spaceStore";

export const bootstrapApp = async () => {
  const authState = useAuthStore.getState();
  const spaceState = useSpaceStore.getState();
  const productState = useProductStore.getState();
  const locationState = useLocationStore.getState();
  const purchaseState = usePurchaseStore.getState();

  if (!authState.isAuthenticated || !authState.user) {
    return;
  }

  await spaceState.loadSpaces();
  await spaceState.initializeDefaultSpace(authState.user.id);
  await Promise.all([
    productState.loadProducts(),
    locationState.loadLocations(),
    purchaseState.loadPurchases()
  ]);
};
