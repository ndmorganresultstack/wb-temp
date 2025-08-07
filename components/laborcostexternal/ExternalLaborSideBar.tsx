import React, { useState, useEffect } from 'react';
import { ExternalLaborCost } from '@/lib/types';
import { BriefcaseIcon, CalendarDateRangeIcon, ClockIcon, CogIcon, CurrencyDollarIcon, EnvelopeIcon, MapIcon, PhoneIcon, UsersIcon } from '@heroicons/react/24/outline';

interface ExternalLaborSideBarProps {
  selectedVendor: ExternalLaborCost;
  onClose: () => void;
}

export default function ExternalLaborSideBar({ selectedVendor, onClose }: ExternalLaborSideBarProps) {
  const [vendorData, setVendorData] = useState<ExternalLaborCost | null>(null);

  useEffect(() => {
    if (selectedVendor) {
      setVendorData(selectedVendor);
    }
  }, [selectedVendor]);

  const handleClose = () => {
    onClose();
  };

  if (!vendorData) return null;

  const getStatusColor = () => {
    return 'bg-green-500'; // Default to Active, can be expanded based on status
  };

  return (
    <div className="w-80 bg-white rounded-lg shadow-2xl p-6 overflow-y-auto max-h-screen min-h-screen max-lg:w-full absolute top-0 right-0 z-50 flex flex-col">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-700">Vendor Profile</h2>
        <button
          onClick={handleClose}
          className="text-gray-500 hover:text-gray-700 px-1 py-1 rounded-md cursor-pointer"
        >
          X
        </button>
      </div>

      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-800">{vendorData.Vendor}</h1>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>ID: {vendorData.VendorNO}</span>
          <span className={`${getStatusColor()} text-white text-xs font-medium px-2 py-1 rounded-full`}>Active</span>
        </div>
      </div>

      {/* Contract Information Section */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-600 mb-2">Contract Information</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <CalendarDateRangeIcon className="w-5 h-5" />
            <span>Start</span>
            <span className="ml-auto font-medium">{new Date(vendorData.StartDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDateRangeIcon className="w-5 h-5" />
            <span>Finish</span>
            <span className="ml-auto font-medium">{new Date(vendorData.FinishDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <ClockIcon className="w-5 h-5" />
            <span>Hours</span>
            <span className="ml-auto font-medium">{vendorData.Hours}</span>
          </div>
          <div className="flex items-center gap-2">
            <CurrencyDollarIcon className="w-5 h-5" />
            <span>Rate</span>
            <span className="ml-auto font-medium">${vendorData.Rate.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <CurrencyDollarIcon className="w-5 h-5" />
            <span>Total</span>
            <span className="ml-auto font-medium">${vendorData.TotalCost.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Contact Information Section */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-600 mb-2">Contact Information</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <EnvelopeIcon className="w-5 h-5" />
            <span>Email</span>
            <a href={`mailto:${vendorData.Vendor.toLowerCase()}@example.com`} className="ml-auto font-medium text-blue-600 hover:underline">{`${vendorData.Vendor.toLowerCase()}@example.com`}</a>
          </div>
          <div className="flex items-center gap-2">
            <PhoneIcon className="w-5 h-5" />
            <span>Phone</span>
            <span className="ml-auto font-medium">(408) 555-1234</span>
          </div>
          <div className="flex items-center gap-2">
            <MapIcon className="w-5 h-5" />
            <span>Address</span>
            <div className="ml-auto font-medium">
              <span>123 Main Street, AB</span><br />
              <span>San Francisco, CA 94105</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notes Section */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-600 mb-2">Notes</h3>
        <p className="text-sm text-gray-600">Lorem ipsum notes go here in this column. Lorem ipsum</p>
      </div>

      {/* Buttons Section */}
      <div className="flex gap-2 mt-auto">
        <button className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">
          Edit Profile
        </button>
        <button className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700" onClick={handleClose}>
          Close
        </button>
      </div>
    </div>
  );
}