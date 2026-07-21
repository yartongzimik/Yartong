import { randomUUID } from "node:crypto";

export const ALLOWED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export type AllowedImageMimeType = (typeof ALLOWED_IMAGE_MIME_TYPES)[number];

export const MAX_PROFILE_IMAGE_BYTES = 5 * 1024 * 1024;
export const MAX_PORTFOLIO_IMAGE_BYTES = 10 * 1024 * 1024;

export type MediaVisibility = "PUBLIC" | "PRIVATE";
export type MediaPurpose =
  | "PROFILE_IMAGE"
  | "PORTFOLIO_IMAGE"
  | "VERIFICATION_DOCUMENT"
  | "DISPUTE_EVIDENCE"
  | "JOB_ATTACHMENT"
  | "CATALOG_IMAGE";

export type StorageConfiguration = {
  providerName: string | null;
  configured: boolean;
  missing: string[];
};

export type SignedUploadRequest = {
  ownerId: string;
  purpose: MediaPurpose;
  visibility: MediaVisibility;
  mimeType: string;
  sizeBytes: number;
  originalFilename: string;
};

export type SignedUploadResult = {
  objectKey: string;
  uploadUrl: string;
  publicUrl?: string;
  expiresAt: Date;
  headers?: Record<string, string>;
};

export interface MediaStorageAdapter {
  readonly providerName: string;
  createSignedUpload(request: SignedUploadRequest): Promise<SignedUploadResult>;
  createSignedReadUrl(objectKey: string, expiresInSeconds?: number): Promise<string>;
  deleteObject(objectKey: string): Promise<void>;
}

export function getStorageConfiguration(): StorageConfiguration {
  const providerName = process.env.MEDIA_STORAGE_PROVIDER?.trim() || null;
  const required = [
    ["MEDIA_STORAGE_PROVIDER", providerName],
    ["MEDIA_STORAGE_BUCKET", process.env.MEDIA_STORAGE_BUCKET?.trim()],
    ["MEDIA_STORAGE_ENDPOINT", process.env.MEDIA_STORAGE_ENDPOINT?.trim()],
    ["MEDIA_STORAGE_ACCESS_KEY", process.env.MEDIA_STORAGE_ACCESS_KEY?.trim()],
    ["MEDIA_STORAGE_SECRET_KEY", process.env.MEDIA_STORAGE_SECRET_KEY?.trim()],
  ] as const;

  const missing = required.filter(([, value]) => !value).map(([name]) => name);

  return {
    providerName,
    configured: missing.length === 0,
    missing,
  };
}

export function validateImageUpload(input: {
  purpose: MediaPurpose;
  mimeType: string;
  sizeBytes: number;
}) {
  if (!ALLOWED_IMAGE_MIME_TYPES.includes(input.mimeType as AllowedImageMimeType)) {
    throw new Error("Unsupported image type. Use JPEG, PNG, or WebP.");
  }

  if (!Number.isSafeInteger(input.sizeBytes) || input.sizeBytes <= 0) {
    throw new Error("Upload size must be a positive safe integer.");
  }

  const maxBytes =
    input.purpose === "PROFILE_IMAGE"
      ? MAX_PROFILE_IMAGE_BYTES
      : MAX_PORTFOLIO_IMAGE_BYTES;

  if (input.sizeBytes > maxBytes) {
    throw new Error(`Upload exceeds the ${Math.floor(maxBytes / 1024 / 1024)} MB limit.`);
  }
}

function sanitizeFilename(filename: string) {
  const normalized = filename
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-.]+|[-.]+$/g, "")
    .slice(0, 120);

  return normalized || "upload";
}

export function createMediaObjectKey(input: {
  ownerId: string;
  purpose: MediaPurpose;
  originalFilename: string;
}) {
  const purpose = input.purpose.toLowerCase().replaceAll("_", "-");
  return `${input.ownerId}/${purpose}/${randomUUID()}-${sanitizeFilename(input.originalFilename)}`;
}

export function requireMediaStorageAdapter(): never {
  const config = getStorageConfiguration();
  throw new Error(
    config.configured
      ? "Media storage is configured but no production adapter has been activated yet."
      : `Media storage is not configured. Missing: ${config.missing.join(", ")}.`,
  );
}
