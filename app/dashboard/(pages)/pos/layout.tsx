import React from "react";

type Props = {
  children: React.ReactNode;
};

function layout({ children }: Props) {
  return (
    <html lang="en">
      <body className="bg-[#f9f9f9]">
        <main className="">{children}</main>
      </body>
    </html>
  );
}

export default layout;
