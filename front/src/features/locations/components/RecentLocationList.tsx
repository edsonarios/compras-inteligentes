import { useEffect, useMemo, useRef, useState } from "react";
import { Button, Input, Panel, SectionHeader } from "@/components/ui";
import { SortBuilder } from "@/components/SortBuilder";
import {
  applySortRules,
  compareDate,
  compareText,
  type SortRule
} from "@/lib/sorting";
import type { Location } from "@/lib/types";

export const RecentLocationList = ({
  locations,
  onEdit,
  onDelete,
  busyDeleteId
}: {
  locations: Location[];
  onEdit: (location: Location) => void;
  onDelete: (locationId: string) => void;
  busyDeleteId?: string | null;
}) => {
  const [visibleCount, setVisibleCount] = useState(() => Math.min(10, locations.length));
  const [search, setSearch] = useState("");
  type LocationSortField = "name" | "gps" | "date";
  const [sortRules, setSortRules] = useState<SortRule<LocationSortField>[]>([
    { field: "date", direction: "desc" }
  ]);
  const previousLength = useRef(locations.length);

  const filteredLocations = useMemo(() => {
    const query = search.trim().toLowerCase();
    return locations.filter((location) =>
      `${location.name} ${location.gps}`.toLowerCase().includes(query)
    );
  }, [locations, search]);

  const sortedLocations = useMemo(
    () =>
      applySortRules(filteredLocations, sortRules, {
        name: (left, right, direction) => compareText(left.name, right.name, direction),
        gps: (left, right, direction) => compareText(left.gps, right.gps, direction),
        date: (left, right, direction) => compareDate(left.createdAt, right.createdAt, direction)
      }),
    [filteredLocations, sortRules]
  );

  useEffect(() => {
    if (locations.length > previousLength.current) {
      const delta = locations.length - previousLength.current;
      setVisibleCount((current) => current + delta);
    } else if (locations.length < previousLength.current) {
      setVisibleCount((current) => Math.min(current, locations.length));
    }

    previousLength.current = locations.length;
  }, [locations.length]);

  if (locations.length === 0) {
    return (
      <Panel>
        <p className="theme-muted text-sm">
          Todavia no hay ubicaciones en este espacio.
        </p>
      </Panel>
    );
  }

  return (
    <div className="space-y-4">
      <SectionHeader
        title={
          <>
            Ultimas ubicaciones{" "}
            <span className="theme-muted text-sm font-medium">
              (Total {locations.length} - {filteredLocations.length} visibles)
            </span>
          </>
        }
        subtitle="Vista simple de las ubicaciones creadas en el espacio activo."
      />

      <Panel className="grid gap-3">
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar ubicacion..."
        />
      </Panel>

      <SortBuilder
        label="Orden"
        rules={sortRules}
        options={[
          { value: "name", label: "Nombre" },
          { value: "gps", label: "GPS" },
          { value: "date", label: "Fecha" }
        ]}
        onChange={setSortRules}
      />

      {sortedLocations.length === 0 ? (
        <Panel>
          <p className="theme-muted text-sm">
            No hay ubicaciones que coincidan con la busqueda.
          </p>
        </Panel>
      ) : null}

      {sortedLocations.slice(0, visibleCount).map((location, index) => (
        <Panel key={location.id} className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="theme-muted text-xs uppercase tracking-[0.2em]">
                #{index + 1}
              </p>
              <p className="theme-text text-base font-medium">{location.name}</p>
              {location.gps ? (
                <p className="theme-muted mt-1 text-sm break-all">{location.gps}</p>
              ) : (
                <p className="theme-muted mt-1 text-sm">Sin GPS detallado</p>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" className="px-3" onClick={() => onEdit(location)}>
                Editar
              </Button>
              <Button
                variant="ghost"
                className="px-3"
                isLoading={busyDeleteId === location.id}
                onClick={() => onDelete(location.id)}
              >
                Borrar
              </Button>
            </div>
          </div>

          {location.imageUrl ? (
            <img
              src={location.imageUrl}
              alt={location.name}
              className="h-40 w-full rounded-[24px] object-cover"
            />
          ) : null}
        </Panel>
      ))}

      {visibleCount < sortedLocations.length ? (
        <Button variant="secondary" className="w-full" onClick={() => setVisibleCount(sortedLocations.length)}>
          Mostrar el resto
        </Button>
      ) : null}
    </div>
  );
};
