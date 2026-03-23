import { useEffect, useMemo, useState } from "react";
import { Button, Field, Input, Select } from "@/components/ui";
import { useSpaceStore } from "@/features/spaces/spaceStore";
import { useAuthStore } from "@/features/auth/authStore";

export const SpaceSwitcher = () => {
  const user = useAuthStore((state) => state.user);
  const spaces = useSpaceStore((state) => state.spaces);
  const currentSpaceId = useSpaceStore((state) => state.currentSpaceId);
  const loadSpaces = useSpaceStore((state) => state.loadSpaces);
  const switchSpace = useSpaceStore((state) => state.switchSpace);
  const createSpace = useSpaceStore((state) => state.createSpace);
  const renameSpace = useSpaceStore((state) => state.renameSpace);
  const addMember = useSpaceStore((state) => state.addMember);
  const removeMember = useSpaceStore((state) => state.removeMember);
  const currentSpace = useMemo(
    () => spaces.find((space) => space.id === currentSpaceId) ?? null,
    [spaces, currentSpaceId]
  );
  const isOwner = Boolean(user && currentSpace && currentSpace.ownerId === user.id);
  const ownerMember = useMemo(() => {
    if (!currentSpace) {
      return null;
    }

    if (user && currentSpace.ownerId === user.id) {
      return {
        id: user.id,
        email: currentSpace.ownerEmail ?? user.email
      };
    }

    return (
      currentSpace.members.find((member) => member.id === currentSpace.ownerId) ?? {
        id: currentSpace.ownerId,
        email: currentSpace.ownerEmail ?? ""
      }
    );
  }, [currentSpace, user]);
  const visibleMembers = useMemo(() => {
    const ownerEmail =
      (ownerMember?.email || currentSpace?.ownerEmail || "")
        .trim()
        .toLowerCase();
    const currentUserEmail = user?.email?.trim().toLowerCase() ?? "";
    const seen = new Set<string>();
    const filteredMembers = (currentSpace?.members ?? []).filter((member) => {
      const normalizedEmail = member.email.trim().toLowerCase();

      if (
        !normalizedEmail ||
        normalizedEmail === ownerEmail ||
        seen.has(normalizedEmail)
      ) {
        return false;
      }

      seen.add(normalizedEmail);
      return true;
    });

    const isCurrentUserOwner = Boolean(
      user && currentSpace && currentSpace.ownerId === user.id
    );
    const hasCurrentUserInMembers = filteredMembers.some(
      (member) => member.email.trim().toLowerCase() === currentUserEmail
    );

    if (
      currentUserEmail &&
      !isCurrentUserOwner &&
      currentUserEmail !== ownerEmail &&
      !hasCurrentUserInMembers
    ) {
      filteredMembers.unshift({
        id: `viewer-${currentUserEmail}`,
        email: user?.email ?? currentUserEmail
      });
    }

    return filteredMembers;
  }, [currentSpace, ownerMember?.email, user]);
  const [newSpaceName, setNewSpaceName] = useState("");
  const [editedName, setEditedName] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [memberError, setMemberError] = useState("");
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
    if (!currentSpace || !memberEmail.trim() || !isOwner || !user) {
      return;
    }

    const normalizedEmail = memberEmail.trim().toLowerCase();
    const ownerEmail =
      (ownerMember?.email || currentSpace.ownerEmail || "")
        .trim()
        .toLowerCase();

    if (normalizedEmail === ownerEmail || normalizedEmail === user.email.trim().toLowerCase()) {
      setMemberError("No puedes invitarte a ti mismo al espacio.");
      return;
    }

    void addMember(currentSpace.id, memberEmail)
      .then(() => {
        setMemberError("");
        setMemberEmail("");
        setIsOpen(false);
      })
      .catch((error: unknown) => {
        const message =
          error instanceof Error ? error.message : "No se pudo agregar el miembro.";
        setMemberError(message);
      });
  };

  const onRemoveMember = (email: string) => {
    if (!currentSpace || !isOwner) {
      return;
    }
    void removeMember(currentSpace.id, email);
  };

  return (
    <div className="relative">
      <Button
        variant="secondary"
        className="min-w-0 gap-2 rounded-full border border-[var(--theme-border)] px-4"
        onClick={() => {
          if (!isOpen) {
            void loadSpaces();
          }
          setIsOpen((value) => !value);
        }}
      >
        <span className="theme-text max-w-32 truncate">
          {currentSpace?.name ?? "Mi espacio"}
        </span>
        <span className="theme-muted">{isOpen ? "▲" : "▼"}</span>
      </Button>

      {isOpen ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center px-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/35 backdrop-blur-[2px]"
            aria-label="Cerrar panel de spaces"
            onClick={() => setIsOpen(false)}
          />

          <div className="theme-elevated relative z-10 w-full max-w-sm space-y-4 rounded-[28px] border p-4 shadow-panel backdrop-blur">
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

            {isOwner ? (
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
            ) : null}

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

            {isOwner ? (
              <div className="grid gap-3">
                <Field label="Invitar miembro por email">
                  <Input
                    type="email"
                    value={memberEmail}
                    onChange={(event) => {
                      setMemberEmail(event.target.value);
                      if (memberError) {
                        setMemberError("");
                      }
                    }}
                    placeholder="persona@email.com"
                  />
                </Field>
                {memberError ? (
                  <p className="theme-muted text-sm">{memberError}</p>
                ) : null}
                <Button variant="secondary" onClick={onAddMember}>
                  Agregar miembro
                </Button>
              </div>
            ) : (
              <div className="theme-soft rounded-[24px] border border-[var(--theme-border)] p-4">
                <p className="theme-muted text-sm">
                  Este espacio fue compartido contigo. Puedes ver sus miembros,
                  pero solo el dueño puede editarlo o gestionar invitaciones.
                </p>
              </div>
            )}

            {currentSpace ? (
              <div className="theme-soft rounded-[24px] border border-[var(--theme-border)] p-4">
                <p className="theme-muted text-xs uppercase tracking-[0.24em]">
                  Miembros
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="theme-chip rounded-full px-3 py-1 text-xs">
                    Dueño: {ownerMember?.email || currentSpace.ownerEmail || "sin email"}
                  </span>
                  {visibleMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-2 rounded-full border border-[var(--theme-border)] px-3 py-1 text-xs"
                    >
                      <span className="theme-muted">{member.email}</span>
                      {isOwner ? (
                        <button
                          type="button"
                          className="theme-muted text-[11px] hover:bg-[var(--theme-muted)] hover:text-[var(--theme-muted-foreground)] p-1 rounded-full"
                          onClick={() => onRemoveMember(member.email)}
                        >
                          Quitar
                        </button>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
};
