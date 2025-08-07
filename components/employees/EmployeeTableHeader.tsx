import React from 'react';
import { EmployeeWithRelations } from '@/lib/types';

interface EmployeeTableHeaderProps {
  sortColumn: keyof EmployeeWithRelations | 'BusinessTitle' | '';
  sortDirection: 'asc' | 'desc';
  onSort: (column: keyof EmployeeWithRelations | 'BusinessTitle') => void;
}

export default function EmployeeTableHeader({ sortColumn, sortDirection, onSort }: EmployeeTableHeaderProps) {
  const getSortIndicator = (column: keyof EmployeeWithRelations | 'BusinessTitle') => {
    if (sortColumn === column) {
      return sortDirection === 'asc' ? ' ↑' : ' ↓';
    }
    return '';
  };

  return (
    <div className="bg-gray-50 w-full pr-4 max-lg:max-w-full">
      <div className="employee-grid bg-slate-800 text-white font-medium text-xs leading-5 font-inter">
        <div
          className="flex flex-col items-stretch justify-center px-3 py-2 cursor-pointer hover:bg-slate-700"
          onClick={() => onSort('EmployeeStatus')}
        >
          <div>Status{getSortIndicator('EmployeeStatus')}</div>
        </div>
        <div
          className="flex flex-col items-start justify-center px-2 py-2 cursor-pointer hover:bg-slate-700"
          onClick={() => onSort('EE_NO')}
        >
          <div>Emp Number{getSortIndicator('EE_NO')}</div>
        </div>
        <div
          className="flex flex-col items-start justify-center px-2 py-2 cursor-pointer hover:bg-slate-700"
          onClick={() => onSort('LastName')}
        >
          <div>Last{getSortIndicator('LastName')}</div>
        </div>
        <div
          className="flex flex-col items-start justify-center px-2 py-2 cursor-pointer hover:bg-slate-700"
          onClick={() => onSort('FirstName')}
        >
          <div>First{getSortIndicator('FirstName')}</div>
        </div>
        <div
          className="flex flex-col items-stretch justify-center px-2 py-2 cursor-pointer hover:bg-slate-700"
          onClick={() => onSort('BusinessTitle')}
        >
          <div>Business Title{getSortIndicator('BusinessTitle')}</div>
        </div>
        <div
          className="flex flex-col items-stretch justify-center px-2 py-2 cursor-pointer hover:bg-slate-700"
          onClick={() => onSort('HireDate')}
        >
          <div>Hire Date{getSortIndicator('HireDate')}</div>
        </div>
        <div
          className="flex flex-col items-stretch justify-center px-2 py-2 cursor-pointer hover:bg-slate-700"
          onClick={() => onSort('TOS')}
        >
          <div>TOS{getSortIndicator('TOS')}</div>
        </div>
        <div
          className="flex flex-col items-stretch justify-center px-2 py-2 cursor-pointer hover:bg-slate-700"
          onClick={() => onSort('TermDate')}
        >
          <div>Term Date{getSortIndicator('TermDate')}</div>
        </div>
      </div>
    </div>
  );
}