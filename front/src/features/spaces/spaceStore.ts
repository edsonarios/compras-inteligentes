import { create } from "zustand";
import { persist } from "zustand/middleware";
import { storageKeys } from "@/lib/storage";
import type { Space } from "@/lib/types";
import { spaceService } from "@/features/spaces/services/spaceService";

type SpaceState = {
  spaces: Space[];
  currentSpaceId: string | null;
  loadSpaces: () => Promise<void>;
  resetSpaces: () => void;
  initializeDefaultSpace: (ownerId: string) => Promise<void>;
  createSpace: (name: string, ownerId: string) => Promise<void>;
  renameSpace: (spaceId: string, name: string) => Promise<void>;
  switchSpace: (spaceId: string) => void;
  addMember: (spaceId: string, email: string) => Promise<void>;
};

export const useSpaceStore = create<SpaceState>()(
  persist(
    (set, get) => ({
      spaces: [],
      currentSpaceId: null,
      loadSpaces: async () => {
        const spaces = await spaceService.findAll();
        const { currentSpaceId } = get();
        const nextCurrentSpaceId =
          currentSpaceId && spaces.some((space) => space.id === currentSpaceId)
            ? currentSpaceId
            : spaces[0]?.id ?? null;
        set({ spaces, currentSpaceId: nextCurrentSpaceId });
      },
      resetSpaces: () => {
        set({ spaces: [], currentSpaceId: null });
      },
      initializeDefaultSpace: async (ownerId) => {
        const { spaces, currentSpaceId } = get();
        if (spaces.length > 0) {
          if (!currentSpaceId) {
            set({ currentSpaceId: spaces[0].id });
          }
          return;
        }

        const defaultSpace = await spaceService.createDefault(ownerId);
        set({ spaces: [defaultSpace], currentSpaceId: defaultSpace.id });
      },
      createSpace: async (name, ownerId) => {
        const nextSpace = await spaceService.create({ name, ownerId });
        set((state) => ({
          spaces: [...state.spaces, nextSpace],
          currentSpaceId: nextSpace.id
        }));
      },
      renameSpace: async (spaceId, name) => {
        const updatedSpace = await spaceService.update(spaceId, { name });
        set((state) => ({
          spaces: state.spaces.map((space) =>
            space.id === spaceId ? updatedSpace : space
          )
        }));
      },
      switchSpace: (spaceId) => set({ currentSpaceId: spaceId }),
      addMember: async (spaceId, email) => {
        const updatedSpace = await spaceService.addMember(spaceId, email);
        set((state) => ({
          spaces: state.spaces.map((space) =>
            space.id === spaceId ? updatedSpace : space
          )
        }));
      }
    }),
    {
      name: storageKeys.spaces,
      partialize: (state) => ({
        currentSpaceId: state.currentSpaceId
      })
    }
  )
);
