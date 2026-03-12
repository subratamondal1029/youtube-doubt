import Header from "@/components/layout/header";
import React from "react";

const EntryLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <>
      <Header />
      <main className="w-full min-h-screen mt-28 px-4">{children}</main>
    </>
  );
};

export default EntryLayout;
