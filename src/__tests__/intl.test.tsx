import { render, screen } from "@testing-library/react";
import React from "react";

describe("sum module", () => {
  test("intl", () => {
    const UI = <h1>Hello</h1>;

    render(UI);

    expect(screen.getByText("Hello")).toHaveTextContent("Hello");
  });
});
