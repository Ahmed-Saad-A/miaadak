"use client";
import React from "react";
import { useRoleProtection } from "@/middleware/roleProtection";

const Notifications = () => {
  useRoleProtection();
  return <div>Notifications</div>;
};

export default Notifications;

