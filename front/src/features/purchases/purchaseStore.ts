import { create } from "zustand";
import type { Purchase, PurchaseInput } from "@/lib/types";
import { purchaseService } from "@/features/purchases/services/purchaseService";

type PurchaseState = {
  purchases: Purchase[];
  loadPurchases: () => Promise<void>;
  resetPurchases: () => void;
  createPurchase: (input: PurchaseInput) => Promise<Purchase>;
  updatePurchase: (purchaseId: string, updates: Partial<PurchaseInput>) => Promise<void>;
  deletePurchase: (purchaseId: string) => Promise<void>;
};

export const usePurchaseStore = create<PurchaseState>()((set) => ({
  purchases: [],
  loadPurchases: async () => {
    const purchases = await purchaseService.findAll();
    set({ purchases });
  },
  resetPurchases: () => set({ purchases: [] }),
  createPurchase: async (input) => {
    const nextPurchase = await purchaseService.create(input);
    set((state) => ({ purchases: [...state.purchases, nextPurchase] }));
    return nextPurchase;
  },
  updatePurchase: async (purchaseId, updates) => {
    const updatedPurchase = await purchaseService.update(purchaseId, updates);
    set((state) => ({
      purchases: state.purchases.map((purchase) =>
        purchase.id === purchaseId ? updatedPurchase : purchase
      )
    }));
  },
  deletePurchase: async (purchaseId) => {
    await purchaseService.remove(purchaseId);
    set((state) => ({
      purchases: state.purchases.filter((purchase) => purchase.id !== purchaseId)
    }));
  }
}));
