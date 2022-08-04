import React, { ReactNode } from "react";
import { Button } from "antd";

export type ReactDemoProps = {
  /**
   * a node to be rendered in the special component.
   */
  children?: ReactNode;
};

export function ReactDemo({ children }: ReactDemoProps) {
  return (
    <div>
      {children}
      <Button>hello, yeo</Button>
    </div>
  );
}
