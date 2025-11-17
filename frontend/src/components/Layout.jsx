import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import SideBar from "./sideBar";

const Layout = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="layout">
      <SideBar isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className="page-content">
        <div className={`content-wrapper ${isOpen ? "move-right" : ""}`}>
          {/* Pass isOpen status to all pages inside Outlet */}
          <Outlet context={{ isOpen }} />
        </div>
      </div>
    </div>
  );
};

export default Layout;
