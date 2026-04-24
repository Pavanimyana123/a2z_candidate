import React, { useEffect, useState } from "react";
import Sidebar from "../Layout/Sidebar";
import Header from "../Layout/Header";

function AdminAnnouncements() {
  return (
    <div className="ta-layout-wrapper">
      <Sidebar />
      <div className="ta-main-wrapper">
        <Header />
      </div>
    </div>
  );
}

export default AdminAnnouncements;
