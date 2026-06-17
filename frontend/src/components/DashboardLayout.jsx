import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Navbar from "./Navbar";
const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-surface2 flex flex-col">
      {" "}
      <Header />{" "}
      <div className="flex flex-1 overflow-hidden">
        {" "}
        <Navbar />{" "}
        <main className="flex-1 overflow-y-auto pb-16 lg:pb-0 relative">
          {" "}
          <Outlet />{" "}
        </main>{" "}
      </div>{" "}
    </div>
  );
};
export default DashboardLayout;
