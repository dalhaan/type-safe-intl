import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import { createIntl } from "../index";

const Consumer = ({
  useIntl,
  messages,
  id,
  values,
}: {
  useIntl: ReturnType<typeof createIntl>["useIntl"];
  messages: ReturnType<ReturnType<typeof createIntl>["defineMessages"]>;
  id?: string | undefined;
  values?: Record<string, any> | undefined;
}) => {
  const { formatMessage } = useIntl(messages) as any;

  return (
    <>
      <div data-testid="output">{formatMessage(id || "hello", values)}</div>;
    </>
  );
};

const UI = ({
  locale,
  locales,
  messages,
  id,
  values,
}: {
  locale: string;
  locales: string[];
  messages: ReturnType<ReturnType<typeof createIntl>["defineMessages"]>;
  id?: string | undefined;
  values?: Record<string, any> | undefined;
}) => {
  const [localeState, setLocaleState] = React.useState(locale);
  const { IntlProvider, defineMessages, useIntl } = createIntl(locales);

  const messagesIntl = defineMessages(messages);

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
      <Consumer
        useIntl={useIntl}
        messages={messagesIntl}
        id={id}
        values={values}
      />
    </IntlProvider>
  );
};

export const setup = (
  locale: string,
  locales: string[],
  messages: ReturnType<ReturnType<typeof createIntl>["defineMessages"]>,
  id?: string | undefined,
  values?: Record<string, any> | undefined
) => {
  render(
    <UI
      locale={locale}
      locales={locales}
      messages={messages}
      id={id}
      values={values}
    />
  );

  const user = userEvent.setup();

  async function changeLang(lang: string) {
    await user.selectOptions(screen.getByTestId("lang-select"), lang);
  }

  return {
    user,
    changeLang,
  };
};
