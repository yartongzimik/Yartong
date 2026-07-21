export type ExternalNotificationChannel = "email" | "sms" | "push";

export type ExternalNotificationDeliveryRequest = {
  userId: string;
  channel: ExternalNotificationChannel;
  destination: string;
  title: string;
  body: string;
  href?: string | null;
  idempotencyKey: string;
};

export type ExternalNotificationDeliveryResult = {
  providerName: string;
  providerMessageId: string;
  acceptedAt: Date;
};

export interface ExternalNotificationDeliveryAdapter {
  readonly providerName: string;
  readonly channels: readonly ExternalNotificationChannel[];
  send(request: ExternalNotificationDeliveryRequest): Promise<ExternalNotificationDeliveryResult>;
}

export type ExternalNotificationConfiguration = {
  providerName: string | null;
  configured: boolean;
  channels: ExternalNotificationChannel[];
  missing: string[];
};

const SUPPORTED_CHANNELS: ExternalNotificationChannel[] = ["email", "sms", "push"];

export function getExternalNotificationConfiguration(): ExternalNotificationConfiguration {
  const providerName = process.env.NOTIFICATION_PROVIDER?.trim() || null;
  const apiKey = process.env.NOTIFICATION_PROVIDER_API_KEY?.trim() || null;
  const configuredChannels = (process.env.NOTIFICATION_CHANNELS || "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter((value): value is ExternalNotificationChannel =>
      SUPPORTED_CHANNELS.includes(value as ExternalNotificationChannel),
    );

  const missing: string[] = [];
  if (!providerName) missing.push("NOTIFICATION_PROVIDER");
  if (!apiKey) missing.push("NOTIFICATION_PROVIDER_API_KEY");
  if (configuredChannels.length === 0) missing.push("NOTIFICATION_CHANNELS");

  return {
    providerName,
    configured: missing.length === 0,
    channels: [...new Set(configuredChannels)],
    missing,
  };
}

export function requireExternalNotificationDeliveryAdapter(): never {
  const configuration = getExternalNotificationConfiguration();
  throw new Error(
    configuration.configured
      ? "External notification credentials are configured, but no concrete delivery adapter has been activated yet."
      : `External notification delivery is not configured. Missing: ${configuration.missing.join(", ")}.`,
  );
}
