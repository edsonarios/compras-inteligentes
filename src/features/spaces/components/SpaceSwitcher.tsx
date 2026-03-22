import { useEffect, useMemo, useState } from "react";
import { Button, Field, Input, Select } from "@/components/ui";
import { useSpaceStore } from "@/features/spaces/spaceStore";
import { useAuthStore } from "@/features/auth/authStore";

export const SpaceSwitcher = () => {
  const user = useAuthStore((state) => state.user);
  const spaces = useSpaceStore((state) => state.spaces);
  const currentSpaceId = useSpaceStore((state) => state.currentSpaceId);
  const switchSpace = useSpaceStore((state) => state.switchSpace);
  const createSpace = useSpaceStore((state) => state.createSpace);
  const renameSpace = useSpaceStore((state) => state.renameSpace);
  const addMember = useSpaceStore((state) => state.addMember);
  const currentSpace = useMemo(
    () => spaces.find((space) => space.id === currentSpaceId) ?? null,
    [spaces, currentSpaceId]
  );
  const [newSpaceName, setNewSpaceName] = useState("");
  const [editedName, setEditedName] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setEditedName(currentSpace?.name ?? "");
  }, [currentSpace]);

  const onCreateSpace = () => {
    if (!user || !newSpaceName.trim()) {
      return;
    }
    createSpace(newSpaceName.trim(), user.id);
    setNewSpaceName("");
    setIsOpen(false);
  };

  const onRenameSpace = () => {
    if (!currentSpace || !editedName.trim()) {
      return;
    }
    renameSpace(currentSpace.id, editedName.trim());
    setIsOpen(false);
  };

  const onAddMember = () => {
    if (!currentSpace || !memberEmail.trim()) {
      return;
    }
    addMember(currentSpace.id, memberEmail);
    setMemberEmail("");
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button
        variant="secondary"
        className="min-w-0 gap-2 rounded-full border border-[var(--theme-border)] px-4"
        onClick={() => setIsOpen((value) => !value)}
      >
        <span className="theme-text max-w-32 truncate">
          {currentSpace?.name ?? "Mi espacio"}
        </span>
        <span className="theme-muted">{isOpen ? "▲" : "▼"}</span>
      </Button>

      {isOpen ? (
        <div className="theme-elevated absolute right-0 top-14 z-30 w-[min(92vw,22rem)] space-y-4 rounded-[28px] border p-4 shadow-panel backdrop-blur">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="theme-muted text-xs uppercase tracking-[0.24em]">
                Spaces
              </p>
              <p className="theme-text mt-2 text-sm">
                Cambia el espacio activo o gestionalo desde aqui.
              </p>
            </div>
            <button
              type="button"
              className="theme-muted text-sm"
              onClick={() => setIsOpen(false)}
            >
              Cerrar
            </button>
          </div>

          <Field label="Space actual">
            <Select
              value={currentSpaceId ?? ""}
              onChange={(event) => switchSpace(event.target.value)}
            >
              {spaces.map((space) => (
                <option key={space.id} value={space.id}>
                  {space.name}
                </option>
              ))}
            </Select>
          </Field>

          <div className="grid gap-3">
            <Field label="Renombrar espacio">
              <Input
                value={editedName}
                onChange={(event) => setEditedName(event.target.value)}
                placeholder="Mi espacio"
              />
            </Field>
            <Button variant="secondary" onClick={onRenameSpace}>
              Guardar nombre
            </Button>
          </div>

          <div className="grid gap-3">
            <Field label="Crear nuevo espacio">
              <Input
                value={newSpaceName}
                onChange={(event) => setNewSpaceName(event.target.value)}
                placeholder="Compras familiares"
              />
            </Field>
            <Button variant="secondary" onClick={onCreateSpace}>
              Agregar space
            </Button>
          </div>

          <div className="grid gap-3">
            <Field label="Invitar miembro por email">
              <Input
                type="email"
                value={memberEmail}
                onChange={(event) => setMemberEmail(event.target.value)}
                placeholder="persona@email.com"
              />
            </Field>
            <Button variant="secondary" onClick={onAddMember}>
              Agregar miembro
            </Button>
          </div>

          {currentSpace ? (
            <div className="theme-soft rounded-[24px] border border-[var(--theme-border)] p-4">
              <p className="theme-muted text-xs uppercase tracking-[0.24em]">
                Miembros
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="theme-chip rounded-full px-3 py-1 text-xs">
                  {user?.email}
                </span>
                {currentSpace.members.map((member) => (
                  <span
                    key={member.id}
                    className="theme-muted rounded-full border border-[var(--theme-border)] px-3 py-1 text-xs"
                  >
                    {member.email}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};
