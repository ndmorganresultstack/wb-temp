import React from 'react';
import { ExternalLaborCost } from '@/lib/helper';

interface ExternalLaborTableHeaderProps {
  sortColumn: keyof ExternalLaborCost | 'VendorNo' | 'Vendor' | 'Purpose' | 'Hours' | 'Rate' | 'TotalCost' | '';
  sortDirection: 'asc' | 'desc';
  onSort: (column: keyof ExternalLaborCost | 'VendorNo' | 'Vendor' | 'Purpose' | 'Hours' | 'Rate' | 'TotalCost' ) => void;
}

export default function ExternalLaborTableHeader({ sortColumn, sortDirection, onSort }: ExternalLaborTableHeaderProps) {
  const getSortIndicator = (column: keyof ExternalLaborCost | 'VendorNo' | 'Vendor' | 'Purpose' | 'Hours' | 'Rate' | 'TotalCost' ) => {
    if (sortColumn === column) {
      return sortDirection === 'asc' ? ' ↑' : ' ↓';
    }
    return '';
  };

  return (
    <div className="bg-gray-50 w-full pr-4 max-lg:max-w-full">
      <div className="external-labor-grid bg-slate-800 text-white font-medium text-xs leading-5 font-inter">
        <div
          className="flex flex-col items-center justify-center px-3 py-2 cursor-pointer hover:bg-slate-700"
          onClick={() => onSort('VendorNo')}
        >
          <div>Vendor No.{getSortIndicator('VendorNo')}</div>
        </div>
        <div
          className="flex flex-col items-center justify-center px-2 py-2 cursor-pointer hover:bg-slate-700"
          onClick={() => onSort('Vendor')}
        >
          <div>Vendor{getSortIndicator('Vendor')}</div>
        </div>
        <div
          className="flex flex-col items-center justify-center px-2 py-2 cursor-pointer hover:bg-slate-700"
          onClick={() => onSort('Purpose')}
        >
          <div>Purpose{getSortIndicator('Purpose')}</div>
        </div>
        <div
          className="flex flex-col items-center justify-center px-2 py-2 cursor-pointer hover:bg-slate-700"
          onClick={() => onSort('Hours')}
        >
          <div>Hours{getSortIndicator('Hours')}</div>
        </div>
        <div
          className="flex flex-col items-center justify-center px-2 py-2 cursor-pointer hover:bg-slate-700"
          onClick={() => onSort('Rate')}
        >
          <div>Rate{getSortIndicator('Rate')}</div>
        </div>
        <div
          className="flex flex-col items-center justify-center px-2 py-2 cursor-pointer hover:bg-slate-700"
          onClick={() => onSort('TotalCost')}
        >
          <div>Total Cost{getSortIndicator('TotalCost')}</div>
        </div>
        <div
          className="flex flex-col items-center justify-center px-2 py-2 cursor-pointer hover:bg-slate-700"
         
        >
          <div>Admin Share</div>
        </div>
        <div
          className="flex flex-col items-center justify-center px-2 py-2 cursor-pointer hover:bg-slate-700"
        >
          <div>Annual Admin </div>
        </div>
        <div
          className="flex flex-col items-center justify-center px-2 py-2 cursor-pointer hover:bg-slate-700"
         
        >
          <div>Annual Prop</div>
        </div>        
        <div
          className="flex flex-col items-center justify-center px-2 py-2 cursor-pointer hover:bg-slate-700"
         
        >
          <div>Start Date</div>
        </div>        
        <div
          className="flex flex-col items-center justify-center px-2 py-2 cursor-pointer hover:bg-slate-700"
         
        >
          <div>Finish Date</div>
        </div>        
      </div>
    </div>
  );
}