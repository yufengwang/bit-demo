import React from "react";
import { render } from "@testing-library/react";
import { BasicMaiuiDemo } from "./maiui-demo.composition";

it("should render with the correct text", () => {
  const { getByText } = render(<BasicMaiuiDemo />);
  const rendered = getByText("hello world!");
  expect(rendered).toBeTruthy();
  /* expect(1).toBe(1); */
});
