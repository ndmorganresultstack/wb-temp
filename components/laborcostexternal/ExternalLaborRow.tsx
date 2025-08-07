import React from 'react'; 
import { ExternalLaborCost } from '@/lib/types';

interface ExternalLaborRowProps {
  ExternalLabor: ExternalLaborCost;
  isSelected: boolean;
  onSelect: () => void;
  isAlternate?: boolean;
}

export default function ExternalLaborRow({ ExternalLabor, onSelect, isAlternate = false }: ExternalLaborRowProps) {
  

 

  const backgroundClass = isAlternate ? "bg-purple-50" : "bg-white";
  
  return (
    <div className="w-full max-w-full max-lg:max-w-full">
      <div
        className={`external-labor-grid px-2 py-2 ${backgroundClass} z-10 -mb-1 cursor-pointer hover:bg-gray-50`} // Replaced flex classes with internal-labor-grid; kept px-5 py-2 for row padding
        onClick={onSelect}
      >         
        <div className="text-center">{ExternalLabor.VendorNO}</div>
        <div className="text-center">{ExternalLabor.Vendor}</div> {/* Added truncate for consistency */}
        <div className="text-center">{ExternalLabor.Purpose}</div>
        <div className="text-right pr-6">{Number(ExternalLabor.Hours)}</div>
        <div className="text-right pr-6">${Number(ExternalLabor.Rate)}</div>
        <div className="text-right pr-5">${Number(ExternalLabor.TotalCost).toLocaleString()}</div>
        <div className="text-right pr-6">{Number(ExternalLabor.ShareAdmin) * 100}%</div>
        <div className="text-right pr-6">${Number(ExternalLabor.AnnualAdmin).toLocaleString()}</div>
        <div className="text-right pr-8">${Number(ExternalLabor.AnnualProperty).toLocaleString()}</div>
        <div className="text-right pr-8">{new Date(ExternalLabor.StartDate).toLocaleDateString()}</div>
        <div className="text-right pr-8">{new Date(ExternalLabor.FinishDate).toLocaleDateString()}</div>
      </div>
    
    </div>
  );
}
 