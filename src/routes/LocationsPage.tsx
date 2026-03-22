import { useMemo, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Page } from "@/components/ui";
import { LocationForm } from "@/features/locations/components/LocationForm";
import { RecentLocationList } from "@/features/locations/components/RecentLocationList";
import { useLocationStore } from "@/features/locations/locationStore";
import { useSpaceStore } from "@/features/spaces/spaceStore";
import { scrollToPageTop } from "@/lib/scroll";
import type { Location } from "@/lib/types";

export const LocationsPage = () => {
  const currentSpaceId = useSpaceStore((state) => state.currentSpaceId);
  const locations = useLocationStore((state) => state.locations);
  const createLocation = useLocationStore((state) => state.createLocation);
  const updateLocation = useLocationStore((state) => state.updateLocation);
  const deleteLocation = useLocationStore((state) => state.deleteLocation);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);

  const scopedLocations = useMemo(
    () =>
      locations
        .filter((location) => location.spaceId === currentSpaceId)
        .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)),
    [locations, currentSpaceId]
  );

  return (
    <Page>
      <div className="space-y-4">
        <AppHeader
          eyebrow="Ubicaciones"
          title="Ubicaciones recientes"
          description="Administra referencias mas detalladas de tus lugares de compra."
        />

        <LocationForm
          initialValue={editingLocation}
          onSubmit={(values) => {
            if (!currentSpaceId) {
              return;
            }

            if (editingLocation) {
              updateLocation(editingLocation.id, { ...values, spaceId: currentSpaceId });
              setEditingLocation(null);
              return;
            }

            createLocation({ ...values, spaceId: currentSpaceId });
          }}
          onCancel={editingLocation ? () => setEditingLocation(null) : undefined}
        />

        <RecentLocationList
          locations={scopedLocations}
          onEdit={(location) => {
            setEditingLocation(location);
            scrollToPageTop();
          }}
          onDelete={deleteLocation}
        />
      </div>
    </Page>
  );
};
