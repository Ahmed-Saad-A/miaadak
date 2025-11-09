"use client";
import React from "react";
import { useRoleProtection } from "@/middleware/roleProtection";

const Schedule = () => {
  useRoleProtection();
  return <div>Schedule</div>;
};

export default Schedule;

