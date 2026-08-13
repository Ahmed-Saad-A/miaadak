"use client";
import React from "react";
import { useRoleProtection } from "@/middleware/roleProtection";

const Schedule = () => {
  useRoleProtection();
  return <div>Schedule
    <h1>Ahmed</h1>
  </div>;
};

export default Schedule;

