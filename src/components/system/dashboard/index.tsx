"use client";

import { useRef, useState, useCallback, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  ModuleRegistry,
  AllCommunityModule,
  type ColDef,
  type GridReadyEvent,
  type RowClickedEvent,
} from "ag-grid-community";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "@/components/shared/styles/dataTable.css";

import { RefreshCw, Search, Download } from "lucide-react";

ModuleRegistry.registerModules([AllCommunityModule]);

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DataTableProps<T = unknown> {
  rowData: T[];
  columnDefs: ColDef[];
  title?: string;
  TitleIcon?: React.ElementType;
  accentColor?: string;
  badgeBg?: string;
  badgeText?: string;
  showRefresh?: boolean;
  onRefresh?: () => void;
  loading?: boolean;
  error?: string | null;
  showExport?: boolean;
  height?: number;
  pageSize?: number;
  headerActions?: React.ReactNode;
  rtl?: boolean;
  defaultColDef?: ColDef;
  /** callback لما المستخدم يضغط على صف */
  onRowClick?: (data: T) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DataTable<T = unknown>({
  rowData,
  columnDefs,
  title,
  TitleIcon,
  accentColor = "text-indigo-600",
  badgeBg = "bg-indigo-50",
  badgeText = "text-indigo-600",
  showRefresh = true,
  onRefresh,
  loading = false,
  error,
  showExport = false,
  height = 520,
  pageSize = 10,
  headerActions,
  rtl = true,
  defaultColDef,
  onRowClick,
}: DataTableProps<T>) {
  const gridRef = useRef<AgGridReact>(null);
  const [searchText, setSearchText] = useState("");

  const mergedDefaultColDef = useMemo<ColDef>(
    () => ({
      sortable: true,
      resizable: true,
      filter: true,
      suppressMovable: true,
      ...defaultColDef,
    }),
    [defaultColDef]
  );

  const onSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setSearchText(val);
      gridRef.current?.api?.setGridOption("quickFilterText", val);
    },
    []
  );

  const handleExport = useCallback(() => {
    gridRef.current?.api?.exportDataAsCsv({
      fileName: `${title ?? "export"}-${Date.now()}.csv`,
    });
  }, [title]);

  const onGridReady = useCallback((_e: GridReadyEvent) => { }, []);

  // ✅ الضغط على الصف يحدده ويستدعي callback
  const onRowClicked = useCallback(
    (e: RowClickedEvent) => {
      e.node.setSelected(true, true); // true, true = selected + deselect others
      onRowClick?.(e.data as T);
    },
    [onRowClick]
  );

  return (
    <div className="bg-white rounded-2xl overflow-hidden flex flex-col"
      style={{ boxShadow: "0 1px 3px rgba(15,23,42,0.08), 0 0 0 1px rgba(15,23,42,0.06)" }}>

      {/* ── Card Header ─────────────────────────────────────── */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-3 flex-wrap bg-white">
        <div className="flex items-center gap-2.5">
          {TitleIcon && (
            <div className={`p-1.5 rounded-lg bg-opacity-10 ${badgeBg}`}>
              <TitleIcon size={17} className={accentColor} strokeWidth={2.2} />
            </div>
          )}
          {title && (
            <h2 className={`font-bold text-sm ${accentColor}`}>{title}</h2>
          )}
          {!loading && (
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${badgeBg} ${badgeText}`}>
              {rowData.length}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              value={searchText}
              onChange={onSearchChange}
              placeholder="بحث سريع..."
              className="pr-9 pl-3 py-2 text-xs border border-slate-200 rounded-xl
                         focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400
                         w-44 transition-all placeholder:text-slate-400 text-slate-700 bg-slate-50
                         hover:border-slate-300"
              style={{ fontFamily: "inherit" }}
            />
            <Search size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Export */}
          {showExport && (
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold
                         text-slate-500 bg-slate-100 hover:bg-slate-200 hover:text-slate-700
                         rounded-xl transition-all"
            >
              <Download size={13} />
              تصدير
            </button>
          )}

          {/* Refresh */}
          {showRefresh && onRefresh && (
            <button
              onClick={onRefresh}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold
                         text-slate-500 bg-slate-100 hover:bg-slate-200 hover:text-slate-700
                         rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
              تحديث
            </button>
          )}

          {headerActions}
        </div>
      </div>

      {/* ── Error Banner ─────────────────────────────────────── */}
      {error && (
        <div className="mx-5 mt-3 p-3 bg-red-50 border border-red-100 rounded-xl text-red-500 text-xs flex items-center gap-2">
          <span>⚠️</span> {error}
        </div>
      )}

      {/* ── Grid ─────────────────────────────────────────────── */}
      <div className="ag-theme-alpine" style={{ height, width: "100%" }}>
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <div className="w-9 h-9 rounded-full border-2 border-indigo-100 border-t-indigo-500 animate-spin" />
            <span className="text-xs font-medium text-slate-400">جاري التحميل...</span>
          </div>
        ) : (
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={mergedDefaultColDef}
            onGridReady={onGridReady}
            pagination
            paginationPageSize={pageSize}
            enableRtl={rtl}
            animateRows
            rowHeight={54}
            headerHeight={48}
            suppressCellFocus
            // ✅ تفعيل الـ selection
            rowSelection="single"
            onRowClicked={onRowClicked}
            // cursor pointer على الصفوف
            getRowStyle={() => ({ cursor: "pointer" })}
            overlayNoRowsTemplate={`
              <div style="display:flex;flex-direction:column;align-items:center;gap:10px;color:#94a3b8;font-family:inherit;padding:40px">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round">
                  <rect x="3" y="3" width="18" height="18" rx="3"/>
                  <path d="M9 9h6M9 13h4"/>
                </svg>
                <span style="font-size:13px;font-weight:500">لا توجد بيانات للعرض</span>
              </div>
            `}
          />
        )}
      </div>
    </div>
  );
}

export default DataTable;