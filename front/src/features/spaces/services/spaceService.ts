import { apiRequest } from "@/lib/api";
import { mapSpaceFromApi } from "@/lib/mappers";
import type { Space } from "@/lib/types";

type CreateSpacePayload = {
  name: string;
  ownerId: string;
};

export const spaceService = {
  async findAll(): Promise<Space[]> {
    const spaces = await apiRequest<Space[]>("/spaces");
    return spaces.map((space) => mapSpaceFromApi(space as never));
  },
  async createDefault(ownerId: string): Promise<Space> {
    return this.create({ name: "Mi espacio", ownerId });
  },
  async create(input: CreateSpacePayload): Promise<Space> {
    const space = await apiRequest<Space>("/spaces", {
      method: "POST",
      body: input
    });
    return mapSpaceFromApi(space as never);
  },
  async update(spaceId: string, updates: Partial<CreateSpacePayload>): Promise<Space> {
    const space = await apiRequest<Space>(`/spaces/${spaceId}`, {
      method: "PATCH",
      body: updates
    });
    return mapSpaceFromApi(space as never);
  },
  async addMember(spaceId: string, email: string): Promise<Space> {
    const current = await apiRequest<Space>(`/spaces/${spaceId}`);
    const normalizedEmail = email.trim().toLowerCase();
    const nextMembers = [
      ...((current.members ?? []) as Array<{ id: string; email: string }>).map((member) => ({
        email: member.email
      })),
      { email: normalizedEmail }
    ];

    const updated = await apiRequest<Space>(`/spaces/${spaceId}`, {
      method: "PATCH",
      body: {
        members: nextMembers
      }
    });

    return mapSpaceFromApi(updated as never);
  }
};
