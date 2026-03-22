import { createId } from "@/lib/utils";
import type { Purchase, PurchaseInput } from "@/lib/types";

export const purchaseService = {
  create(input: PurchaseInput): Purchase {
    return {
      id: createId("purchase"),
      createdAt: new Date().toISOString(),
      ...input
    };
  }
};
