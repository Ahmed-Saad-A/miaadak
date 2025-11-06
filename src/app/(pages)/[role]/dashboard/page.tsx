"use client";
import React from "react";
import { useRoleProtection } from "@/middleware/roleProtection";

const Dashboard = () => {
  useRoleProtection();
  return <div>Dashboard</div>;
};

export default Dashboard;

