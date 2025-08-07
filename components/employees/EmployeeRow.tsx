import React from 'react';
import { Employees,BusinessTitles } from '@/app/generated/prisma'; '@/prisma/client'; // Adjust the import path as necessary

interface EmployeeRowProps {
  employee: EmployeeWithRelations;
  isSelected: boolean;
  onSelect: () => void;
  isAlternate?: boolean;
}

interface EmployeeWithRelations extends Employees {
  BusinessTitles?: BusinessTitles;
}

export default function EmployeeRow({ employee, isSelected, onSelect, isAlternate = false }: EmployeeRowProps) {
  const formatDate = (date: Date | null | undefined) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\//g, '-');
  };

 const getStatusBadge = (status: string | null | undefined) => {
    switch (status) {
      case 'Active':
        return (
          <div className="bg-green-600 rounded-full flex flex-col items-start text-xs text-white leading-2 justify-center max-lg:whitespace-normal p-1 px-2 max-w-6">
            <div>A</div>
          </div>
        );
      case 'Terminated':
        return (
          <div className="bg-red-600 rounded-full flex flex-col items-start text-xs text-white leading-2 justify-center max-lg:whitespace-normal p-1 px-2 max-w-6">
            <div>T</div>
          </div>
        );
      case 'Vacant':
        return (
          <div className="bg-yellow-600 rounded-full flex flex-col items-start text-xs text-white leading-2 justify-center max-lg:whitespace-normal p-1 px-2 max-w-6">
            <div>V</div>
          </div>
        );

    }
  };

  const backgroundClass = isAlternate ? "bg-purple-50" : "bg-white";

  return (
    <div className="w-full max-w-full max-lg:max-w-full">
      <div
        className={`employee-grid px-2 py-2 ${backgroundClass} z-10 -mb-1 cursor-pointer hover:bg-gray-50`} // Replaced flex classes with employee-grid; kept px-5 py-2 for row padding
        onClick={onSelect}
      > 
        {/* Status */}
        {getStatusBadge(employee.EmployeeStatus)}
        {/* EE_NO */}
        <div>{employee.EE_NO}</div>
        {/* LastName */}
        <div className="truncate">{employee.LastName}</div> {/* Added truncate for consistency */}
        {/* FirstName */}
        <div>{employee.FirstName}</div>
        {/* Business Title */}
        <div className="truncate">{employee.BusinessTitles?.TitleName}</div>
        {/* HireDate */}
        <div className="truncate">{formatDate(employee.HireDate)}</div>
        {/* TOS */}
        <div className="truncate">{employee.TOS?.toString() }</div>
        {/* TermDate */}
        <div>{formatDate(employee.TermDate)}</div>
       
      </div>
    </div>
  );
}
 