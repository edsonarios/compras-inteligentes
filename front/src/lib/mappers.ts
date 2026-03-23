import type {
  Location,
  Product,
  Purchase,
  Space,
  SpaceMember,
  User
} from "@/lib/types";

type ApiUser = {
  id: string;
  email: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
};

type ApiSpaceMember = {
  id: string;
  email: string;
};

type ApiSpace = {
  id: string;
  name: string;
  ownerId: string;
  owner?: ApiUser;
  members?: ApiSpaceMember[];
  createdAt: string;
  updatedAt?: string;
};

type ApiProduct = {
  id: string;
  spaceId: string;
  name: string;
  category: string;
  description: string;
  createdAt: string;
  updatedAt?: string;
};

type ApiLocation = {
  id: string;
  spaceId: string;
  name: string;
  gps: string;
  imageUrl?: string | null;
  createdAt: string;
  updatedAt?: string;
};

type ApiPurchase = {
  id: string;
  spaceId: string;
  productId: string;
  locationId: string;
  price: number | string;
  quantity: number;
  purchasedAt: string;
  note: string;
  imageUrl?: string | null;
  createdAt: string;
  updatedAt?: string;
};

export const mapUserFromApi = (user: ApiUser): User => ({
  id: user.id,
  email: user.email,
  name: user.name
});

export const mapSpaceMemberFromApi = (member: ApiSpaceMember): SpaceMember => ({
  id: member.id,
  email: member.email
});

export const mapSpaceFromApi = (space: ApiSpace): Space => ({
  id: space.id,
  name: space.name,
  ownerId: space.ownerId,
  ownerEmail: space.owner?.email,
  members: (space.members ?? []).map(mapSpaceMemberFromApi),
  createdAt: space.createdAt
});

export const mapProductFromApi = (product: ApiProduct): Product => ({
  id: product.id,
  spaceId: product.spaceId,
  name: product.name,
  category: product.category,
  description: product.description,
  createdAt: product.createdAt
});

export const mapLocationFromApi = (location: ApiLocation): Location => ({
  id: location.id,
  spaceId: location.spaceId,
  name: location.name,
  gps: location.gps,
  imageUrl: location.imageUrl ?? undefined,
  createdAt: location.createdAt
});

export const mapPurchaseFromApi = (purchase: ApiPurchase): Purchase => ({
  id: purchase.id,
  spaceId: purchase.spaceId,
  productId: purchase.productId,
  locationId: purchase.locationId,
  price: Number(purchase.price),
  quantity: Number(purchase.quantity),
  date: purchase.purchasedAt,
  note: purchase.note,
  imageUrl: purchase.imageUrl ?? undefined,
  createdAt: purchase.createdAt
});
