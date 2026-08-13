"use client";
import React from "react";
import { useRoleProtection } from "@/middleware/roleProtection";

const Settings = () => {
  useRoleProtection();
  return <div>Settings</div>;
};

export default Settings;

