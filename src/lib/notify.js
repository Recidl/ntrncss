const SITE_NOTIFY_EVENT = "nontronics:notify";

export function notifySite({
  title,
  message = "",
  variant = "info",
  duration = 3200,
} = {}) {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent(SITE_NOTIFY_EVENT, {
      detail: {
        title: title || "Notice",
        message,
        variant,
        duration,
      },
    })
  );
}

export { SITE_NOTIFY_EVENT };
