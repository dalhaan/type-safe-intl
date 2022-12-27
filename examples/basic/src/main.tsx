import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import { IntlProvider } from "./intl";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <IntlProvider locale="en-NZ">
      <App />
    </IntlProvider>
  </React.StrictMode>
);
