import { createId } from "@/lib/utils";
import type { Space, SpaceInput } from "@/lib/types";

export const spaceService = {
  createDefault(ownerId: string): Space {
    return {
      id: createId("space"),
      name: "Mi espacio",
      ownerId,
      members: [],
      createdAt: new Date().toISOString()
    };
  },
  create(input: SpaceInput): Space {
    return {
      id: createId("space"),
      members: [],
      createdAt: new Date().toISOString(),
      ...input
    };
  }
};
