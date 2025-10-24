import { TSpanProps } from "@/shared/types";

export interface ICounterProps extends TSpanProps {
  value: number;
  prevValue?: number;
}
