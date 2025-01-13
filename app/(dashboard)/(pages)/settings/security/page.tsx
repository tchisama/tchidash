import React from "react";
import { SecuritySettings } from "./components/SecuritySettings";
import { Emplyies } from "./components/employies";

function page() {
  return (
    <div className="flex flex-col gap-4">
      <SecuritySettings />
      <Emplyies />
    </div>
  );
}

export default page;
