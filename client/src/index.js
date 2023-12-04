import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ColorSchemeScript, MantineProvider, createTheme } from "@mantine/core";
import { Helmet } from "react-helmet";

const theme = createTheme({
  primaryColor: "blue",
});

const resolver = (theme) => ({
  variables: {},
  light: {
    "--mantine-color-deep-orange": theme.other.deepOrangeLight,
  },
  dark: {
    // "--mantine-color-body": "#00000",
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <Helmet>
      <ColorSchemeScript />
    </Helmet>
    <MantineProvider theme={theme} cssVariablesResolver={resolver}>
      <App />
    </MantineProvider>
  </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
