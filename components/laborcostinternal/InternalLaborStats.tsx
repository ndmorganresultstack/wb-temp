import React from 'react';

interface InternalLaborStatsProps {
  totalEmployees: number;
  active: number;
  terminated: number;
  vacant: number;
  averageTOS: number;
}

export default function InternalLaborStats({ totalEmployees, active, terminated, vacant, averageTOS }: InternalLaborStatsProps) {
  return (
    <div className="bg-gray-50 z-10 flex items-stretch gap-9 font-inter flex-wrap px-4 py-5 lg:px-20 lg:pr-20 lg:pl-4 lg:py-5 max-lg:pr-5">
      <div className="flex flex-col items-stretch">
        <div className="text-gray-500 text-xs leading-5">
          Total Employees
        </div>
        <div className="text-black text-sm font-medium leading-7 self-start mt-2">
          {totalEmployees}
        </div>
      </div>
      <div className="flex flex-col items-stretch whitespace-nowrap max-lg:whitespace-normal">
        <div className="text-gray-500 text-xs leading-5">
          Active
        </div>
        <div className="text-green-600 text-sm font-medium leading-7 self-start mt-2">
          {active}
        </div>
      </div>
      <div className="flex flex-col items-stretch whitespace-nowrap max-lg:whitespace-normal">
        <div className="text-gray-500 text-xs leading-5">
          Terminated
        </div>
        <div className="text-red-600 text-sm font-medium leading-7 self-start mt-2">
          {terminated}
        </div>
      </div>
      <div className="flex flex-col items-stretch">
        <div className="text-gray-500 text-xs leading-5">
          Vacant Positions
        </div>
        <div className="text-yellow-custom text-sm font-medium leading-7 self-start mt-2">
          {vacant}
        </div>
      </div>
      <div className="flex flex-col items-stretch">
        <div className="text-gray-500 text-xs leading-5">
          Average TOS (years)
        </div>
        <div className="text-black text-sm font-medium leading-7 self-start mt-2">
          {averageTOS.toFixed(1)}
        </div>
      </div>
    </div>
  );
}
