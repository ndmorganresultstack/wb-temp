 'use client';

import InternalLaborCalculatedGrid from '@/components/InternalLaborCalculatedGrid';
import InternalLaborPlanGrid from '@/components/InternalLaborPlanGrid';
import { useRef, useState } from 'react';
import { useSidebar } from '../sidebarContext';

export default function InternalLaborPage() {

  const [viewType,setViewType] = useState("CALCULATED");
  const gridRef = useRef<any>(null)
  const {isSidebarOpen} = useSidebar();

  return (

    // Component file
   <div 
        className={`grid-page-container ${
          isSidebarOpen
            ? 'w-[calc(100%-275px)]'
            : 'w-[calc(100%-55px)]'
        }`} >
      <div className="grid-page-header">
        <span> Costs /</span><span className='font-bold'> External Labor ({viewType.toUpperCase()})</span>  
      </div>
     <div className="grid-toolbar-row flex justify-between items-center">
        <div className=" flex items-center justify-end">

      {viewType == "CALCULATED" && (     
          <button
            className="bg-[#0076CC] text-white px-2 rounded hover:bg-blue-600"
            aria-description="add new record" onClick={() => gridRef?.current?.AddNewRow()}
          >
            +
          </button>
      )}


        </div>
        <div className="flex items-center justify-end">
          <div className="bg-gray-200 rounded-lg p-2 flex gap-2">
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                viewType === 'PLAN' ? 'bg-white text-gray-900' : 'bg-gray-200 text-gray-900'
              }`}
              onClick={() => setViewType('PLAN')}
            >
              Plan
            </button>
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                viewType === 'CALCULATED' ? 'bg-white text-gray-900' : 'bg-gray-200 text-gray-900'
              }`}
              onClick={() => setViewType('CALCULATED')}
            >
              Calculations
            </button>
          </div>
        </div>
      </div>
      <div className="grid-container" style={{height:'calc(100% - 90px)', width:'calc(100%)' }}>
      {viewType == "CALCULATED" ? (      
        <InternalLaborCalculatedGrid ref={gridRef} />
      ) :
      (   
        <InternalLaborPlanGrid />
      )}
      </div>
    </div>


 
    
  );
}