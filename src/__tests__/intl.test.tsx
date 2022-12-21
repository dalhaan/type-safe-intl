import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import { createIntlFunctions, LocalesFromIntlProvider } from "../index";

const { generateIntl, IntlProvider, useIntl } = createIntlFunctions<
  "en-nz" | "fr"
>();

type Locale = LocalesFromIntlProvider<typeof IntlProvider>;

const intl = generateIntl({
  "en-nz": {
    hello: "Hello!",
  },
  fr: {
    hello: "Bonjour!",
  },
});

const Consumer = () => {
  const { formatMessage } = useIntl(intl);

  return <div data-testid="output">{formatMessage("hello")}</div>;
};

const UI = ({ locale }: { locale: Locale }) => {
  const [localeState, setLocaleState] = React.useState(locale);

  const handleToggle = () =>
    setLocaleState((prev) => (prev === "en-nz" ? "fr" : "en-nz"));

  return (
    <>
      <button data-testid="change" onClick={handleToggle}>
        Change language
      </button>

      <IntlProvider locale={localeState}>
        <Consumer />
      </IntlProvider>
    </>
  );
};

const setup = (locale: Locale) => {
  render(<UI locale={locale} />);

  const user = userEvent.setup();

  return {
    user,
  };
};

describe("sum module", () => {
  test("english", () => {
    setup("en-nz");

    expect(screen.getByTestId("output")).toHaveTextContent("Hello!");
  });

  test("french", () => {
    setup("fr");

    expect(screen.getByTestId("output")).toHaveTextContent("Bonjour!");
  });

  test("english -> french", async () => {
    const { user } = setup("en-nz");
    expect(screen.getByTestId("output")).toHaveTextContent("Hello!");

    await user.click(screen.getByTestId("change"));

    expect(screen.getByTestId("output")).toHaveTextContent("Bonjour!");
  });
});
