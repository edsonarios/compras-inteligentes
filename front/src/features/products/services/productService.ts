import { createId } from "@/lib/utils";
import type { Product, ProductInput } from "@/lib/types";

export const productService = {
  create(input: ProductInput): Product {
    return {
      id: createId("product"),
      createdAt: new Date().toISOString(),
      ...input
    };
  }
};
