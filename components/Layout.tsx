import React, { ReactNode } from "react";
import Header from "./Header";

type Props = {
  children: ReactNode;
};

const Layout: React.FC<Props> = (props) => (
  <div className="app">
    <Header />
    <main className="container p-5 mx-auto shadow-md">{props.children}</main>
  </div>
);

export default Layout;
