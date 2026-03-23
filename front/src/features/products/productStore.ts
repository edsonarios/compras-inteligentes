import { create } from "zustand";
import type { Product, ProductInput } from "@/lib/types";
import { productService } from "@/features/products/services/productService";

type ProductState = {
  products: Product[];
  loadProducts: () => Promise<void>;
  resetProducts: () => void;
  createProduct: (input: ProductInput) => Promise<Product>;
  updateProduct: (productId: string, updates: Partial<ProductInput>) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
};

export const useProductStore = create<ProductState>()((set) => ({
  products: [],
  loadProducts: async () => {
    const products = await productService.findAll();
    set({ products });
  },
  resetProducts: () => set({ products: [] }),
  createProduct: async (input) => {
    const nextProduct = await productService.create(input);
    set((state) => ({ products: [...state.products, nextProduct] }));
    return nextProduct;
  },
  updateProduct: async (productId, updates) => {
    const updatedProduct = await productService.update(productId, updates);
    set((state) => ({
      products: state.products.map((product) =>
        product.id === productId ? updatedProduct : product
      )
    }));
  },
  deleteProduct: async (productId) => {
    await productService.remove(productId);
    set((state) => ({
      products: state.products.filter((product) => product.id !== productId)
    }));
  }
}));
