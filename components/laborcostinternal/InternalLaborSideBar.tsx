import { BusinessTitles, InternalLabor } from "@/app/generated/prisma";
import { BriefcaseIcon, CalendarIcon, ClockIcon, EnvelopeIcon, MapPinIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { useState,useEffect } from 'react';
import prisma from "@/lib/prisma"; 
import { Decimal } from "@/app/generated/prisma/runtime/library";

//fetch business titles from prisma
export async function getBusinessTitles() {
      const res = await fetch('/api/businessTitles');
      if (!res.ok) {
          throw new Error('Failed to fetch business titles');
      }
      return res.json();
}

export default function InternalLaborSideBar({ selectedEmployee, onClose }: { selectedEmployee: InternalLabor, onClose: () => void }) {
  const [editing, setEditing] = useState(false);
  const [businessTitles, setBusinessTitles] = useState([]);

  useEffect(() => {
    async function fetchBusinessTitles() {
      const titles = await getBusinessTitles();
      setBusinessTitles(titles);
    }
    fetchBusinessTitles();
  }, []);

  function saveChanges(selectedEmployee: { EE_NO: string; LastName: string; FirstName: string; Headcount: number | null; BusinessTitleId: number; FunctionCategoryId: number; RoleResponsibilityId: number; HireDate: Date | null; TOS: Decimal | null; TermDate: Date | null; Birthday: Date | null; HomeAddress: string | null; Apt: string | null; City: string | null; HomeStateAbbrev: string | null; Zip: string | null; HomePhone: string | null; PersonalEmail: string | null; EmployeeStatus: string | null; CreatedAt: Date | null; UpdatedAt: Date | null; }): void {
     setEditing(false);
  }

  return (
    selectedEmployee && (
      <div className="w-96 bg-white rounded-lg shadow-sm p-6 overflow-y-auto max-h-screen max-lg:w-full">
        <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
      <h2 className="text-lg font-semibold text-gray-800">Employee Profile</h2>
      <button
        onClick={() => onClose()}
        className="text-gray-500 hover:text-gray-700 text-2xl"
      >
        ×
      </button>
    </div>
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{selectedEmployee.FirstName} {selectedEmployee.LastName}</h3>
          <p className="text-sm text-gray-600">{selectedEmployee.BusinessTitles?.TitleName || 'N/A'}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">ID: {selectedEmployee.EE_NO}</span>
          {selectedEmployee.EmployeeStatus === 'Terminated' && (
            <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">Terminated</span>
          )}
          {selectedEmployee.EmployeeStatus === 'Active' && (
            <span className="bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full">Active</span>
          )}
          {selectedEmployee.EmployeeStatus === 'Vacant' && (
            <span className="bg-yellow-500 text-white text-xs font-medium px-2 py-1 rounded-full">Vacant</span>
          )}
        </div>
      </div>
    </div>
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 w-5 h-5 text-gray-400">
          {/* Import { BriefcaseIcon } from '@heroicons/react/24/outline'; */}
          <BriefcaseIcon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium text-gray-700">Position</div>
          {editing ? (
            <select 
              className="bg-gray-100 rounded-md px-3 py-2 text-sm text-gray-600"
            >
              <option value="">Select a title</option>
              {businessTitles.map((title : BusinessTitles) => (
                <option key={title.BusinessTitleId} value={title.BusinessTitleId} selected={selectedEmployee.BusinessTitleId === title.BusinessTitleId}>
                  {title.TitleName}
                </option>
              ))}
            </select>
          ) : (
            <div className="bg-gray-100 rounded-md px-3 py-2 text-sm text-gray-600">
              {selectedEmployee.BusinessTitles?.TitleName || 'N/A'}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 w-5 h-5 text-gray-400">
          {/* Import { CalendarIcon } from '@heroicons/react/24/outline'; */}
          <CalendarIcon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium text-gray-700">Hire Date</div>
          <div className="bg-gray-100 rounded-md px-3 py-2 text-sm text-gray-600">
            {selectedEmployee.HireDate 
              ? new Date(selectedEmployee.HireDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) 
              : 'N/A'}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 w-5 h-5 text-gray-400">
          {/* Import { ClockIcon } from '@heroicons/react/24/outline'; */}
          <ClockIcon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium text-gray-700">Time of Service</div>
          <div className="bg-gray-100 rounded-md px-3 py-2 text-sm text-gray-600">
            {selectedEmployee.TOS ? selectedEmployee.TOS.toString() : '0'} years
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 w-5 h-5 text-gray-400">
          {/* Import { CakeIcon } from '@heroicons/react/24/outline'; or reuse CalendarIcon */}
          <CalendarIcon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium text-gray-700">Birthday</div>
          <div className="bg-gray-100 rounded-md px-3 py-2 text-sm text-gray-600">
            {selectedEmployee.Birthday 
              ? new Date(selectedEmployee.Birthday).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) 
              : 'N/A'}
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200 pt-4">
        <h4 className="text-sm font-semibold text-gray-800 mb-2">Contact Information</h4>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-5 h-5 text-gray-400">
              {/* Import { EnvelopeIcon } from '@heroicons/react/24/outline'; */}
              <EnvelopeIcon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-700">Email</div>
              <div className="bg-gray-100 rounded-md px-3 py-2 text-sm text-gray-600">
                {selectedEmployee.PersonalEmail || 'N/A'}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-5 h-5 text-gray-400">
              {/* Import { PhoneIcon } from '@heroicons/react/24/outline'; */}
              <PhoneIcon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-700">Phone</div>
              <div className="bg-gray-100 rounded-md px-3 py-2 text-sm text-gray-600">
                {selectedEmployee.HomePhone || 'N/A'}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200 pt-4">
        <h4 className="text-sm font-semibold text-gray-800 mb-2">Address</h4>
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-5 h-5 text-gray-400">
            {/* Import { MapPinIcon } from '@heroicons/react/24/outline'; */} 
            <MapPinIcon className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="bg-gray-100 rounded-md px-3 py-2 text-sm text-gray-600">
              {selectedEmployee.HomeAddress || ''}{selectedEmployee.Apt ? `, ${selectedEmployee.Apt}` : ''}<br />
              {selectedEmployee.City || ''}, {selectedEmployee.HomeStateAbbrev || ''} {selectedEmployee.Zip || ''}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="flex gap-2 mt-6">
      {editing &&         
        <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          onClick={() => saveChanges(selectedEmployee)}
        >
          Save Changes
        </button>         
      }
      {!editing && (
        <button className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
          onClick={() => setEditing(true)}
        >
          Edit Profile
        </button>
      )}
      <button
        onClick={() => onClose()}
        className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
      >
        Close
      </button>
    </div>
  </div>
)
    )
};