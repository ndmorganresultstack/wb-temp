'use client';

import DynamicTable from '@/components/DynamicTable';
import '../../app/globals.css';
import { useSidebar } from '@/app/sidebarContext';
import { useEffect } from 'react';

export default function EmployeesPage() {
  const {isSidebarOpen,sidebarMaxWidth,sidebarMinWidth, setPageTitle, pageTitle} = useSidebar();
 
  useEffect(()=>{
    if(pageTitle !== "Employee Roster"){
        setPageTitle("Employee Roster");
    }
    

  },[])
  

  console.log(sidebarMaxWidth,sidebarMinWidth)
  return (
   <div className={`grid-page-container ${
          isSidebarOpen
            ? `w-[calc(100%-${sidebarMaxWidth})]`
            : `w-[calc(100%-${sidebarMinWidth})]`
        }`} >
      <div className="grid-page-header">
        <span className='grid-page-header-path'> Employees /</span><span className='grid-page-header-page'> Employee Roster</span> 
      </div> 
      <div className="grid-container" style={{height:'calc(100%)', width:'calc(100%)' }}>
        <DynamicTable model="Employees" readOnly={false} />
      </div>
    </div>   
  );
}