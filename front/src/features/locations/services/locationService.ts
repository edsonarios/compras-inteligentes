import { apiRequest } from "@/lib/api";
import { mapLocationFromApi } from "@/lib/mappers";
import type { Location, LocationInput } from "@/lib/types";

export const locationService = {
  async findAll(): Promise<Location[]> {
    const locations = await apiRequest<Location[]>("/locations");
    return locations.map((location) => mapLocationFromApi(location as never));
  },
  async create(input: LocationInput): Promise<Location> {
    const location = await apiRequest<Location>("/locations", {
      method: "POST",
      body: input
    });
    return mapLocationFromApi(location as never);
  },
  async update(locationId: string, updates: Partial<LocationInput>): Promise<Location> {
    const location = await apiRequest<Location>(`/locations/${locationId}`, {
      method: "PATCH",
      body: updates
    });
    return mapLocationFromApi(location as never);
  },
  async remove(locationId: string): Promise<void> {
    await apiRequest(`/locations/${locationId}`, {
      method: "DELETE"
    });
  }
};
