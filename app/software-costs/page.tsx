'use client';

import DynamicTable from '@/components/DynamicTable';
import '../../app/globals.css';
import { useSidebar } from '../sidebarContext';

export default function EmployeesPage() {

const {isSidebarOpen} = useSidebar();

  return ( 
  <div 
        className={`grid-page-container ${
          isSidebarOpen
            ? 'w-[calc(100%-300px)]'
            : 'w-[calc(100%-80px)]'
        }`} >
      <div className="grid-page-header">
         SOFTWARE COSTS
      </div>
      <div className="grid-toolbar-row  flex justify-between items-center">
        <div></div>
      </div>
      <div className="grid-container">
        <DynamicTable model="SoftwareCosts" />
      </div>
    </div>   
  );
}