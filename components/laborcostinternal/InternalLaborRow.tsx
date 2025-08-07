import React from 'react'; 
import { InternalLaborCost } from '@/lib/types';

interface InternalLaborRowProps {
  internalLabor: InternalLaborCost;
  isSelected: boolean;
  onSelect: () => void;
  isAlternate?: boolean;
}

export default function InternalLaborRow({ internalLabor, onSelect, isAlternate = false }: InternalLaborRowProps) {
  

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
        {getStatusBadge(internalLabor.Employees?.EmployeeStatus)}
        <div>{internalLabor.Employees?.EE_NO}</div>
        <div className="truncate">{internalLabor.Employees?.LastName}</div> {/* Added truncate for consistency */}
        <div>{internalLabor.Employees?.FirstName}</div>
        <div className="truncate">{internalLabor.Employees?.BusinessTitles?.TitleName}</div>
        <div className="truncate">{internalLabor.Employees?.FunctionCategories?.CategoryName}</div>
        <div className="truncate">{internalLabor.Employees?.RoleResponsibilities?.RoleName}</div>
        <div>{internalLabor.Employees?.Headcount}</div>
        <div className="text-right pr-4">${Number(internalLabor.BaseAnnualSalary).toLocaleString()}</div>
        <div className="text-right pr-4">${Number(internalLabor.Bonus).toLocaleString()}</div>
        <div className="text-right pr-4">{Number(internalLabor.BonusPct) * 100}%</div>
        <div className="text-right pr-4">${Number(internalLabor.EESRE).toLocaleString()}</div>
        <div className="text-right pr-6">{Number(internalLabor.ShareAdmin) * 100}%</div>
        <div className="text-right pr-6">${Number(internalLabor.AnnualAdmin).toLocaleString()}</div>
        <div className="text-right pr-8">${Number(internalLabor.AnnualProperty).toLocaleString()}</div>
        <div className="text-right pr-5">${Number(internalLabor.TotalCost).toLocaleString()}</div>
      </div>
    
    </div>
  );
}
 