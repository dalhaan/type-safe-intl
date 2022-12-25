import { screen } from "@testing-library/react";

import { setup } from "./setup";

describe("basic", () => {
  test("english", () => {
    setup("en-NZ", ["en-NZ", "fr"], {
      "en-NZ": {
        hello: "Hello!",
      },
      fr: {
        hello: "Bonjour!",
      },
    });

    expect(screen.getByTestId("output")).toHaveTextContent("Hello!");
  });

  test("french", () => {
    setup("fr", ["en-NZ", "fr"], {
      "en-NZ": {
        hello: "Hello!",
      },
      fr: {
        hello: "Bonjour!",
      },
    });

    expect(screen.getByTestId("output")).toHaveTextContent("Bonjour!");
  });

  test("changing language", async () => {
    const { changeLang } = setup("en-NZ", ["en-NZ", "fr"], {
      "en-NZ": {
        hello: "Hello!",
      },
      fr: {
        hello: "Bonjour!",
      },
    });

    expect(screen.getByTestId("output")).toHaveTextContent("Hello!");

    await changeLang("fr");

    expect(screen.getByTestId("output")).toHaveTextContent("Bonjour!");
  });

  test("invalid locale casing", () => {
    expect(() => {
      setup("", ["en-nz"], {
        "en-nz": {
          hello: "Hello!",
        },
      });
    }).toThrow('Invalid locale: "en-nz", did you mean "en-NZ"');
  });

  test("unknown locale", () => {
    expect(() => {
      setup("", ["en_NZ"], {
        en_NZ: {
          hello: "Hello!",
        },
      });
    }).toThrow('Invalid locale: "en_NZ"');
  });
});
