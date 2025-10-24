import { useEffect, useRef, useState } from "react";
import { IHistorySliderProps } from "./core";
import { HistorySliderDesktop } from "./desktop";
import { HistorySliderMobile } from "./mobile";
import { Delay } from "@/shared/lib/delay";

export const HistorySlider = (props: IHistorySliderProps) => {
  const throttleTimerRef = useRef<NodeJS.Timeout>(null);
  const [deviceType, setDeviceType] = useState<"mobile" | "desktop" | null>(
    null
  );

  useEffect(() => {
    const resizeObserver = new ResizeObserver(
      Delay.throttle(throttleTimerRef.current, (entries) => {
        for (const entry of entries) {
          if (entry.contentRect.width > 1024) {
            setDeviceType("desktop");
          } else {
            setDeviceType("mobile");
          }
        }
      })
    );
    resizeObserver.observe(document.body);
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  if (!deviceType) {
    return null;
  }

  if (deviceType === "desktop") {
    return <HistorySliderDesktop {...props} />;
  }
  return <HistorySliderMobile {...props} />;
};
