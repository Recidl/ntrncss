const DEFAULT_TIMEOUT_MS = 10000;
const RETRYABLE_STATUS = new Set([408, 425, 429, 500, 502, 503, 504]);
export const NETWORK_LOADING_EVENT = "nontronics:network-loading";

let inFlightRequestCount = 0;

const emitNetworkLoading = () => {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent(NETWORK_LOADING_EVENT, {
      detail: {
        active: inFlightRequestCount > 0,
        count: inFlightRequestCount,
      },
    })
  );
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function secureFetch(url, options = {}) {
  const {
    timeoutMs = DEFAULT_TIMEOUT_MS,
    retries = 1,
    retryDelayMs = 250,
    parseJson = true,
    ...fetchOptions
  } = options;

  let attempt = 0;
  let lastError = null;

  inFlightRequestCount += 1;
  emitNetworkLoading();

  try {
    while (attempt <= retries) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      try {
        const response = await fetch(url, {
          mode: "same-origin",
          credentials: "same-origin",
          redirect: "follow",
          referrerPolicy: "strict-origin-when-cross-origin",
          ...fetchOptions,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok && RETRYABLE_STATUS.has(response.status) && attempt < retries) {
          attempt += 1;
          await sleep(retryDelayMs * attempt);
          continue;
        }

        if (!parseJson) {
          return { response, data: null };
        }

        const data = await response.json().catch(() => ({}));
        return { response, data };
      } catch (error) {
        clearTimeout(timeoutId);
        lastError = error;

        if (attempt >= retries) {
          throw error;
        }

        attempt += 1;
        await sleep(retryDelayMs * attempt);
      }
    }

    throw lastError || new Error("Request failed");
  } finally {
    inFlightRequestCount = Math.max(0, inFlightRequestCount - 1);
    emitNetworkLoading();
  }
}
