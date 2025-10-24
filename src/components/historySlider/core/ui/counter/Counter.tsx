import { ICounterProps } from "./Counter.interfaces";
import { useEffect, useRef } from "react";

export const Counter = ({ value, prevValue, ...props }: ICounterProps) => {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current || !prevValue) {
      return;
    }
    const iterCount = Math.abs(value - prevValue);

    let i = 0;
    const totalDelay = 800;
    const lastStepDelay = 100;
    const stepDelay = (totalDelay - lastStepDelay) / iterCount;

    function animate(delay: number) {
      return setTimeout(() => {
        if (i >= iterCount || !ref.current) {
          return;
        }
        const refValue = parseInt(ref.current.innerHTML);
        if (value > prevValue!!) {
          ref.current!!.innerHTML = (refValue + 1).toString();
        } else {
          ref.current!!.innerHTML = (refValue - 1).toString();
        }
        i += 1;
        if (i === iterCount - 1) {
          animate(lastStepDelay);
        } else {
          animate(delay);
        }
      }, delay);
    }
    const timeout = animate(stepDelay);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <span ref={ref} {...props}>
      {prevValue || value}
    </span>
  );
};
