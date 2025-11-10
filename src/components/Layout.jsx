import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import SideBar from "./sideBar";

const Layout = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="layout">
      <SideBar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Keep page-content same, but add wrapper for motion */}
      <div className="page-content">
        <div className={`content-wrapper ${isOpen ? "move-right" : ""}`}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
