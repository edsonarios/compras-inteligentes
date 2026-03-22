import { create } from "zustand";
import { persist } from "zustand/middleware";
import { storageKeys } from "@/lib/storage";
import type { Location, LocationInput } from "@/lib/types";
import { locationService } from "@/features/locations/services/locationService";

type LocationState = {
  locations: Location[];
  createLocation: (input: LocationInput) => Location;
  updateLocation: (locationId: string, updates: Partial<LocationInput>) => void;
  deleteLocation: (locationId: string) => void;
};

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      locations: [],
      createLocation: (input) => {
        const nextLocation = locationService.create(input);
        set((state) => ({ locations: [...state.locations, nextLocation] }));
        return nextLocation;
      },
      updateLocation: (locationId, updates) => {
        set((state) => ({
          locations: state.locations.map((location) =>
            location.id === locationId ? { ...location, ...updates } : location
          )
        }));
      },
      deleteLocation: (locationId) => {
        set((state) => ({
          locations: state.locations.filter((location) => location.id !== locationId)
        }));
      }
    }),
    {
      name: storageKeys.locations
    }
  )
);
