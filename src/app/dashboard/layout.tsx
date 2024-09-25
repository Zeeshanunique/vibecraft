import React from "react";
import { Sidebar } from "./_components/sidebar";
import { AIUsage } from "./_components/ai-usage";

const DashboardLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div className="bg-gray-50 h-screen flex">
      <div className="md:w-64 hidden md:flex flex-col fixed h-full">
        <Sidebar />
        <div className="flex-grow">
          <AIUsage />
        </div>
      </div>
      <div className="md:ml-64 bg-gray-50 h-full w-full">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
