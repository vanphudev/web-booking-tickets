import React, {Suspense, lazy} from "react";
import {Spin} from "antd";
import ReactDOM from "react-dom/client";
import App from "./App";
import {ContentProvider} from "./hooks/common/contentContext";
import "./i18n/i18n";
import {Provider} from "react-redux";
import store from "./redux/store";
import "./styles/common/index.scss";

const root = ReactDOM.createRoot(document.getElementById("__next"));
root.render(
   <Provider store={store}>
      <ContentProvider>
         <App />
      </ContentProvider>
   </Provider>
);
