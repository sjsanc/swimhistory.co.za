import React, { ReactNode, useState } from "react";
import Header from "./Header";
import ToastWrapper from "./ToastWrapper";

type Props = {
  children: ReactNode;
};

const Layout: React.FC<any> = (props) => (
  <div className="app">
    <div>
      <Header />
      <main className="container p-5 mx-auto shadow-md">{props.children}</main>
    </div>
    <ToastWrapper />
  </div>
);

export default Layout;
