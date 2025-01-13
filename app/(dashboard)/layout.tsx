import React from "react";
import Protected from "./components/Protected";
import AppCodeProvider from "./components/AppCodeProvider";

type Props = {
  children: React.ReactNode;
};
function layout({ children }: Props) {
  return (
    <div>
      <Protected>
        <AppCodeProvider>{children}</AppCodeProvider>
      </Protected>
    </div>
  );
}

export default layout;

