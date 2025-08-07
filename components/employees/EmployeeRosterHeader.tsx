import React from 'react';
import SearchIcon from '../icons/SearchIcon';
import FilterIcon from '../icons/FilterIcon';
import ColumnsIcon from '../icons/ColumnsIcon';

interface EmployeeRosterHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function EmployeeRosterHeader({ searchQuery, onSearchChange }: EmployeeRosterHeaderProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="flex w-full items-stretch gap-5 font-inter flex-wrap justify-between px-4 py-4 lg:px-14 lg:pr-14 lg:pl-4 lg:py-4 max-lg:max-w-full max-lg:pr-5">
        <div className="text-gray-800 text-17 font-bold leading-8 my-auto">
          Employees
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-600 justify-start flex-wrap max-lg:max-w-full">
          <div className="self-stretch flex pr-11 items-stretch text-base text-gray-300 w-56 my-auto">
            <div className="relative flex bg-white rounded-md min-h-[42px] items-center justify-start border border-gray-200 px-8 py-2 max-lg:pl-5">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search ..."
                className="self-stretch my-auto bg-transparent border-none outline-none text-gray-400 placeholder-gray-300 w-full"
              />
              <SearchIcon className="absolute right-4 w-5 h-5 text-gray-300" />
            </div>
          </div>
          <button className="bg-gray-100 rounded-md self-stretch flex items-stretch gap-4 text-center leading-8 w-32 my-auto px-3 py-3">
            <FilterIcon className="w-4 flex-shrink-0" />
            <div className="my-auto">Filters</div>
          </button>
          <div className="self-stretch flex flex-col items-stretch text-center leading-8 justify-center w-41 my-auto py-0.5">
            <button className="bg-gray-100 rounded-md flex items-stretch gap-4 px-3 py-3">
              <ColumnsIcon className="w-4  flex-shrink-0" />
              <div className="flex-grow flex-shrink w-26">Column Options</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
