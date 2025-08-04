import React from 'react';

export default function EmployeeTableHeader() {
  return (
    <div className="bg-gray-50 w-full pr-4 max-lg:max-w-full"> {/* Removed flex, gap-8, flex-wrap, items-stretch */}
      <div className="employee-grid bg-slate-800 text-white font-medium text-xs leading-5 font-inter">
        
        {/* Status */}
        <div className="flex flex-col items-stretch justify-center px-3 py-2">
          <div>Status</div>
        </div>
        {/* Emp Number */}
        <div className="flex flex-col items-start justify-center px-2 py-2">
          <div>Emp Number</div>
        </div>
        {/* Last */}
        <div className="flex flex-col items-start justify-center px-2 py-2">
          <div>Last</div>
        </div>
        {/* First */}
        <div className="flex flex-col items-start justify-center px-2 py-2">
          <div>First</div>
        </div>
        {/* Business Title */}
        <div className="flex flex-col items-stretch justify-center px-2 py-2">
          <div>Business Title</div>
        </div>
        {/* Hire Date */}
        <div className="flex flex-col items-stretch justify-center px-2 py-2">
          <div>Hire Date</div>
        </div>
        {/* TOS */}
        <div className="flex flex-col items-stretch justify-center px-2 py-2">
          <div>TOS</div>
        </div>
        {/* Term Date */}
        <div className="flex flex-col items-stretch justify-center px-2 py-2">
          <div>Term Date</div>
        </div>
      </div>
    </div>
  );
}