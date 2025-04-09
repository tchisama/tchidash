import React from "react";
// import DashboardUiProvider from '../components/DashboardUiProvider'
import SideBarDashboard from "../components/SideBarDashboard";

type Props = {
  children: React.ReactNode;
};

function layout({ children }: Props) {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* <DashboardUiProvider> */}
      <SideBarDashboard>{children}</SideBarDashboard>
      {/* </DashboardUiProvider> */}
    </div>
  );
}

export default layout;

