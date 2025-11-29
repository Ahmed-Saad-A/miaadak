"use client";

import React, { useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  ColDef,
  ModuleRegistry,
  AllCommunityModule,
} from "ag-grid-community";
import { useRoleProtection } from "@/middleware/roleProtection";

ModuleRegistry.registerModules([AllCommunityModule]);

const Dashboard = () => {
  useRoleProtection();

  const [search, setSearch] = useState("");

  const rowData = useMemo(
    () => [
      { name: "أحمد علي", subject: "رياضيات", lessons: 12 },
      { name: "سارة محمد", subject: "علوم", lessons: 8 },
      { name: "محمود سيد", subject: "عربي", lessons: 10 },
      { name: "منى خالد", subject: "إنجليزي", lessons: 7 },
    ],
    []
  );

  const colDefs: ColDef[] = [
    {
      headerName: "#",
      valueGetter: "node.rowIndex + 1",
      width: 80,
      sortable: false,
      filter: false,
      pinned: "right",
      cellClass: "text-center font-semibold",
    },
    {
      field: "name",
      headerName: "اسم الطالب",
      filter: true,
      sortable: true,
    },
    {
      field: "subject",
      headerName: "المادة",
      filter: true,
      sortable: true,
    },
    {
      field: "lessons",
      headerName: "عدد الحصص",
      filter: "agNumberColumnFilter",
      sortable: true,
    },
  ];

  return (
    <div className="p-6 space-y-4">
      {/* Search */}
      <input
        type="text"
        placeholder="بحث..."
        className="p-3 border rounded w-full mb-3 outline-none focus:ring focus:ring-blue-300"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Table */}
      <div
        className="ag-theme-quartz p-4 bg-red-200"
        style={{ height: 450, width: "100%" }}
        dir="rtl"
      >
        <AgGridReact
          rowData={rowData.filter((item) =>
            JSON.stringify(item).includes(search)
          )}
          columnDefs={colDefs}
          pagination={true}
          paginationPageSize={10}
          enableRtl={true}
          rowSelection="single"
          rowClassRules={{
            "bg-blue-100": "node.selected",
          }}
        />
      </div>
    </div>
  );
};

export default Dashboard;
