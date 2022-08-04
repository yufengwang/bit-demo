import React, { ReactNode } from "react";
import { Button as Btn } from "antd";

export type ButtonProps = {
  /**
   * a nod to be redered in the special component.1sfaf1
   */
  children?: ReactNode;
};

export function Button({ children }: ButtonProps) {
  return <Btn type="primary">{children}</Btn>;
}

export default Button;
