import { ReactNode } from "react";

export function Show<T>({
  when,
  children,
  fallback = null,
}: {
  when: T | null | undefined;
  fallback?: ReactNode;
  children: ((value: T) => any) | ReactNode;
}) {
  if (!when) {
    return fallback;
  }
  if (typeof children === "function") {
    return children(when);
  }
  return children;
}
