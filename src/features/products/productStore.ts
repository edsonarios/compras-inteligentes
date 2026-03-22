import { create } from "zustand";
import { persist } from "zustand/middleware";
import { storageKeys } from "@/lib/storage";
import type { Product, ProductInput } from "@/lib/types";
import { productService } from "@/features/products/services/productService";

type ProductState = {
  products: Product[];
  createProduct: (input: ProductInput) => Product;
  updateProduct: (productId: string, updates: Partial<ProductInput>) => void;
  deleteProduct: (productId: string) => void;
};

export const useProductStore = create<ProductState>()(
  persist(
    (set) => ({
      products: [],
      createProduct: (input) => {
        const nextProduct = productService.create(input);
        set((state) => ({ products: [...state.products, nextProduct] }));
        return nextProduct;
      },
      updateProduct: (productId, updates) => {
        set((state) => ({
          products: state.products.map((product) =>
            product.id === productId ? { ...product, ...updates } : product
          )
        }));
      },
      deleteProduct: (productId) => {
        set((state) => ({
          products: state.products.filter((product) => product.id !== productId)
        }));
      }
    }),
    {
      name: storageKeys.products
    }
  )
);
