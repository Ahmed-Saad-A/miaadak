"use client";
import React from "react";
import { useRoleProtection } from "@/middleware/roleProtection";

const Statistics = () => {
  useRoleProtection();
  return <div>Statistics</div>;
};

export default Statistics;

