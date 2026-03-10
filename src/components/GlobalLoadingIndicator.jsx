import { useEffect, useState } from "react";
import { NETWORK_LOADING_EVENT } from "@/lib/http";

const SHOW_DELAY_MS = 120;
const HIDE_DELAY_MS = 220;

export default function GlobalLoadingIndicator({ active = false }) {
  const [networkActive, setNetworkActive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleNetworkLoading = (event) => {
      setNetworkActive(Boolean(event?.detail?.active));
    };

    window.addEventListener(NETWORK_LOADING_EVENT, handleNetworkLoading);
    return () => {
      window.removeEventListener(NETWORK_LOADING_EVENT, handleNetworkLoading);
    };
  }, []);

  useEffect(() => {
    const shouldBeVisible = active || networkActive;
    const delay = shouldBeVisible ? SHOW_DELAY_MS : HIDE_DELAY_MS;

    const timerId = window.setTimeout(() => {
      setIsVisible(shouldBeVisible);
    }, delay);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [active, networkActive]);

  return (
    <div
      className={`global-loading-shell ${isVisible ? "is-visible" : ""}`}
      aria-hidden={!isVisible}
    >
      <div className="global-loading-bar" />
    </div>
  );
}
