import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import { createIntlFunctions } from "../index";

const Consumer = ({
  useIntl,
  messages,
}: {
  useIntl: ReturnType<typeof createIntlFunctions>["useIntl"];
  messages: ReturnType<ReturnType<typeof createIntlFunctions>["generateIntl"]>;
}) => {
  const { formatMessage } = useIntl(messages) as any;

  return (
    <>
      <div data-testid="output">{formatMessage("hello")}</div>;
    </>
  );
};
const UI = ({
  locale,
  locales,
  messages,
}: {
  locale: string;
  locales: string[];
  messages: ReturnType<ReturnType<typeof createIntlFunctions>["generateIntl"]>;
}) => {
  const [localeState, setLocaleState] = React.useState(locale);
  const { IntlProvider, generateIntl, useIntl } = createIntlFunctions(locales);

  const messagesIntl = generateIntl(messages);

  return (
    <IntlProvider locale={localeState}>
      <select
        data-testid="lang-select"
        onChange={(key) => setLocaleState(key.target.value)}
      >
        {Object.keys(messages).map((key) => (
          <option key={key} data-testid={key} value={key}>
            {key}
          </option>
        ))}
      </select>
      <Consumer useIntl={useIntl} messages={messagesIntl} />
    </IntlProvider>
  );
};

const setup = (
  locale: string,
  locales: string[],
  messages: ReturnType<ReturnType<typeof createIntlFunctions>["generateIntl"]>
) => {
  render(<UI locale={locale} locales={locales} messages={messages} />);

  const user = userEvent.setup();

  async function changeLang(lang: string) {
    await user.selectOptions(screen.getByTestId("lang-select"), lang);
  }

  return {
    user,
    changeLang,
  };
};

describe("intl", () => {
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
