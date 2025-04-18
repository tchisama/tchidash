import React from "react";
// import DashboardUiProvider from '../components/DashboardUiProvider'
import SideBarDashboard from "../components/SideBarDashboard";

type Props = {
  children: React.ReactNode;
};

function layout({ children }: Props) {
  return (
    <div className="bg-slate-50  min-h-screen">
      {/* <DashboardUiProvider> */}
      <SideBarDashboard>
        <div className="bg-white rounded-lg p-3">
        {children}
        </div>
      </SideBarDashboard>
      {/* </DashboardUiProvider> */}
    </div>
  );
}

export default layout;

