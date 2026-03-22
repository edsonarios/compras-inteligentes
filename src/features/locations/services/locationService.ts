import { createId } from "@/lib/utils";
import type { Location, LocationInput } from "@/lib/types";

export const locationService = {
  create(input: LocationInput): Location {
    return {
      id: createId("location"),
      createdAt: new Date().toISOString(),
      ...input
    };
  }
};
