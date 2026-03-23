import { apiRequest } from "@/lib/api";
import { mapPurchaseFromApi } from "@/lib/mappers";
import type { Purchase, PurchaseInput } from "@/lib/types";

export const purchaseService = {
  async findAll(): Promise<Purchase[]> {
    const purchases = await apiRequest<Purchase[]>("/purchases");
    return purchases.map((purchase) => mapPurchaseFromApi(purchase as never));
  },
  async create(input: PurchaseInput): Promise<Purchase> {
    const purchase = await apiRequest<Purchase>("/purchases", {
      method: "POST",
      body: input
    });
    return mapPurchaseFromApi(purchase as never);
  },
  async update(purchaseId: string, updates: Partial<PurchaseInput>): Promise<Purchase> {
    const purchase = await apiRequest<Purchase>(`/purchases/${purchaseId}`, {
      method: "PATCH",
      body: updates
    });
    return mapPurchaseFromApi(purchase as never);
  },
  async remove(purchaseId: string): Promise<void> {
    await apiRequest(`/purchases/${purchaseId}`, {
      method: "DELETE"
    });
  }
};
