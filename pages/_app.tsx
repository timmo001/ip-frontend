import React, { useEffect } from "react";
import { AppProps } from "next/app";
import { NoSsr } from "@material-ui/core";

import "fontsource-roboto";

import "../assets/css/style.css";

function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    document.documentElement.lang = "en-GB";
  }, []);

  return (
    <NoSsr>
      <Component {...pageProps} />
    </NoSsr>
  );
}

export default App;
