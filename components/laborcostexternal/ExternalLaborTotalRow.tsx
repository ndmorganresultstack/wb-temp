import React from 'react';
import { ExternalTotalsRow } from '@/lib/helper';

interface ExternalLaborTotalRowProps {
  totals: ExternalTotalsRow;
  isSelected: boolean;
  onSelect: () => void;
  isAlternate?: boolean;
}

export default function ExternalLaborTotalRow({ totals, onSelect, isAlternate = false }: ExternalLaborTotalRowProps) {
   
  const backgroundClass = isAlternate ? "bg-purple-50" : "bg-white";

  return (
    <div className="w-full max-w-full max-lg:max-w-full border-t border-gray-200">
      <div
        className={`external-labor-grid px-2 py-2 ${backgroundClass} z-10 -mb-1 cursor-pointer hover:bg-gray-50`} // Replaced flex classes with internal-labor-grid; kept px-5 py-2 for row padding
        onClick={onSelect}
      >
        <div>Totals:</div>
        <div></div>
        <div></div>
        <div className="text-right pr-10">{Number(totals.Hours).toLocaleString()}</div>
        <div className="text-right pr-4">${Number(totals.Rate).toLocaleString()}</div>
        <div className="text-right pr-4">${Number(totals.TotalCost).toLocaleString()}</div> 
        <div className="text-right pr-6"></div>
        <div className="text-right pr-6">${Number(totals.AnnualAdmin).toLocaleString()}</div>
        <div className="text-right pr-8">${Number(totals.AnnualProperty).toLocaleString()}</div> 
      </div>
    </div>
  );
}
 