"use client";
import React from "react";
import { useRoleProtection } from "@/middleware/roleProtection";

const Users = () => {
  useRoleProtection();
  return <div>Users</div>;
};

export default Users;

