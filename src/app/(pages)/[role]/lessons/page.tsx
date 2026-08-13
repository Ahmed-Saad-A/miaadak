"use client";
import React from "react";
import { useRoleProtection } from "@/middleware/roleProtection";

const Lessons = () => {
  useRoleProtection();
  return <div>Lessons</div>;
};

export default Lessons;

