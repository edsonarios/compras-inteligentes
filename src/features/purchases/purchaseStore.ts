import { create } from "zustand";
import { persist } from "zustand/middleware";
import { storageKeys } from "@/lib/storage";
import type { Purchase, PurchaseInput } from "@/lib/types";
import { purchaseService } from "@/features/purchases/services/purchaseService";

type PurchaseState = {
  purchases: Purchase[];
  createPurchase: (input: PurchaseInput) => void;
  updatePurchase: (purchaseId: string, updates: Partial<PurchaseInput>) => void;
  deletePurchase: (purchaseId: string) => void;
};

export const usePurchaseStore = create<PurchaseState>()(
  persist(
    (set) => ({
      purchases: [],
      createPurchase: (input) => {
        const nextPurchase = purchaseService.create(input);
        set((state) => ({ purchases: [...state.purchases, nextPurchase] }));
      },
      updatePurchase: (purchaseId, updates) => {
        set((state) => ({
          purchases: state.purchases.map((purchase) =>
            purchase.id === purchaseId ? { ...purchase, ...updates } : purchase
          )
        }));
      },
      deletePurchase: (purchaseId) => {
        set((state) => ({
          purchases: state.purchases.filter(
            (purchase) => purchase.id !== purchaseId
          )
        }));
      }
    }),
    {
      name: storageKeys.purchases
    }
  )
);
