import React from "react";
import Navbar from "./navbar";

type Props = {
  children: React.ReactNode;
};

function layout({ children }: Props) {
  return (
    <div>
      <main className="flex  min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-2 md:gap-8 ">
        <div className="mx-auto grid w-full  items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
          <div>
            <Navbar />
          </div>
          <div className=" max-w-7xl w-full ">{children}</div>
        </div>
      </main>
    </div>
  );
}

export default layout;
