import { JSX } from "react";

export type Nullable<T> = T | null;

export type TDivProps = JSX.IntrinsicElements["div"];
export type TSpanProps = JSX.IntrinsicElements["span"];
export type TBtnProps = JSX.IntrinsicElements["button"];

export type TEvent = {
  preventDefault: () => void;
};
