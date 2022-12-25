import { screen } from "@testing-library/react";

import { setup } from "./setup";

describe("intl-formatter", () => {
  test("placeholder", () => {
    setup(
      "en-NZ",
      ["en-NZ", "fr"],
      {
        "en-NZ": {
          hello: "Hello {name}!",
        },
      },
      "hello",
      {
        name: "Jane",
      }
    );

    expect(screen.getByTestId("output")).toHaveTextContent("Hello Jane!");
  });

  test("currency", () => {
    setup(
      "en-NZ",
      ["en-NZ", "fr"],
      {
        "en-NZ": {
          price: "That will be {price, number, ::currency/EUR}!",
        },
      },
      "price",
      {
        price: 100,
      }
    );

    expect(screen.getByTestId("output")).toHaveTextContent(
      "That will be €100.00!"
    );
  });

  test("date", () => {
    setup(
      "en-NZ",
      ["en-NZ", "fr"],
      {
        "en-NZ": {
          date: "Some date is {date, date, ::yyyyMMdd}!",
        },
      },
      "date",
      {
        date: new Date("December 17, 1995 03:24:00"),
      }
    );

    expect(screen.getByTestId("output")).toHaveTextContent(
      "Some date is 17/12/1995!"
    );
  });
});
