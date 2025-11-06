"use client";
import React from "react";
import { useRoleProtection } from "@/middleware/roleProtection";

const Students = () => {
  useRoleProtection();
  return <div>Students</div>;
};

export default Students;

