import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import  './App.css'
import  './Style.css'
// import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from "react-redux";
import store from "./ReduxTookit/Store";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

