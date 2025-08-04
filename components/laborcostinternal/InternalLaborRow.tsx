import React from 'react';
import { InternalLabor,BusinessTitles } from '@/app/generated/prisma'; '@/prisma/client'; // Adjust the import path as necessary

interface InternalLaborRowProps {
  internalLabor: InternalLabor;
  isSelected: boolean;
  onSelect: () => void;
  isAlternate?: boolean;
}

export default function InternalLaborRow({ internalLabor, isSelected, onSelect, isAlternate = false }: InternalLaborRowProps) {
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
        className={`internal-labor-grid px-2 py-2 ${backgroundClass} z-10 -mb-1 cursor-pointer hover:bg-gray-50`} // Replaced flex classes with internal-labor-grid; kept px-5 py-2 for row padding
        onClick={onSelect}
      > 
        {getStatusBadge(internalLabor.EmployeeStatus)}
        <div>{internalLabor.EE_NO}</div>
        <div className="truncate">{internalLabor.LastName}</div> {/* Added truncate for consistency */}
        <div>{internalLabor.FirstName}</div>
        <div className="truncate">{internalLabor.BusinessTitles?.TitleName}</div>
        <div className="truncate">{formatDate(internalLabor.HireDate)}</div>
        <div className="truncate">{internalLabor.TOS?.toString() }</div>
        <div>{formatDate(internalLabor.TermDate)}</div>
      </div>
    </div>
  );
}
 