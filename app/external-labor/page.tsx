'use client';

import DynamicTable from '@/components/DynamicTable';
import '../../app/globals.css';
import { useSidebar } from '../sidebarContext';

export default function EmployeesPage() {

  const {isSidebarOpen} = useSidebar();

  return (
    // Component file
    <div 
        className={`grid-page-container ${
          isSidebarOpen
            ? 'w-[calc(100%-300px)]'
            : 'w-[calc(100%-80px)]'
        }`} > 
      <div className="grid-page-header">
        <span> Costs /</span><span className='font-bold'> External Labor</span> 
      </div>
      <div className="grid-toolbar-row  flex justify-between items-center">
        <div></div>
      </div>
      <div className="grid-container">
        <DynamicTable model="ExternalLabor" />
      </div>
    </div>   
  );
}