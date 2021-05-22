import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "./Header.module.css";

const Header: React.FC = () => {
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

  return (
    <nav className="shadow-md">
      <div className="container p-5">
        <h1 className="text-2xl">Swimhistory.co.za</h1>
      </div>
    </nav>
  );
};

export default Header;
