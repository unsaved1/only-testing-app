import { IContainerProps } from "./Container.interfaces";

import styles from "./Container.module.scss";
import cn from "clsx";

console.log(styles);

export const Container = ({
  className,
  children,
  ...props
}: IContainerProps) => {
  return (
    <div className={cn(styles.root, className)} {...props}>
      {children}
    </div>
  );
};
