import React, { ReactNode } from "react";
import { Button } from "@weimai/maiui";

export type MaiuiDemoProps = {
  /**
   * a node to be rendered in the special component.
   */
  children?: ReactNode;
};

export function MaiuiDemo({ children }: MaiuiDemoProps) {
  return (
    <div>
      {children}
      <Button type="primary">hello</Button>
    </div>
  );
}
