'use client';

import { useEffect, useState } from 'react';
import { Employees, BusinessTitles } from '@/app/generated/prisma';

interface EmployeeWithRelations extends Employees {
  BusinessTitles?: BusinessTitles;
}
import InternalLaborCostHeader from '@/components/laborcostinternal/InternalLaborCostHeader';
import InternalLaborStats from '@/components/laborcostinternal/InternalLaborStats';
import InternalLaborRow from '@/components/laborcostinternal/InternalLaborRow';
import InternalLaborSideBar from '@/components/laborcostinternal/InternalLaborSideBar'; 

export default function InternalLaborPage() {
  const [laborCostData, setLaborCostData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeWithRelations | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchLaborCostData() {
      try {
        const res = await fetch('/api/internalLaborCost');
        if (res.ok) {
          const data = await res.json();
          setLaborCostData(data);
        } else {
          console.error('Failed to fetch labor cost data');
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchLaborCostData();
  }, []);

  // Filter employees based on search query
  const filteredEmployees = laborCostData.filter(employee => {
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

  // Stats calculation
  const totalEmployees = employees.length;
  const active = employees.filter(e => e.EmployeeStatus === 'Active').length;
  const terminated = employees.filter(e => e.EmployeeStatus === 'Terminated').length;
  const vacant = employees.filter(e => e.EmployeeStatus === 'Vacant').length;
  const averageTOS = employees.reduce((sum, e) => sum + (e.TOS ? Number(e.TOS.toString()) : 0), 0) / totalEmployees || 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-4 min-h-screen bg-gray-50 flex gap-4 max-lg:flex-col">
       <div className={`bg-white rounded-lg shadow-sm overflow-x-auto ${selectedEmployee ? 'flex-1' : 'w-full'}`}> {/* Flex-1 when sidebar is visible */}
      
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

        <EmployeeTableHeader />

        <div className="bg-white z-10 flex -mt-1 flex-col items-stretch font-inter justify-center max-lg:max-w-full py-1">
          {filteredEmployees.map((employee, index) => (
            <EmployeeRow
              key={employee.EE_NO}
              employee={employee}
              isSelected={selectedEmployee?.EE_NO === employee.EE_NO}
              onSelect={() => setSelectedEmployee(employee)}
              isAlternate={index % 2 === 0}
            />
          ))}
        </div>
      </div> 
      {selectedEmployee && (
        <EmployeeSideBar selectedEmployee={selectedEmployee} onClose={() => setSelectedEmployee(null)} />
      )}
    </div>
  );
}
