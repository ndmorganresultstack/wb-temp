 'use client';

import InternalLaborCalculatedGrid from '@/components/InternalLaborCalculatedGrid';
import InternalLaborPlanGrid from '@/components/InternalLaborPlanGrid';
import { useState } from 'react';

export default function InternalLaborPage() {

  const [viewType,setViewType] = useState("CALCULATED");




  return (
    <div>
      <div className="ml-4"> 
          <h1>INTERNAL LABOR - {viewType.toUpperCase()}</h1>
        <div className="mb-4 mr-10 flex items-center justify-end">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={viewType === 'PLAN'}
              onChange={(e) => setViewType(e.target.checked ? 'PLAN' : 'CALCULATED')}
            />
            <div className="w-14 h-7 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-7 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all"></div>
            <span className="ml-3 text-sm font-medium text-gray-900">
              {viewType === 'CALCULATED' ? 'CALCULATED' : 'PLAN'}
            </span>
          </label>
        </div>



      </div>
      {viewType == "CALCULATED" ? (      
        <InternalLaborCalculatedGrid />
      ) :
      (   
        <InternalLaborPlanGrid />
      )}
   
    </div>
  );
}