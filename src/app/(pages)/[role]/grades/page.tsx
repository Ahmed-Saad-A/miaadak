"use client";
import React from "react";
import { useRoleProtection } from "@/middleware/roleProtection";

const Grades = () => {
  useRoleProtection();
  return <div>Grades</div>;
};

export default Grades;

