'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
  SortingState,
} from '@tanstack/react-table';
import { DiseaseLog } from '@/types/dashboard';

const columnHelper = createColumnHelper<DiseaseLog>();

const columns = [
  columnHelper.accessor('cropName', {
    header: 'Crop',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('diseaseName', {
    header: 'Disease',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('diagnosisDate', {
    header: 'Diagnosis Date',
    cell: info => new Date(info.getValue()).toLocaleDateString(),
  }),
  columnHelper.accessor('severity', {
    header: 'Severity',
    cell: info => {
      const severity = info.getValue();
      const color = 
        severity === 'High' ? 'text-red-600 bg-red-100' : 
        severity === 'Medium' ? 'text-yellow-600 bg-yellow-100' : 
        'text-green-600 bg-green-100';
      
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
          {severity}
        </span>
      );
    },
  }),
  columnHelper.accessor('region', {
    header: 'Region',
    cell: info => info.getValue(),
  }),
];

export default function DiseaseLogsPanel() {
  const [data, setData] = useState<DiseaseLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);
  
  // Filters
  const [cropFilter, setCropFilter] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Unique values for filter dropdowns
  const [uniqueCrops, setUniqueCrops] = useState<string[]>([]);
  const [uniqueRegions, setUniqueRegions] = useState<string[]>([]);

  useEffect(() => {
    const fetchDiseaseLogs = async () => {
      try {
        setLoading(true);
        
        let url = '/api/disease-logs';
        const params = new URLSearchParams();
        
        if (cropFilter) params.append('crop', cropFilter);
        if (regionFilter) params.append('region', regionFilter);
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Failed to fetch disease logs');
        }
        
        const logs = await response.json();
        setData(logs);
        
        // Extract unique values for filters
        const crops = [...new Set(logs.map((log: DiseaseLog) => log.cropName))];
        const regions = [...new Set(logs.map((log: DiseaseLog) => log.region))];
        
        setUniqueCrops(crops);
        setUniqueRegions(regions);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDiseaseLogs();
  }, [cropFilter, regionFilter, startDate, endDate]);
  
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (loading) {
    return <div className="flex justify-center p-8">Loading disease logs...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">Error: {error}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Disease Diagnosis Logs</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Crop</label>
          <select
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={cropFilter}
            onChange={e => setCropFilter(e.target.value)}
          >
            <option value="">All Crops</option>
            {uniqueCrops.map(crop => (
              <option key={crop} value={crop}>{crop}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
          <select
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={regionFilter}
            onChange={e => setRegionFilter(e.target.value)}
          >
            <option value="">All Regions</option>
            {uniqueRegions.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input
            type="date"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <input
            type="date"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
          />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {
                      {
                        asc: ' 🔼',
                        desc: ' 🔽',
                      }[header.column.getIsSorted() as string] ?? null
                    }
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 border rounded-md disabled:opacity-50"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </button>
          <button
            className="px-3 py-1 border rounded-md disabled:opacity-50"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </button>
        </div>
        <span className="text-sm text-gray-700">
          Page {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount()}
        </span>
      </div>
    </div>
  );
} 