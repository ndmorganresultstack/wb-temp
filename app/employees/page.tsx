'use client';

import { useEffect, useState } from 'react';
import EmployeeRosterHeader from '@/components/employees/EmployeeRosterHeader';
import EmployeeStats from '@/components/employees/EmployeeStats';
import EmployeeTableHeader from '@/components/employees/EmployeeTableHeader';
import EmployeeRow from '@/components/employees/EmployeeRow';
import EmployeeSideBar from '@/components/employees/EmployeeSideBar';
import Pagination from  '@/components/pagination';
import { EmployeeWithRelations } from '@/lib/types';

export default function EmployeeRoster() {
  const [employees, setEmployees] = useState<EmployeeWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeWithRelations | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1); 
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [sortColumn, setSortColumn] = useState<keyof EmployeeWithRelations | 'BusinessTitle' | ''>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const fetchEmployees = async () => {
      try {
        const res = await fetch('/api/employees');
        if (res.ok) {
          const data = await res.json();
          setEmployees(data);
        } else {
          console.error('Failed to fetch employees');
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
      } finally {
        setLoading(false);
      }
  }


  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when search query or items per page changes
  }, [searchQuery, itemsPerPage]);

  // Filter employees based on search query
  const filteredEmployees = employees.filter(employee => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      employee.FirstName?.toLowerCase().includes(query) ||
      employee.LastName?.toLowerCase().includes(query) ||
      employee.EE_NO?.toLowerCase().includes(query) ||
      employee.BusinessTitles?.TitleName?.toLowerCase().includes(query) ||
      employee.PersonalEmail?.toLowerCase().includes(query)
    );
  });

  // Sorting logic
  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    if (!sortColumn) return 0;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let valueA: any, valueB: any;
    if (sortColumn === 'BusinessTitle') {
      valueA = a.BusinessTitles?.TitleName || '';
      valueB = b.BusinessTitles?.TitleName || '';
    } else {
      valueA = a[sortColumn] || '';
      valueB = b[sortColumn] || '';
    }

    // Handle dates
    if (sortColumn === 'HireDate' || sortColumn === 'TermDate') {
      valueA = valueA ? new Date(valueA).getTime() : 0;
      valueB = valueB ? new Date(valueB).getTime() : 0;
    }

    // Handle numbers (TOS, EE_NO)
    if (sortColumn === 'TOS' || sortColumn === 'EE_NO') {
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
  const handleSort = (column: keyof EmployeeWithRelations | 'BusinessTitle') => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
    setCurrentPage(1); // Reset to first page on sort
  };

  // Stats calculation
  const totalEmployees = employees.length;
  const active = employees.filter(e => e.EmployeeStatus === 'Active').length;
  const terminated = employees.filter(e => e.EmployeeStatus === 'Terminated').length;
  const vacant = employees.filter(e => e.EmployeeStatus === 'Vacant').length;
  const averageTOS = employees.reduce((sum, e) => sum + (e.TOS ? Number(e.TOS.toString()) : 0), 0) / totalEmployees || 0;

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
        <EmployeeRosterHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <EmployeeStats
          totalEmployees={totalEmployees}
          active={active}
          terminated={terminated}
          vacant={vacant}
          averageTOS={averageTOS}
        />

        <EmployeeTableHeader
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
        />

        <div className="bg-white z-10 flex -mt-1 flex-col items-stretch font-inter justify-center max-lg:max-w-full py-1">
          {currentEmployees.map((employee, index) => (
            <EmployeeRow
              key={employee.EE_NO}
              employee={employee}
              isSelected={selectedEmployee?.EE_NO === employee.EE_NO}
              onSelect={() => setSelectedEmployee(employee)}
              isAlternate={index % 2 === 0}
            />
          ))}
        </div>
        
        <div className="flex justify-between items-center mt-4 pb-4 px-4">
          <div className="flex items-center space-x-4">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(sortedEmployees.length / itemsPerPage)}
              onPageChange={setCurrentPage}
            />
            <div className="flex items-center">
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
        <EmployeeSideBar onUpdate={fetchEmployees} selectedEmployee={selectedEmployee} onClose={() => setSelectedEmployee(null)} />
      )}
    </div>
  );
}