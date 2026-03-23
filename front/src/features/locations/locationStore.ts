import { create } from "zustand";
import type { Location, LocationInput } from "@/lib/types";
import { locationService } from "@/features/locations/services/locationService";

type LocationState = {
  locations: Location[];
  loadLocations: () => Promise<void>;
  resetLocations: () => void;
  createLocation: (input: LocationInput) => Promise<Location>;
  updateLocation: (locationId: string, updates: Partial<LocationInput>) => Promise<void>;
  deleteLocation: (locationId: string) => Promise<void>;
};

export const useLocationStore = create<LocationState>()((set) => ({
  locations: [],
  loadLocations: async () => {
    const locations = await locationService.findAll();
    set({ locations });
  },
  resetLocations: () => set({ locations: [] }),
  createLocation: async (input) => {
    const nextLocation = await locationService.create(input);
    set((state) => ({ locations: [...state.locations, nextLocation] }));
    return nextLocation;
  },
  updateLocation: async (locationId, updates) => {
    const updatedLocation = await locationService.update(locationId, updates);
    set((state) => ({
      locations: state.locations.map((location) =>
        location.id === locationId ? updatedLocation : location
      )
    }));
  },
  deleteLocation: async (locationId) => {
    await locationService.remove(locationId);
    set((state) => ({
      locations: state.locations.filter((location) => location.id !== locationId)
    }));
  }
}));
