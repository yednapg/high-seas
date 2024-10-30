import React, { useEffect, useState } from "react";
import Platforms from "./platforms";
import Modal from "../../../components/ui/modal";
import Cookies from "js-cookie";
import { hasHbData } from "../data";

/**
 * Modal component that guides users through the Hackatime setup process.
 *
 * @component
 * @param props - Component props
 * @param props.isOpen - Controls the visibility state of the modal
 * @param props.close - Callback function to close the modal
 * @param props.onHbDetect - Optional callback that runs when Hackatime heartbeat data is detected.
 *                          If provided, the component will perform heartbeat checks.
 *                          If not provided, heartbeat checks are disabled.
 * @returns React component
 *
 * @example
 * ```tsx
 * <SetupModal
 *   isOpen={true}
 *   close={() => setIsOpen(false)}
 *   onHbDetect={() => {
 *     // Handle heartbeat detection
 *     processHeartbeatData();
 *     setIsOpen(false);
 *   }}
 * />
 * ```
 */
export default function SetupModal({
  isOpen,
  close,
  onHbDetect,
}: {
  isOpen: any;
  close: () => void;
  onHbDetect: (() => any) | undefined;
}) {
  const [wakaKey, setWakaKey] = useState<string>();
  const [hasRecvHb, setHasRecvHb] = useState<boolean>();

  useEffect(() => {
    const { key, username, hasHb } = JSON.parse(Cookies.get("waka"));
    console.warn("ooh eur", { key, username, hasHb });
    setWakaKey(key);

    (async () => {
      hbDetectLoop: while (onHbDetect) {
        const hasData = await hasHbData(username);

        if (hasData) {
          onHbDetect();
          setHasRecvHb(true);
          break hbDetectLoop;
        }

        await new Promise((r) => setTimeout(r, 2_500));
      }
    })();
  }, []);

  return (
    <Modal isOpen={isOpen} close={close}>
      {wakaKey ? <Platforms wakaKey={wakaKey} /> : null}

      {onHbDetect ? (
        <p className="mt-4 text-lg">
          {hasRecvHb ? "Installed!" : "Waiting for install..."}
        </p>
      ) : null}
    </Modal>
  );
}
