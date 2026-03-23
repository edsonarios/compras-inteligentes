import { apiRequest } from "@/lib/api";
import { mapSpaceFromApi } from "@/lib/mappers";
import type { Space, User } from "@/lib/types";

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
    const users = await apiRequest<User[]>("/users");
    const existingUser = users.find(
      (user) => user.email.trim().toLowerCase() === normalizedEmail
    );

    if (!existingUser) {
      throw new Error("Solo puedes invitar usuarios ya creados.");
    }

    const ownerEmail =
      ((current as unknown as { owner?: { email?: string } }).owner?.email ??
        (current as unknown as { ownerEmail?: string }).ownerEmail ??
        "")
        .trim()
        .toLowerCase();

    if (normalizedEmail && ownerEmail && normalizedEmail === ownerEmail) {
      throw new Error("No puedes invitar al dueño del espacio como miembro.");
    }

    const nextMembers = [
      ...((current.members ?? []) as Array<{ id: string; email: string }>).map((member) => ({
        email: member.email
      })),
      { email: normalizedEmail, userId: existingUser.id }
    ];

    const updated = await apiRequest<Space>(`/spaces/${spaceId}`, {
      method: "PATCH",
      body: {
        members: nextMembers
      }
    });

    return mapSpaceFromApi(updated as never);
  },
  async removeMember(spaceId: string, memberEmail: string): Promise<Space> {
    const current = await apiRequest<Space>(`/spaces/${spaceId}`);
    const normalizedEmail = memberEmail.trim().toLowerCase();
    const nextMembers = ((current.members ?? []) as Array<{ id: string; email: string }>)
      .filter((member) => member.email.trim().toLowerCase() !== normalizedEmail)
      .map((member) => ({
        email: member.email
      }));

    const updated = await apiRequest<Space>(`/spaces/${spaceId}`, {
      method: "PATCH",
      body: {
        members: nextMembers
      }
    });

    return mapSpaceFromApi(updated as never);
  }
};
