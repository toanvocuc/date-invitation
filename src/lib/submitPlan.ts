import { DELIVERY, isDeliveryConfigured } from "@/data/delivery";
import { buildSummary, formatPlanText } from "@/lib/summary";
import type { DatePlan } from "@/types/date";

const ENDPOINT = "https://api.web3forms.com/submit";
const TIMEOUT_MS = 12000;

export type SubmitResult =
  | { status: "sent" }
  /** No access key configured yet - the copy / share button is the fallback. */
  | { status: "skipped" }
  | { status: "error"; message: string };

export type SubmitState = { status: "idle" | "sending" } | SubmitResult;

interface Web3FormsResponse {
  success?: boolean;
  message?: string;
}

/**
 * Post the finished plan to Web3Forms, which forwards it as an email.
 *
 * Never throws: a failed send must not break the confirmation screen, it just
 * switches it to "copy this and send it to me".
 */
export async function submitPlan(plan: DatePlan): Promise<SubmitResult> {
  if (!isDeliveryConfigured()) return { status: "skipped" };

  // Every answer becomes its own line in the email body.
  const answers = Object.fromEntries(
    buildSummary(plan).map((row) => [row.label, `${row.emoji} ${row.value}`]),
  );

  const payload = {
    access_key: DELIVERY.web3formsAccessKey,
    subject: DELIVERY.subject,
    from_name: DELIVERY.fromName,
    ...answers,
    Summary: formatPlanText(plan),
    "Answered at": new Date().toLocaleString(),
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    const body = (await response.json().catch(() => ({}))) as Web3FormsResponse;

    if (response.ok && body.success) return { status: "sent" };

    return {
      status: "error",
      message: body.message ?? `Request failed (${response.status})`,
    };
  } catch (error) {
    const message =
      error instanceof DOMException && error.name === "AbortError"
        ? "The request timed out"
        : error instanceof Error
          ? error.message
          : "Network error";
    return { status: "error", message };
  } finally {
    clearTimeout(timeout);
  }
}
