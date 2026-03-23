const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ??
  "http://localhost:3000/api";

export const uploadService = {
  async uploadImage(params: {
    file: File;
    spaceId: string;
    entityType: "locations" | "purchases";
    entityId?: string;
    fileNameStem?: string;
  }) {
    const formData = new FormData();
    formData.append("file", params.file);
    formData.append("spaceId", params.spaceId);
    formData.append("entityType", params.entityType);
    if (params.entityId) {
      formData.append("entityId", params.entityId);
    }
    if (params.fileNameStem) {
      formData.append("fileNameStem", params.fileNameStem);
    }

    const response = await fetch(`${API_BASE_URL}/uploads/image`, {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || "No se pudo subir la imagen.");
    }

    return (await response.json()) as { key: string; url: string };
  }
};
