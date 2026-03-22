import { create } from "zustand";
import { persist } from "zustand/middleware";
import { storageKeys } from "@/lib/storage";
import type { Space } from "@/lib/types";
import { createId } from "@/lib/utils";
import { spaceService } from "@/features/spaces/services/spaceService";

type SpaceState = {
  spaces: Space[];
  currentSpaceId: string | null;
  initializeDefaultSpace: (ownerId: string) => void;
  createSpace: (name: string, ownerId: string) => void;
  renameSpace: (spaceId: string, name: string) => void;
  switchSpace: (spaceId: string) => void;
  addMember: (spaceId: string, email: string) => void;
};

export const useSpaceStore = create<SpaceState>()(
  persist(
    (set, get) => ({
      spaces: [],
      currentSpaceId: null,
      initializeDefaultSpace: (ownerId) => {
        const { spaces, currentSpaceId } = get();
        if (spaces.length > 0) {
          if (!currentSpaceId) {
            set({ currentSpaceId: spaces[0].id });
          }
          return;
        }

        const defaultSpace = spaceService.createDefault(ownerId);
        set({ spaces: [defaultSpace], currentSpaceId: defaultSpace.id });
      },
      createSpace: (name, ownerId) => {
        const nextSpace = spaceService.create({ name, ownerId });
        set((state) => ({
          spaces: [...state.spaces, nextSpace],
          currentSpaceId: nextSpace.id
        }));
      },
      renameSpace: (spaceId, name) => {
        set((state) => ({
          spaces: state.spaces.map((space) =>
            space.id === spaceId ? { ...space, name } : space
          )
        }));
      },
      switchSpace: (spaceId) => set({ currentSpaceId: spaceId }),
      addMember: (spaceId, email) => {
        set((state) => ({
          spaces: state.spaces.map((space) =>
            space.id === spaceId
              ? {
                  ...space,
                  members: [
                    ...space.members,
                    { id: createId("member"), email: email.trim().toLowerCase() }
                  ]
                }
              : space
          )
        }));
      }
    }),
    {
      name: storageKeys.spaces
    }
  )
);
