// ReusableTable.jsx
// Features: sorting, filtering (global + column), pagination (client-side), column resizing
// - Composable hooks: useSorting, useFiltering, usePagination, useColumnResize, useTable
// - Two exports: <SmartTable /> (self-contained) and <Table /> (presentational, controlled)

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';

// ---------- Utility helpers ----------
const noop = () => {};
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

// Default accessor resolver
const resolveAccessor = (accessor, row) => {
  if (!accessor) return undefined;
  if (typeof accessor === 'function') return accessor(row);
  return row[accessor];
};

// ---------- Hooks ----------

// useSorting - returns sorted rows and sort controls
function useSorting(data = [], initial = { sortBy: null, direction: 'asc' }) {
  const [sortBy, setSortBy] = useState(initial.sortBy);
  const [direction, setDirection] = useState(initial.direction || 'asc');

  const toggleSort = useCallback((colId) => {
    if (sortBy !== colId) {
      setSortBy(colId);
      setDirection('asc');
    } else {
      setDirection((d) => (d === 'asc' ? 'desc' : d === 'desc' ? null : 'asc'));
      // note: you can use null direction to mean "unsorted"
    }
  }, [sortBy]);

  const sorted = useMemo(() => {
    if (!sortBy || !direction) return data;
    const copy = [...data];
    copy.sort((a, b) => {
      const va = resolveAccessor(sortBy, a);
      const vb = resolveAccessor(sortBy, b);

      // basic compare - can be improved for locale or complex types
      if (va == null && vb == null) return 0;
      if (va == null) return -1;
      if (vb == null) return 1;

      if (typeof va === 'number' && typeof vb === 'number') {
        return direction === 'asc' ? va - vb : vb - va;
      }

      const as = String(va).toLowerCase();
      const bs = String(vb).toLowerCase();
      if (as === bs) return 0;
      return direction === 'asc' ? (as > bs ? 1 : -1) : (as > bs ? -1 : 1);
    });
    return copy;
  }, [data, sortBy, direction]);

  return { rows: sorted, sortBy, direction, setSortBy, setDirection, toggleSort };
}

// useFiltering - supports global and column filters
function useFiltering(data = [], { initialFilters = {}, initialGlobal = '' } = {}) {
  const [filters, setFilters] = useState(initialFilters);
  const [globalFilter, setGlobalFilter] = useState(initialGlobal);

  const setFilter = useCallback((colId, value) => {
    setFilters((prev) => ({ ...prev, [colId]: value }));
  }, []);

  const clearFilters = useCallback(() => { setFilters({}); setGlobalFilter(''); }, []);

  const filtered = useMemo(() => {
    if ((!globalFilter || String(globalFilter).trim() === '') && Object.values(filters).every(v => !v)) return data;

    const gf = String(globalFilter || '').toLowerCase();

    return data.filter((row) => {
      // column filters - all must match
      for (const [colId, value] of Object.entries(filters)) {
        if (!value) continue;
        const cell = resolveAccessor(colId, row);
        if (String(cell || '').toLowerCase().indexOf(String(value).toLowerCase()) === -1) return false;
      }
      // global filter - matches any column value
      if (gf) {
        const found = Object.keys(row).some(k => String(row[k] || '').toLowerCase().indexOf(gf) !== -1);
        if (!found) return false;
      }
      return true;
    });
  }, [data, filters, globalFilter]);

  return { rows: filtered, filters, setFilter, globalFilter, setGlobalFilter, clearFilters };
}

// usePagination - client-side pagination
function usePagination(data = [], { initialPage = 1, initialPageSize = 10 } = {}) {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const total = data.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    // clamp page when data or pageSize changes
    setPage((p) => clamp(p, 1, totalPages));
  }, [total, pageSize, totalPages]);

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, page, pageSize]);

  return { rows: paginated, page, setPage, pageSize, setPageSize, total, totalPages };
}

// useColumnResize - manages column widths
function useColumnResize(columns = []) {
  const initial = useMemo(() => columns.reduce((acc, c) => ({ ...acc, [c.id]: c.width || 150 }), {}), [columns]);
  const [widths, setWidths] = useState(initial);

  useEffect(() => { setWidths(initial); }, [initial]);

  const setColumnWidth = useCallback((colId, w) => {
    setWidths((prev) => ({ ...prev, [colId]: Math.max(40, w) }));
  }, []);

  return { widths, setColumnWidth };
}

// useTable - composes all hooks, suitable for SmartTable
function useTable({ data = [], columns = [], options = {} } = {}) {
  const accessorMap = useMemo(() => {
    // If column.accessor is a string, we'll use that key as colId for sorting/filtering
    const map = {};
    columns.forEach(col => { map[col.id] = col.accessor || col.id; });
    return map;
  }, [columns]);

  // For sorting/filtering hooks, we'll pass rows where accessor is row => resolveAccessor(col.accessor, row)
  // But to keep hooks simple, data rows must be objects keyed by column.id or use accessor functions when sorting/filtering.

  const { rows: filteredRows, filters, setFilter, globalFilter, setGlobalFilter, clearFilters } = useFiltering(data, { initialFilters: {}, initialGlobal: '' });
  const { rows: sortedRows, sortBy, direction, toggleSort, setSortBy, setDirection } = useSorting(filteredRows);
  const { rows: paginatedRows, page, setPage, pageSize, setPageSize, total, totalPages } = usePagination(sortedRows, { initialPage: 1, initialPageSize: options.pageSize || 10 });
  const { widths, setColumnWidth } = useColumnResize(columns);

  return {
    processedRows: paginatedRows,
    rawRows: data,
    // sorting
    sortBy, direction, toggleSort, setSortBy, setDirection,
    // filtering
    filters, setFilter, globalFilter, setGlobalFilter, clearFilters,
    // pagination
    page, setPage, pageSize, setPageSize, total, totalPages,
    // resizing
    widths, setColumnWidth,
  };
}

// ---------- Presentational Table component (controlled) ----------

export function Table({
  columns = [],
  rows = [], // already-processed rows (sorting/filtering/pagination may happen outside)
  // sorting
  sortBy = null, direction = null, onSort = noop,
  // filtering
  filters = {}, onFilter = noop, globalFilter = '', onGlobalFilter = noop,
  // pagination
  page = 1, pageSize = 10, total = rows.length, onPageChange = noop, onPageSizeChange = noop,
  // resizing
  columnWidths = {}, onColumnResize = noop,
  // renderers
  renderRowKey = (r, i) => r.id ?? i,
}) {
  // Basic Table render
  return (
    <div className="w-full border rounded-md overflow-hidden">
      <div role="table" aria-rowcount={rows.length} className="w-full table-auto">
        <div role="rowgroup" className="bg-gray-50 border-b">
          <div role="row" className="flex">
            {columns.map(col => (
              <div
                role="columnheader"
                key={col.id}
                style={{ width: columnWidths[col.id] || col.width || 150 }}
                className="p-2 text-sm font-medium flex items-center border-r"
                aria-sort={sortBy === col.id ? (direction === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex items-center gap-2 cursor-pointer" onClick={() => onSort(col.id)}>
                    <span>{col.label}</span>
                    {sortBy === col.id && direction && <span className="text-xs">{direction === 'asc' ? '▲' : '▼'}</span>}
                  </div>
                </div>
                {/* resize handle */}
                <div
                  style={{ width: 8, cursor: 'col-resize' }}
                  onMouseDown={(e) => {
                    // lift the event to parent via onColumnResize as a drag starter
                    onColumnResize(col.id, e);
                  }}
                />
              </div>
            ))}
          </div>
          {/* column filters row */}
          <div role="row" className="flex">
            {columns.map(col => (
              <div key={col.id} style={{ width: columnWidths[col.id] || col.width || 150 }} className="p-1 border-r">
                {col.filterable !== false && (
                  <input
                    aria-label={`Filter ${col.label}`}
                    placeholder={`Filter ${col.label}`}
                    className="w-full text-sm p-1"
                    value={filters[col.id] || ''}
                    onChange={(e) => onFilter(col.id, e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div role="rowgroup">
          {rows.map((row, rIdx) => (
            <div role="row" className="flex border-b" key={renderRowKey(row, rIdx)}>
              {columns.map(col => (
                <div key={col.id} role="cell" style={{ width: columnWidths[col.id] || col.width || 150 }} className="p-2 text-sm border-r">
                  {col.render ? col.render(row) : resolveAccessor(col.accessor || col.id, row)}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Footer - simple pagination */}
        <div className="p-2 flex items-center justify-between">
          <div className="flex items-center gap-2">Showing {rows.length} of {total}</div>
          <div className="flex items-center gap-2">
            <button onClick={() => onPageChange(Math.max(1, page - 1))} disabled={page <= 1} className="px-2 py-1 border rounded">Prev</button>
            <span>Page {page}</span>
            <button onClick={() => onPageChange(page + 1)} disabled={(page * pageSize) >= total} className="px-2 py-1 border rounded">Next</button>
            <select value={pageSize} onChange={(e) => onPageSizeChange(Number(e.target.value))} className="p-1 border rounded">
              {[10, 20, 50].map(s => <option key={s} value={s}>{s}/page</option>)}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- SmartTable - ready-to-use component that uses hooks internally ----------

export default function SmartTable({ columns = [], data = [], initialOptions = {} }) {
  // Compose hook
  const table = useTable({ data, columns, options: initialOptions });

  // Column resize handling (mouse drag implemented here)
  const resizing = useRef({ colId: null, startX: 0, startW: 0 });

  useEffect(() => {
    function onMouseMove(e) {
      if (!resizing.current.colId) return;
      const delta = e.clientX - resizing.current.startX;
      table.setColumnWidth(resizing.current.colId, Math.max(40, resizing.current.startW + delta));
    }
    function onUp() { resizing.current = { colId: null, startX: 0, startW: 0 }; }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMouseMove); window.removeEventListener('mouseup', onUp); };
  }, [table]);

  const handleResizeStart = useCallback((colId, e) => {
    e.preventDefault();
    resizing.current = { colId, startX: e.clientX, startW: table.widths[colId] || 150 };
  }, [table]);

  // Debounce global filter to avoid frequent recalculation
  const [tmpGlobal, setTmpGlobal] = useState('');
  useEffect(() => {
    const id = setTimeout(() => table.setGlobalFilter(tmpGlobal), 300);
    return () => clearTimeout(id);
  }, [tmpGlobal, table]);

  return (
    <div>
      {/* Global search */}
      <div className="mb-2 flex items-center gap-2">
        <input className="p-2 border rounded flex-1" placeholder="Search..." value={tmpGlobal} onChange={(e) => setTmpGlobal(e.target.value)} />
        <button onClick={() => { table.clearFilters(); setTmpGlobal(''); }} className="px-3 py-2 border rounded">Clear</button>
      </div>

      <Table
        columns={columns}
        rows={table.processedRows}
        // sorting
        sortBy={table.sortBy}
        direction={table.direction}
        onSort={(colId) => table.toggleSort(colId)}
        // filtering
        filters={table.filters}
        onFilter={(colId, val) => table.setFilter(colId, val)}
        globalFilter={table.globalFilter}
        onGlobalFilter={(v) => table.setGlobalFilter(v)}
        // pagination
        page={table.page}
        pageSize={table.pageSize}
        total={table.total}
        onPageChange={(p) => table.setPage(p)}
        onPageSizeChange={(s) => table.setPageSize(s)}
        // resizing
        columnWidths={table.widths}
        onColumnResize={(colId, e) => handleResizeStart(colId, e)}
      />
    </div>
  );
}

// ---------- USAGE EXAMPLE (not exported) ----------
/*
const columns = [
  { id: 'name', label: 'Name', accessor: 'name', sortable: true, filterable: true, width: 220 },
  { id: 'age', label: 'Age', accessor: 'age', sortable: true, width: 80 },
  { id: 'city', label: 'City', accessor: 'city', filterable: true },
  { id: 'actions', label: '', render: (row) => <button className="px-2 py-1 border rounded">Edit</button> }
];

<SmartTable columns={columns} data={myRows} initialOptions={{ pageSize: 10 }} />
*/