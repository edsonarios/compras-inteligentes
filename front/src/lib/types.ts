export type User = {
  id: string;
  email: string;
  name: string;
};

export type SpaceMember = {
  id: string;
  email: string;
};

export type Space = {
  id: string;
  name: string;
  ownerId: string;
  members: SpaceMember[];
  createdAt: string;
};

export type Product = {
  id: string;
  spaceId: string;
  name: string;
  category: string;
  description: string;
  createdAt: string;
};

export type Location = {
  id: string;
  spaceId: string;
  name: string;
  gps: string;
  imageUrl?: string;
  createdAt: string;
};

export type Purchase = {
  id: string;
  spaceId: string;
  productId: string;
  locationId: string;
  price: number;
  quantity: number;
  date: string;
  note: string;
  imageUrl?: string;
  createdAt: string;
};

export type ProductInput = Omit<Product, "id" | "createdAt">;
export type LocationInput = Omit<Location, "id" | "createdAt">;
export type SpaceInput = Pick<Space, "name" | "ownerId">;
export type PurchaseInput = Omit<Purchase, "id" | "createdAt">;
