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
            ? 'w-[calc(100%-275px)]'
            : 'w-[calc(100%-55px)]'
        }`} >
      <div className="grid-page-header">
        <span> Costs /</span><span className='font-bold'> Software Costs</span> 
      </div>
      <div className="grid-container" style={{height:'calc(100% - 30px)', width:'calc(100%)' }}>
        <DynamicTable model="SoftwareCosts" />
      </div>
    </div>   
  );
}