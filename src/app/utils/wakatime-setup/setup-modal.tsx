import React, { useState, useEffect } from "react";
import Platforms from "./platforms";
import Modal from "../../../components/ui/modal";
import { hasHbData } from "../data";
import Cookies from "js-cookie";

function SetupModal({
  isOpen,
  close,
  onHbDetect,
}: {
  isOpen: boolean;
  close: () => void;
  onHbDetect?: () => void;
}) {
  const [wakaKey, setWakaKey] = useState<string>();
  const [hasRecvHb, setHasRecvHb] = useState(false);

  useEffect(() => {
    const { username, key, hasHb } = JSON.parse(Cookies.get("waka"));
    setWakaKey(key);

    let mounted = true;
    let timeoutId: number;

    async function checkHeartbeat() {
      if (!onHbDetect || !mounted) return;

      console.info("checking heartbeat for", username);
      const hasData = await hasHbData(username);
      console.info({ hasData });

      if (hasData && mounted) {
        console.log("Heartbeat data detected");
        onHbDetect();
        setHasRecvHb(true);
      } else if (mounted) {
        timeoutId = window.setTimeout(checkHeartbeat, 5000);
      }
    }

    checkHeartbeat();
    return () => {
      mounted = false;
      window.clearTimeout(timeoutId);
    };
  }, []);

  return (
    <Modal isOpen={isOpen} close={close}>
      {wakaKey && <Platforms wakaKey={wakaKey} />}
      {onHbDetect && (
        <p className="mt-4 text-lg">
          {hasRecvHb ? "Installed!" : "Waiting for install..."}
        </p>
      )}
    </Modal>
  );
}

export default SetupModal;
