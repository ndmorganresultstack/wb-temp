import React from 'react';
import { InternalLaborCost } from '@/lib/types';
import { BriefcaseIcon, CogIcon, UsersIcon } from '@heroicons/react/24/outline';
import { PencilIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';

// Fetch business titles from API
export async function getBusinessTitles() {
  const res = await fetch('/api/businessTitles');
  if (!res.ok) {
    throw new Error('Failed to fetch business titles');
  }
  return res.json();
}
export async function getFunction() {
  const res = await fetch('/api/functions');
  if (!res.ok) {
    throw new Error('Failed to fetch business titles');
  }
  return res.json();
}
export async function getRole() {
  const res = await fetch('/api/roles');
  if (!res.ok) {
    throw new Error('Failed to fetch business titles');
  }
  return res.json();
}

interface InternalLaborSideBarProps {
  selectedEmployee: InternalLaborCost;
  onClose: () => void;
  onUpdate: () => void;
}

export default function InternalLaborSideBar({ selectedEmployee, onClose, onUpdate }: InternalLaborSideBarProps) {
  const [editingFields, setEditingFields] = useState<{ [key: string]: boolean }>({});
  const [unsavedChanges, setUnsavedChanges] = useState<{ [key: string]: string }>({});
  const [employeeData, setEmployeeData] = useState<InternalLaborCost | null>(null);

  useEffect(() => {
    if (selectedEmployee) {
      setEmployeeData(selectedEmployee);
      setEditingFields({});
      setUnsavedChanges({});
    }
  }, [selectedEmployee]);

  const handleFieldClick = (field: string) => {
    setEditingFields((prev) => ({ ...prev, [field]: true }));
  };

  const handleInputChange = (field: string, value: string) => {
    setUnsavedChanges((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveClick = async (field: string) => {
    if (!employeeData) return;
    
    const value = unsavedChanges[field] || '';
    const updatedData = { ...employeeData };

    // Update based on field
    switch (field) {
      case 'BusinessTitle':
        // Assume we update BusinessTitleId or something similar
        break;
      // Add cases for other fields as needed
    }

    try {
      const response = await fetch('/api/internalLaborCosts', { // Assume endpoint
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updatedData }),
      });

      if (!response.ok) {
        throw new Error('Failed to save changes');
      }
      setEmployeeData(updatedData);
      setEditingFields((prev) => ({ ...prev, [field]: false }));
      setUnsavedChanges((prev) => {
        const newUnsaved = { ...prev };
        delete newUnsaved[field];
        return newUnsaved;
      });
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };

  const handleSaveAll = async () => {
    for (const field of Object.keys(unsavedChanges)) {
      await handleSaveClick(field);
    }
    onUpdate();
  };

  const handleClose = () => {
    if (Object.values(editingFields).some((v) => v) || Object.keys(unsavedChanges).length > 0) {
      handleSaveAll();
    }
    onClose();
  };

  if (!employeeData) return null;

  const getFullName = () => `${employeeData.Employees?.LastName}, ${employeeData.Employees?.FirstName}`;

  const getStatusColor = () => {
    switch (employeeData.Employees?.EmployeeStatus) {
      case 'Terminated':
        return 'bg-red-500';
      case 'Active':
        return 'bg-green-500';
      case 'Vacant':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const hasUnsavedChanges = Object.keys(unsavedChanges).length > 0;

  return (
    <div className="w-120 bg-white rounded-lg shadow-2xl p-6 overflow-y-auto max-h-screen min-h-screen max-lg:w-full absolute top-0 right-0 z-50 flex flex-col">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4 pb-2">
        <h2 className="text-lg font-semibold text-gray-800">
          {getFullName()}: Financial Breakdown
        </h2>
        <button
          onClick={handleClose}
          className="text-black px-1 py-1 rounded-md hover:bg-gray-200 max-w-10 cursor-pointer"
        >
          X
        </button>
      </div>

      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-800">{employeeData.Employees?.FirstName} {employeeData.Employees?.LastName}</h1>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>ID: {employeeData.EE_NO}</span>
          <span className={`${getStatusColor()} text-white text-xs font-medium px-2 py-1 rounded-full`}>{employeeData.Employees?.EmployeeStatus}</span>
        </div>
      </div>

      {/* Scrollable Content Section */}
      <div className="flex-1 overflow-y-auto space-y-4">
        <div className="flex items-center gap-3 h-3">
          <div className="flex-shrink-0 w-5 h-5 text-gray-400">
            <BriefcaseIcon className="w-5 h-5" />
          </div>
          <div className="relative flex items-center flex-1">
            <div className="text-sm font-medium text-gray-700 mr-2 min-w-30">Business Title</div>
              <div
                onClick={() => handleFieldClick('BusinessTitle')}
                className=" rounded-md px-3 py-2 text-sm text-gray-600 flex-1 cursor-pointer"
              >
                {employeeData.Employees?.BusinessTitles?.TitleName || 'N/A'}
              </div>
          </div>
        </div>
        <div className="flex items-center gap-3 h-3">
          <div className="flex-shrink-0 w-5 h-5 text-gray-400">
            <CogIcon className="w-5 h-5" />
          </div>
          <div className="relative flex items-center flex-1">
            <div className="text-sm font-medium text-gray-700 mr-2 min-w-30">Function</div>
            <div
                onClick={() => handleFieldClick('Function')}
                className=" rounded-md px-3 py-2 text-sm text-gray-600 flex-1 cursor-pointer"
              >
                {employeeData.Employees?.FunctionCategories?.CategoryName || 'N/A'}
              </div>
          </div>
        </div>
        <div className="flex items-center gap-3 h-3">
          <div className="flex-shrink-0 w-5 h-5 text-gray-400">
            <UsersIcon className="w-5 h-5" />
          </div>
          <div className="relative flex items-center flex-1">
            <div className="text-sm font-medium text-gray-700 mr-2 min-w-30">Role/Responsibility</div>
           
              <div
                onClick={() => handleFieldClick('RoleResponsibility')}
                className=" rounded-md px-3 py-2 text-sm text-gray-600 flex-1 cursor-pointer"
              >
                {employeeData.Employees?.RoleResponsibilities?.RoleName || 'N/A'}
              </div>
            
          </div>
        </div>
        <div className="flex items-center gap-3 h-3">
          <div className="flex-shrink-0 w-5 h-5 text-gray-400">
            <UsersIcon className="w-5 h-5" />
          </div>
          <div className="relative flex items-center flex-1">
            <div className="text-sm font-medium text-gray-700 mr-2 min-w-30">Headcount</div>
           
              <div
                onClick={() => handleFieldClick('Headcount')}
                className=" rounded-md px-3 py-2 text-sm text-gray-600 flex-1 cursor-pointer"
              >
                {employeeData.Employees?.Headcount || 'N/A'}
              </div>
            
          </div>
        </div>
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-semibold text-gray-800 mb-2">Salary Increase</h4>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>3.0% CALC INC</span>
              <span className="font-medium">{employeeData.BaseAnnualSalary.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>04-01-26 $ ANNUAL</span>
              <span className="font-medium">{employeeData.BaseAnnualSalary.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>12-31-25 $ ANNUAL</span>
              <span className="font-medium">{employeeData.BaseAnnualSalary.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>04-01-26 $ ANNUAL</span>
              <span className="font-medium">{employeeData.MonthlySalary.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>12-31-25 $ ANNUAL</span>
              <span className="font-medium">{employeeData.MonthlySalary.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Total</span>
              <span className="font-medium">{employeeData.TotalCost.toLocaleString()}</span>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-semibold text-gray-800 mb-2">Bonus Breakdown</h4>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>FY 2025 $ ANNUAL</span>
              <span className="font-medium">{employeeData.Bonus.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>PCT</span>
              <span className="ont-medium">{employeeData.BonusPct*100}%</span>
            </div>
            <div className="flex justify-between">
              <span>FY 2025 $ ANNUAL</span>
              <span className="font-medium">{(employeeData.Bonus * employeeData.BonusPct / 100).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>YoY $ CHG</span>
              <span className="font-medium">{(employeeData.Bonus - (employeeData.Bonus * employeeData.BonusPct / 100)).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Total</span>
              <span className="font-medium">{employeeData.Bonus.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-2 mt-6">
        {hasUnsavedChanges && (
          <button className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700" onClick={handleSaveAll}>
            Save
          </button>
        )}
        <button className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">
          Edit Profile
        </button>
        
      </div>
    </div>
  );
}