"use client";
import React from "react";
import { useRoleProtection } from "@/middleware/roleProtection";

const Assistant = () => {
  useRoleProtection();
  return <div>Assistant</div>;
};

export default Assistant;

