'use client';

import { useEffect, useState, memo } from 'react';
import { Employees, BusinessTitles, ServiceAccounts } from '@/app/generated/prisma';
import { InternalLaborCost, TotalsRow } from '@/lib/types';
import InternalLaborCostHeader from '@/components/laborcostinternal/InternalLaborCostHeader'; 
import InternalLaborRow from '@/components/laborcostinternal/InternalLaborRow';
import InternalLaborSideBar from '@/components/laborcostinternal/InternalLaborSideBar'; 
import InternalLaborTableHeader from '@/components/laborcostinternal/InternalLaborCostTableHeader'; 
import InternalLaborTotalRow from '@/components/laborcostinternal/InternalLaborTotalRow';
import Pagination from  '@/components/pagination';

export default function InternalLaborPage() {
  const [laborCostData, setLaborCostData] = useState<InternalLaborCost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState<InternalLaborCost | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1); 
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [totals, setTotals] = useState<TotalsRow>({} as TotalsRow);
  const [sortColumn, setSortColumn] = useState<keyof InternalLaborCost | 'EmployeeStatus' | 'LastName' | 'FirstName' | 'BusinessTitle' | 'FunctionCategory' | 'RoleName' | undefined>(undefined);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    const fetchLaborCostData = async () => {
      try {
        const res = await fetch('/api/internalLaborCost');
        if (res.ok) {
          const {laborCostData, totals}:{laborCostData: InternalLaborCost[], totals: TotalsRow} = await res.json();
          setLaborCostData(laborCostData);
          setTotals(totals);
        } else {
          console.error('Failed to fetch labor cost data');
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
      } finally {
        setLoading(false);
      }
    }

  useEffect(() => {
    fetchLaborCostData();
  }, []);

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when search query, items per page, or sort changes
  }, [searchQuery, itemsPerPage, sortColumn, sortDirection]);

  // Filter employees based on search query
  const filteredEmployees = laborCostData.filter(employee => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      employee.Employees?.FirstName?.toLowerCase().includes(query) ||
      employee.Employees?.LastName?.toLowerCase().includes(query) ||
      employee.Employees?.EE_NO?.toLowerCase().includes(query) ||
      employee.Employees?.BusinessTitles?.TitleName?.toLowerCase().includes(query) ||
      employee.Employees?.PersonalEmail?.toLowerCase().includes(query)
    );
  });

  // Sorting logic
  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    if (!sortColumn) return 0;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let valueA: any, valueB: any;
    switch (sortColumn) {
      case 'EmployeeStatus':
        valueA = a.Employees?.EmployeeStatus || '';
        valueB = b.Employees?.EmployeeStatus || '';
        break;
      case 'LastName':
        valueA = a.Employees?.LastName || '';
        valueB = b.Employees?.LastName || '';
        break;
      case 'FirstName':
        valueA = a.Employees?.FirstName || '';
        valueB = b.Employees?.FirstName || '';
        break;
      case 'BusinessTitle':
        valueA = a.Employees?.BusinessTitles?.TitleName || '';
        valueB = b.Employees?.BusinessTitles?.TitleName || '';
        break;
      case 'FunctionCategory':
        valueA = a.Employees?.FunctionCategories?.CategoryName || '';
        valueB = b.Employees?.FunctionCategories?.CategoryName || '';
        break;
      case 'RoleName':
        valueA = a.Employees?.RoleResponsibilities?.RoleName || '';
        valueB = b.Employees?.RoleResponsibilities?.RoleName || '';
        break;
      default:
        valueA = a[sortColumn] || 0;
        valueB = b[sortColumn] || 0;
        break;
    }

    // Handle numbers
    if (['Headcount', 'BaseAnnualSalary', 'Bonus', 'BonusPct', 'EESRE', 'ShareAdmin', 'AnnualAdmin', 'AnnualProperty', 'TotalCost'].includes(sortColumn)) {
      valueA = Number(valueA) || 0;
      valueB = Number(valueB) || 0;
    }

    // Handle strings case-insensitively
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      valueA = valueA.toLowerCase();
      valueB = valueB.toLowerCase();
    }

    if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Handle sort click
  const handleSort = (column: keyof InternalLaborCost | 'EmployeeStatus' | 'LastName' | 'FirstName' | 'BusinessTitle' | 'FunctionCategory' | 'RoleName') => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
    setCurrentPage(1); // Reset to first page on sort
  };

  // Calculate current employees for the page
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentEmployees = sortedEmployees.slice(indexOfFirst, indexOfLast);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-4 max-h-screen bg-gray-50 flex gap-4 max-lg:flex-col">
       <div className={`bg-white rounded-lg shadow-sm overflow-x-auto ${selectedEmployee ? 'flex-1' : 'w-full'}`}>
      
        <InternalLaborCostHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <InternalLaborTableHeader
          sortColumn={sortColumn ?? ""}
          sortDirection={sortDirection}
          onSort={handleSort}
        />

        <div className="bg-white z-10 flex -mt-1 flex-col items-stretch font-inter justify-center max-lg:max-w-full py-1">
          {currentEmployees.map((employee, index) => (
            <InternalLaborRow
              key={employee.EE_NO}
              internalLabor={employee}
              isSelected={selectedEmployee?.EE_NO === employee.EE_NO}
              onSelect={() => setSelectedEmployee(employee)}
              isAlternate={index % 2 === 0}
            />
          ))}
          <InternalLaborTotalRow
            totals={totals}
            isSelected={false}
            onSelect={() => {}}
            isAlternate={false}
          />
        </div>          

        <div className="flex justify-between items-center mt-4 pb-4 px-4">
          <div className="flex items-center space-x-4">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(sortedEmployees.length / itemsPerPage)}
            onPageChange={setCurrentPage}
          />
          <div>
            <span className="text-sm text-gray-600 px-2">Items per page:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="px-2 py-1 border border-gray-300 rounded-md"
            >
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={100}>100</option>
            </select>
          </div>
          </div>
        </div>
      </div> 
      {selectedEmployee && (
        <InternalLaborSideBar selectedEmployee={selectedEmployee} onClose={() => setSelectedEmployee(null)} onUpdate={fetchLaborCostData}/>
      )}
    </div>
  );
}