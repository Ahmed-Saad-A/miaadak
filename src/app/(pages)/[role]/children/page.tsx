"use client";
import React from "react";
import { useRoleProtection } from "@/middleware/roleProtection";

const Children = () => {
  useRoleProtection();
  return <div>Children</div>;
};

export default Children;

