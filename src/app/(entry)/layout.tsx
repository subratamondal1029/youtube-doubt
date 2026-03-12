import Header from "@/components/layout/header";
import React from "react";

const EntryLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <>
      <Header />
      <main className="w-full min-h-screen pt-14">{children}</main>
    </>
  );
};

export default EntryLayout;
