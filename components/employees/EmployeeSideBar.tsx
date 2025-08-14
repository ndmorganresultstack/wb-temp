/* eslint-disable @typescript-eslint/no-explicit-any */
import { BusinessTitles, Employees } from "@/app/generated/prisma";
import { BriefcaseIcon, CalendarIcon, ClockIcon, EnvelopeIcon, MapPinIcon, PhoneIcon, PencilIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import { EmployeeWithRelations } from '@/lib/types';
import { Decimal } from "@prisma/client/runtime/index-browser.js";

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


export default function EmployeeSideBar({ selectedEmployee, onClose, onUpdate }: { selectedEmployee: EmployeeWithRelations, onClose: () => void, onUpdate: () => void }) {
  const [editingFields, setEditingFields] = useState<{ [key: string]: boolean }>({});
  const [unsavedChanges, setUnsavedChanges] = useState<{ [key: string]: string }>({});
  const [businessTitles, setBusinessTitles] = useState<any[]>([]);
  const [businessRoles,setBusinessRoles] = useState<any[]>([]);
  const [businessFunctions,setBusinessFunctions] = useState<any[]>([]);
  const [employeeData, setEmployeeData] = useState<EmployeeWithRelations | null>(null);

  useEffect(() => {
    async function fetchBusinessTitles() {
      const titles = await getBusinessTitles();
      const roles = await getRole();
      const functions = await getFunction();
      setBusinessTitles(titles);
      setBusinessFunctions(functions);
      setBusinessRoles(roles);
    }
    fetchBusinessTitles();
  }, []);

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

    switch (field) {
      case 'FirstName':
        updatedData.FirstName = value;
        break;
      case 'LastName':
        updatedData.LastName = value;
        break;
      case 'EE_NO':
        updatedData.EE_NO = value;
        break;
      case 'EmployeeStatus':
        updatedData.EmployeeStatus = value;
        break;
      case 'BusinessTitleId':
        updatedData.BusinessTitleId = parseInt(value);
        updatedData.BusinessTitles = businessTitles[parseInt(value)];
        break;
      case 'FunctionCategoryId':
        updatedData.FunctionCategoryId = parseInt(value);
        updatedData.FunctionCategories = businessFunctions[parseInt(value)];
        break;
      case 'RoleResponsibilityId':
        updatedData.RoleResponsibilityId = parseInt(value);
        updatedData.RoleResponsibilities = businessRoles[parseInt(value)];
        break;
      case 'HireDate':
        updatedData.HireDate = value ? new Date(value) : null;
        break;
      case 'TermDate':
        updatedData.TermDate = value ? new Date(value) : null;
        break;
      case 'TOS':
        updatedData.TOS = new Decimal(parseInt(value) || 0);
        break;
      case 'Birthday':
        updatedData.Birthday = value ? new Date(value) : null;
        break;
      case 'PersonalEmail':
        updatedData.PersonalEmail = value;
        break;
      case 'HomePhone':
        updatedData.HomePhone = value;
        break;
      case 'HomeAddress':
        updatedData.HomeAddress = value;
        break;
      case 'Apt':
        updatedData.Apt = value;
        break;
      case 'City':
        updatedData.City = value;
        break;
      case 'HomeStateAbbrev':
        updatedData.HomeStateAbbrev = value;
        break;
      case 'Zip':
        updatedData.Zip = value;
        break;
    }

    try {
      const response = await fetch('/api/employees', {
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
      onUpdate();
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

  const getDisplayValue = (field: string) => {
    if (unsavedChanges[field] !== undefined) {
      if (field === 'BusinessTitleId') {
        const id = parseInt(unsavedChanges[field]);
        const title = businessTitles.find((t: any) => t.BusinessTitleId === id);
        return title ? title.TitleName : 'N/A';
      }
      if (field === 'FunctionCategoryId') {
        const id = parseInt(unsavedChanges[field]);
        const title =  businessFunctions.find((t: any) => t.FunctionCategoryId === id);
        return title ? title.CategoryName : 'N/A';
      }
      if (field === 'RoleResponsibilityId') {
        const id = parseInt(unsavedChanges[field]);
        const title = businessRoles.find((t: any) => t.RoleResponsibilityId === id);
        return title ? title.RoleName : 'N/A';
      }
      return unsavedChanges[field];
    }
    switch (field) {
      case 'HireDate':
        return employeeData.HireDate ? new Date(employeeData.HireDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A';
      case 'TermDate':
        return employeeData.TermDate ? new Date(employeeData.TermDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ' -- ';
      case 'Birthday':
        return employeeData.Birthday ? new Date(employeeData.Birthday).toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) : 'N/A';
      case 'TOS':
        return employeeData.TOS ? employeeData.TOS.toString() : '0';
      case 'BusinessTitleId':
        return employeeData.BusinessTitles?.TitleName || 'N/A';
      case 'RoleResponsibilityId':
        return employeeData.RoleResponsibilities?.RoleName || 'N/A';
      case 'FunctionCategoryId':
        return employeeData.FunctionCategories?.CategoryName || 'N/A';
      default:
        return employeeData[field as keyof EmployeeWithRelations] as string || 'N/A';
    }
  };

  const getEditValue = (field: string) => {
    if (unsavedChanges[field] !== undefined) return unsavedChanges[field];
    switch (field) {
      case 'HireDate':
        return employeeData.HireDate ? new Date(employeeData.HireDate).toISOString().split('T')[0] : '';
      case 'TermDate':
        return employeeData.TermDate ? new Date(employeeData.TermDate).toISOString().split('T')[0] : '';
      case 'Birthday':
        return employeeData.Birthday ? new Date(employeeData.Birthday).toISOString().split('T')[0] : '';
      case 'BusinessTitleId':
        console.log(employeeData?.BusinessTitleId)
        return employeeData.BusinessTitleId?.toString() || '';
      case 'RoleResponsibilityId':
        return employeeData.RoleResponsibilityId?.toString() || '';
      case 'FunctionCategoryId':
        return employeeData.FunctionCategoryId?.toString() || '';
      default:
        return getDisplayValue(field);
    }
  };

  const getFullName = () => `${getDisplayValue('FirstName')} ${getDisplayValue('LastName')}`;

  const getStatusColor = () => {
    switch (employeeData.EmployeeStatus) {
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
    <div className="w-120 bg-white rounded-lg shadow-2xl p-6 overflow-y-auto max-h-screen min-h-screen max-lg:w-full absolute top-0 right-0 z-50" dir="ltr">
      <div className="flex justify-between items-center mb-4 pb-2">
        <h2 className="text-lg font-semibold text-gray-800">Employee Profile</h2>
        <button onClick={handleClose} className="text-black px-1 py-1 rounded-md hover:bg-gray-200 max-w-10 cursor-pointer">
          X
        </button>
      </div>
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-800">{getFullName()}</h1>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>ID: {employeeData.EE_NO}</span>
          <span className={`${getStatusColor()} text-white text-xs font-medium px-2 py-1 rounded-full`}>{employeeData.EmployeeStatus}</span>
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-5 h-5 text-gray-400">
            <BriefcaseIcon className="w-5 h-5" />
          </div>
          <div className="relative flex items-center flex-1">
            <div className="text-sm font-medium text-gray-700 mr-2 min-w-24">Position</div>
            {editingFields['BusinessTitleId'] ? (
              <select
                value={getEditValue('BusinessTitleId')}
                onChange={(e) => handleInputChange('BusinessTitleId', e.target.value)}
                onBlur={() => {
                  if (unsavedChanges['BusinessTitleId']) handleSaveClick('BusinessTitleId');
                }}
                autoFocus
                className="bg-gray-100 rounded-md px-3 py-2 text-sm text-gray-600 flex-1 border-b border-gray-300 focus:outline-none"
              >
                {businessTitles.map((title: any) => (
                  <option key={title.BusinessTitleId} value={title.BusinessTitleId}>
                    {title.TitleName}
                  </option>
                ))}
              </select>
            ) : (
              <div
                onClick={() => handleFieldClick('BusinessTitleId')}
                className="bg-gray-100 rounded-md px-3 py-2 text-sm text-gray-600 flex-1 cursor-pointer"
              >
                {getDisplayValue('BusinessTitleId')}
              </div>
            )}
            {!editingFields['BusinessTitleId'] && (
              <PencilIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 cursor-pointer" onClick={() => handleFieldClick('BusinessTitleId')} />
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-5 h-5 text-gray-400">
            <BriefcaseIcon className="w-5 h-5" />
          </div>
          <div className="relative flex items-center flex-1">
            <div className="text-sm font-medium text-gray-700 mr-2 min-w-24">Function</div>
            {editingFields['FunctionCategoryId'] ? (
              <select
                value={getEditValue('FunctionCategoryId')}
                onChange={(e) => handleInputChange('FunctionCategoryId', e.target.value)}
                onBlur={() => {
                  if (unsavedChanges['FunctionCategoryId']) handleSaveClick('FunctionCategoryId');
                }}
                autoFocus
                className="bg-gray-100 rounded-md px-3 py-2 text-sm text-gray-600 flex-1 border-b border-gray-300 focus:outline-none"
              >
                {businessFunctions.map((title: any) => (
                  <option key={title.FunctionCategoryId} value={title.FunctionCategoryId}>
                    {title.CategoryName}
                  </option>
                ))}
              </select>
            ) : (
              <div
                onClick={() => handleFieldClick('FunctionCategoryId')}
                className="bg-gray-100 rounded-md px-3 py-2 text-sm text-gray-600 flex-1 cursor-pointer"
              >
                {getDisplayValue('FunctionCategoryId')}
              </div>
            )}
            {!editingFields['FunctionCategoryId'] && (
              <PencilIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 cursor-pointer" onClick={() => handleFieldClick('FunctionCategoryId')} />
            )}
          </div>
        </div><div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-5 h-5 text-gray-400">
            <BriefcaseIcon className="w-5 h-5" />
          </div>
          <div className="relative flex items-center flex-1">
            <div className="text-sm font-medium text-gray-700 mr-2 min-w-24">Role</div>
            {editingFields['RoleResponsibilityId'] ? (
              <select
                value={getEditValue('RoleResponsibilityId')}
                onChange={(e) => handleInputChange('RoleResponsibilityId', e.target.value)}
                onBlur={() => {
                  if (unsavedChanges['RoleResponsibilityId']) handleSaveClick('RoleResponsibilityId');
                }}
                autoFocus
                className="bg-gray-100 rounded-md px-3 py-2 text-sm text-gray-600 flex-1 border-b border-gray-300 focus:outline-none"
              >
                {businessRoles.map((title: any) => (
                  <option key={title.RoleResponsibilityId} value={title.RoleResponsibilityId}>
                    {title.RoleName}
                  </option>
                ))}
              </select>
            ) : (
              <div
                onClick={() => handleFieldClick('RoleResponsibilityId')}
                className="bg-gray-100 rounded-md px-3 py-2 text-sm text-gray-600 flex-1 cursor-pointer"
              >
                {getDisplayValue('RoleResponsibilityId')}
              </div>
            )}
            {!editingFields['RoleResponsibilityId'] && (
              <PencilIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 cursor-pointer" onClick={() => handleFieldClick('RoleResponsibilityId')} />
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-5 h-5 text-gray-400">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div className="relative flex items-center flex-1">
            <div className="text-sm font-medium text-gray-700 mr-2 min-w-24">Hire Date</div>
            {editingFields['HireDate'] ? (
              <input
                type="date"
                value={getEditValue('HireDate')}
                onChange={(e) => handleInputChange('HireDate', e.target.value)}
                onBlur={() => {
                  if (unsavedChanges['HireDate']) handleSaveClick('HireDate');
                }}
                autoFocus
                className="bg-gray-100 rounded-md px-3 py-2 text-sm text-gray-600 flex-1 border-b border-gray-300 focus:outline-none"
              />
            ) : (
              <div
                onClick={() => handleFieldClick('HireDate')}
                className="bg-gray-100 rounded-md px-3 py-2 text-sm text-gray-600 flex-1 cursor-pointer"
              >
                {getDisplayValue('HireDate')}
              </div>
            )}
            {!editingFields['HireDate'] && (
              <PencilIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 cursor-pointer" onClick={() => handleFieldClick('HireDate')} />
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-5 h-5 text-gray-400">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div className="relative flex items-center flex-1">
            <div className="text-sm font-medium text-gray-700 mr-2 min-w-24">Termination Date</div>
            {editingFields['TermDate'] ? (
              <input
                type="date"
                value={getEditValue('TermDate')}
                onChange={(e) => handleInputChange('TermDate', e.target.value)}
                onBlur={() => {
                  if (unsavedChanges['TermDate']) handleSaveClick('TermDate');
                }}
                autoFocus
                className="bg-gray-100 rounded-md px-3 py-2 text-sm text-gray-600 flex-1 border-b border-gray-300 focus:outline-none"
              />
            ) : (
              <div
                onClick={() => handleFieldClick('TermDate')}
                className="bg-gray-100 rounded-md px-3 py-2 text-sm text-gray-600 flex-1 cursor-pointer"
              >
                {getDisplayValue('TermDate')}
              </div>
            )}
            {!editingFields['TermDate'] && (
              <PencilIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 cursor-pointer" onClick={() => handleFieldClick('TermDate')} />
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-5 h-5 text-gray-400">
            <ClockIcon className="w-5 h-5" />
          </div>
          <div className="relative flex items-center flex-1">
            <div className="text-sm font-medium text-gray-700 mr-2 min-w-24">Time of Service</div>
            {editingFields['TOS'] ? (
              <input
                type="text"
                value={getEditValue('TOS')}
                onChange={(e) => handleInputChange('TOS', e.target.value)}
                onBlur={() => {
                  if (unsavedChanges['TOS']) handleSaveClick('TOS');
                }}
                autoFocus
                className="bg-gray-100 rounded-md px-3 py-2 text-sm text-gray-600 flex-1 border-b border-gray-300 focus:outline-none"
              />
            ) : (
              <div
                onClick={() => handleFieldClick('TOS')}
                className="bg-gray-100 rounded-md px-3 py-2 text-sm text-gray-600 flex-1 cursor-pointer"
              >
                {getDisplayValue('TOS')} years
              </div>
            )}
            {!editingFields['TOS'] && (
              <PencilIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 cursor-pointer" onClick={() => handleFieldClick('TOS')} />
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-5 h-5 text-gray-400">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div className="relative flex items-center flex-1">
            <div className="text-sm font-medium text-gray-700 mr-2 min-w-24">Birthday</div>
            {editingFields['Birthday'] ? (
              <input
                type="date"
                value={getEditValue('Birthday')}
                onChange={(e) => handleInputChange('Birthday', e.target.value)}
                onBlur={() => {
                  if (unsavedChanges['Birthday']) handleSaveClick('Birthday');
                }}
                autoFocus
                className="bg-gray-100 rounded-md px-3 py-2 text-sm text-gray-600 flex-1 border-b border-gray-300 focus:outline-none"
              />
            ) : (
              <div
                onClick={() => handleFieldClick('Birthday')}
                className="bg-gray-100 rounded-md px-3 py-2 text-sm text-gray-600 flex-1 cursor-pointer"
              >
                {getDisplayValue('Birthday')}
              </div>
            )}
            {!editingFields['Birthday'] && (
              <PencilIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 cursor-pointer" onClick={() => handleFieldClick('Birthday')} />
            )}
          </div>
        </div>
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-semibold text-gray-800 mb-2">Contact Information</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-5 h-5 text-gray-400">
                <EnvelopeIcon className="w-5 h-5" />
              </div>
              <div className="relative flex items-center flex-1">
                <div className="text-sm font-medium text-gray-700 mr-2 min-w-24">Email</div>
                {editingFields['PersonalEmail'] ? (
                  <input
                    type="text"
                    value={getEditValue('PersonalEmail')}
                    onChange={(e) => handleInputChange('PersonalEmail', e.target.value)}
                    onBlur={() => {
                      if (unsavedChanges['PersonalEmail']) handleSaveClick('PersonalEmail');
                    }}
                    autoFocus
                    className="bg-gray-100 rounded-md px-3 py-2 text-sm text-purple-600 flex-1 border-b border-gray-300 focus:outline-none"
                  />
                ) : (
                  <div
                    onClick={() => handleFieldClick('PersonalEmail')}
                    className="bg-gray-100 rounded-md px-3 py-2 text-sm text-purple-600 flex-1 cursor-pointer"
                  >
                    {getDisplayValue('PersonalEmail')}
                  </div>
                )}
                {!editingFields['PersonalEmail'] && (
                  <PencilIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 cursor-pointer" onClick={() => handleFieldClick('PersonalEmail')} />
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-5 h-5 text-gray-400">
                <PhoneIcon className="w-5 h-5" />
              </div>
              <div className="relative flex items-center flex-1">
                <div className="text-sm font-medium text-gray-700 mr-2 min-w-24">Phone</div>
                {editingFields['HomePhone'] ? (
                  <input
                    type="text"
                    value={getEditValue('HomePhone')}
                    onChange={(e) => handleInputChange('HomePhone', e.target.value)}
                    onBlur={() => {
                      if (unsavedChanges['HomePhone']) handleSaveClick('HomePhone');
                    }}
                    autoFocus
                    className="bg-gray-100 rounded-md px-3 py-2 text-sm text-gray-600 flex-1 border-b border-gray-300 focus:outline-none"
                  />
                ) : (
                  <div
                    onClick={() => handleFieldClick('HomePhone')}
                    className="bg-gray-100 rounded-md px-3 py-2 text-sm text-gray-600 flex-1 cursor-pointer"
                  >
                    {getDisplayValue('HomePhone')}
                  </div>
                )}
                {!editingFields['HomePhone'] && (
                  <PencilIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 cursor-pointer" onClick={() => handleFieldClick('HomePhone')} />
                )}
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-5 h-5 text-gray-400 mt-1">
                <MapPinIcon className="w-5 h-5" />
              </div>
              <div className="flex-1 space-y-3">
                <div className="text-sm font-medium text-gray-700 mb-1">Address</div>
                <div className="relative">
                  {editingFields['HomeAddress'] ? (
                    <input
                      type="text"
                      value={getEditValue('HomeAddress')}
                      onChange={(e) => handleInputChange('HomeAddress', e.target.value)}
                      onBlur={() => {
                        if (unsavedChanges['HomeAddress']) handleSaveClick('HomeAddress');
                      }}
                      autoFocus
                      className="bg-gray-100 rounded-md px-3 py-2 text-sm text-gray-600 w-full border-b border-gray-300 focus:outline-none"
                    />
                  ) : (
                    <div
                      onClick={() => handleFieldClick('HomeAddress')}
                      className="bg-gray-100 rounded-md px-3 py-2 text-sm text-gray-600 cursor-pointer"
                    >
                      {getDisplayValue('HomeAddress')}
                    </div>
                  )}
                  {!editingFields['HomeAddress'] && (
                    <PencilIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 cursor-pointer" onClick={() => handleFieldClick('HomeAddress')} />
                  )}
                </div>
                <div className="relative">
                  {editingFields['Apt'] ? (
                    <input
                      type="text"
                      value={getEditValue('Apt')}
                      onChange={(e) => handleInputChange('Apt', e.target.value)}
                      onBlur={() => {
                        if (unsavedChanges['Apt']) handleSaveClick('Apt');
                      }}
                      autoFocus
                      className="bg-gray-100 rounded-md px-3 py-2 text-sm text-gray-600 w-full border-b border-gray-300 focus:outline-none"
                    />
                  ) : (
                    <div
                      onClick={() => handleFieldClick('Apt')}
                      className="bg-gray-100 rounded-md px-3 py-2 text-sm text-gray-600 cursor-pointer"
                    >
                      {getDisplayValue('Apt')}
                    </div>
                  )}
                  {!editingFields['Apt'] && (
                    <PencilIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 cursor-pointer" onClick={() => handleFieldClick('Apt')} />
                  )}
                </div>
                <div className="relative">
                  {editingFields['City'] ? (
                    <input
                      type="text"
                      value={getEditValue('City')}
                      onChange={(e) => handleInputChange('City', e.target.value)}
                      onBlur={() => {
                        if (unsavedChanges['City']) handleSaveClick('City');
                      }}
                      autoFocus
                      className="bg-gray-100 rounded-md px-3 py-2 text-sm text-gray-600 w-full border-b border-gray-300 focus:outline-none"
                    />
                  ) : (
                    <div
                      onClick={() => handleFieldClick('City')}
                      className="bg-gray-100 rounded-md px-3 py-2 text-sm text-gray-600 cursor-pointer"
                    >
                      {getDisplayValue('City')}
                    </div>
                  )}
                  {!editingFields['City'] && (
                    <PencilIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 cursor-pointer" onClick={() => handleFieldClick('City')} />
                  )}
                </div>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    {editingFields['HomeStateAbbrev'] ? (
                      <input
                        type="text"
                        value={getEditValue('HomeStateAbbrev')}
                        onChange={(e) => handleInputChange('HomeStateAbbrev', e.target.value)}
                        onBlur={() => {
                          if (unsavedChanges['HomeStateAbbrev']) handleSaveClick('HomeStateAbbrev');
                        }}
                        autoFocus
                        className="bg-gray-100 rounded-md px-3 py-2 text-sm text-gray-600 w-full border-b border-gray-300 focus:outline-none"
                      />
                    ) : (
                      <div
                        onClick={() => handleFieldClick('HomeStateAbbrev')}
                        className="bg-gray-100 rounded-md px-3 py-2 text-sm text-gray-600 cursor-pointer"
                      >
                        {getDisplayValue('HomeStateAbbrev')}
                      </div>
                    )}
                    {!editingFields['HomeStateAbbrev'] && (
                      <PencilIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 cursor-pointer" onClick={() => handleFieldClick('HomeStateAbbrev')} />
                    )}
                  </div>
                  <div className="relative flex-1">
                    {editingFields['Zip'] ? (
                      <input
                        type="text"
                        value={getEditValue('Zip')}
                        onChange={(e) => handleInputChange('Zip', e.target.value)}
                        onBlur={() => {
                          if (unsavedChanges['Zip']) handleSaveClick('Zip');
                        }}
                        autoFocus
                        className="bg-gray-100 rounded-md px-3 py-2 text-sm text-gray-600 w-full border-b border-gray-300 focus:outline-none"
                      />
                    ) : (
                      <div
                        onClick={() => handleFieldClick('Zip')}
                        className="bg-gray-100 rounded-md px-3 py-2 text-sm text-gray-600 cursor-pointer"
                      >
                        {getDisplayValue('Zip')}
                      </div>
                    )}
                    {!editingFields['Zip'] && (
                      <PencilIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 cursor-pointer" onClick={() => handleFieldClick('Zip')} />
                    )}
                  </div>
                </div>
              </div>
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
      </div>
    </div>
  );
}