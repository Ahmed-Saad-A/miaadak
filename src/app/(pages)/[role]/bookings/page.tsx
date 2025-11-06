"use client";
import React from "react";
import { useRoleProtection } from "@/middleware/roleProtection";

const Bookings = () => {
  useRoleProtection();
  return <div>Bookings</div>;
};

export default Bookings;

