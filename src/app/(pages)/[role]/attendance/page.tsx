"use client";
import React from "react";
import { useRoleProtection } from "@/middleware/roleProtection";

const Attendance = () => {
  useRoleProtection();
  return <div>Attendance</div>;
};

export default Attendance;

