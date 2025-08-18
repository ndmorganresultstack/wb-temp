import React from 'react';
import { InternalLaborCost } from '@/lib/helper';

interface InternalLaborTableHeaderProps {
  sortColumn: keyof InternalLaborCost | 'EmployeeStatus' | 'LastName' | 'FirstName' | 'BusinessTitle' | 'FunctionCategory' | 'RoleName' | '';
  sortDirection: 'asc' | 'desc';
  onSort: (column: keyof InternalLaborCost | 'EmployeeStatus' | 'LastName' | 'FirstName' | 'BusinessTitle' | 'FunctionCategory' | 'RoleName') => void;
}

export default function InternalLaborTableHeader({ sortColumn, sortDirection, onSort }: InternalLaborTableHeaderProps) {
  const getSortIndicator = (column: keyof InternalLaborCost | 'EmployeeStatus' | 'LastName' | 'FirstName' | 'BusinessTitle' | 'FunctionCategory' | 'RoleName') => {
    if (sortColumn === column) {
      return sortDirection === 'asc' ? ' ↑' : ' ↓';
    }
    return '';
  };

  return (
    <div className="bg-gray-50 w-full pr-4 max-lg:max-w-full">
      <div className="internal-labor-grid bg-slate-800 text-white font-medium text-xs leading-5 font-inter">
        <div
          className="flex flex-col items-center justify-center px-3 py-2 cursor-pointer hover:bg-slate-700"
          onClick={() => onSort('EmployeeStatus')}
        >
          <div>Status{getSortIndicator('EmployeeStatus')}</div>
        </div>
        <div
          className="flex flex-col items-center justify-center px-2 py-2 cursor-pointer hover:bg-slate-700"
          onClick={() => onSort('EE_NO')}
        >
          <div>Emp Number{getSortIndicator('EE_NO')}</div>
        </div>
        <div
          className="flex flex-col items-center justify-center px-2 py-2 cursor-pointer hover:bg-slate-700"
          onClick={() => onSort('LastName')}
        >
          <div>Last{getSortIndicator('LastName')}</div>
        </div>
        <div
          className="flex flex-col items-center justify-center px-2 py-2 cursor-pointer hover:bg-slate-700"
          onClick={() => onSort('FirstName')}
        >
          <div>First{getSortIndicator('FirstName')}</div>
        </div>
        <div
          className="flex flex-col items-center justify-center px-2 py-2 cursor-pointer hover:bg-slate-700"
          onClick={() => onSort('BusinessTitle')}
        >
          <div>Business Title{getSortIndicator('BusinessTitle')}</div>
        </div>
        <div
          className="flex flex-col items-center justify-center px-2 py-2 cursor-pointer hover:bg-slate-700"
          onClick={() => onSort('FunctionCategory')}
        >
          <div>Function{getSortIndicator('FunctionCategory')}</div>
        </div>
        <div
          className="flex flex-col items-center justify-center px-2 py-2 cursor-pointer hover:bg-slate-700"
          onClick={() => onSort('RoleName')}
        >
          <div>Role{getSortIndicator('RoleName')}</div>
        </div>
        <div
          className="flex flex-col items-center justify-center px-2 py-2 cursor-pointer hover:bg-slate-700"
        >
          <div>Headcount </div>
        </div>
        <div
          className="flex flex-col items-center justify-center px-2 py-2 cursor-pointer hover:bg-slate-700"
          onClick={() => onSort('BaseAnnualSalary')}
        >
          <div>Salary{getSortIndicator('BaseAnnualSalary')}</div>
        </div>
        <div
          className="flex flex-col items-center justify-center px-2 py-2 cursor-pointer hover:bg-slate-700"
          onClick={() => onSort('Bonus')}
        >
          <div>Bonus{getSortIndicator('Bonus')}</div>
        </div>
        <div
          className="flex flex-col items-center justify-center px-2 py-2 cursor-pointer hover:bg-slate-700"
          onClick={() => onSort('BonusPct')}
        >
          <div>Bonus %{getSortIndicator('BonusPct')}</div>
        </div>
        <div
          className="flex flex-col items-center justify-center px-2 py-2 cursor-pointer hover:bg-slate-700"
          onClick={() => onSort('EESRE')}
        >
          <div>EE SRE{getSortIndicator('EESRE')}</div>
        </div>
        <div
          className="flex flex-col items-center justify-center px-2 py-2 cursor-pointer hover:bg-slate-700"
          onClick={() => onSort('ShareAdmin')}
        >
          <div>Share Admin{getSortIndicator('ShareAdmin')}</div>
        </div>
        <div
          className="flex flex-col items-center justify-center px-2 py-2 cursor-pointer hover:bg-slate-700"
          onClick={() => onSort('AnnualAdmin')}
        >
          <div>Annual Admin{getSortIndicator('AnnualAdmin')}</div>
        </div>
        <div
          className="flex flex-col items-center justify-center px-2 py-2 cursor-pointer hover:bg-slate-700"
          onClick={() => onSort('AnnualProperty')}
        >
          <div>Annual Property{getSortIndicator('AnnualProperty')}</div>
        </div>
        <div
          className="flex flex-col items-center justify-center px-2 py-2 cursor-pointer hover:bg-slate-700"
          onClick={() => onSort('TotalCost')}
        >
          <div>Total Cost{getSortIndicator('TotalCost')}</div>
        </div>
      </div>
    </div>
  );
}