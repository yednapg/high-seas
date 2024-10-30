import React, { useEffect, useState } from "react";
import Platforms from "./platforms";
import Modal from "../../../components/ui/modal";
import Cookies from "js-cookie";
import { hasHbData } from "../data";

/**
 * Modal component that guides users through the Hakatime setup process.
 *
 * @component
 * @param props - Component props
 * @param props.isOpen - Controls the visibility state of the modal
 * @param props.close - Callback function to close the modal
 * @param props.onHbDetect - Optional callback that runs when Hakatime heartbeat data is detected.
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
  wakaUsername,
  wakaKey,
}: {
  isOpen: any;
  close: () => Promise<void>;
  onHbDetect: () => Promise<void> | undefined;
  wakaUsername: string;
  wakaKey: string;
}) {
  const [hasRecvHb, setHasRecvHb] = useState<boolean>();
  useEffect(() => {
    (async () => {
      while (!!onHbDetect) {
        console.info("starting loop");
        const hasData = await hasHbData(wakaUsername);
        console.info({ hasData });

        if (hasData) {
          console.log("HAS DATAAAAAAAA");
          await onHbDetect();
          setHasRecvHb(true);
          break;
        }

        await new Promise((r) => setTimeout(r, 5_000));
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
