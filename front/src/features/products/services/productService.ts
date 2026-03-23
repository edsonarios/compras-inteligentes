import { apiRequest } from "@/lib/api";
import { mapProductFromApi } from "@/lib/mappers";
import type { Product, ProductInput } from "@/lib/types";

export const productService = {
  async findAll(): Promise<Product[]> {
    const products = await apiRequest<Product[]>("/products");
    return products.map((product) => mapProductFromApi(product as never));
  },
  async create(input: ProductInput): Promise<Product> {
    const product = await apiRequest<Product>("/products", {
      method: "POST",
      body: input
    });
    return mapProductFromApi(product as never);
  },
  async update(productId: string, updates: Partial<ProductInput>): Promise<Product> {
    const product = await apiRequest<Product>(`/products/${productId}`, {
      method: "PATCH",
      body: updates
    });
    return mapProductFromApi(product as never);
  },
  async remove(productId: string): Promise<void> {
    await apiRequest(`/products/${productId}`, {
      method: "DELETE"
    });
  }
};
