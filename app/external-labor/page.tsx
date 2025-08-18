'use client';

import { useEffect, useState } from 'react'; 
import { ExternalLaborCost, ExternalTotalsRow } from '@/lib/helper';
import ExternalLaborCostHeader from '@/components/laborcostexternal/ExternalLaborCostHeader'; 
import ExternalLaborRow from '@/components/laborcostexternal/ExternalLaborRow';
import ExternalLaborSideBar from '@/components/laborcostexternal/ExternalLaborSideBar'; 
import ExternalLaborTableHeader from '@/components/laborcostexternal/ExternalLaborCostTableHeader'; 
import ExternalLaborTotalRow from '@/components/laborcostexternal/ExternalLaborTotalRow';
import Pagination from  '@/components/pagination';

export default function ExternalLaborPage() {
  const [laborCostData, setLaborCostData] = useState<ExternalLaborCost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVendor, setSelectedVendor] = useState<ExternalLaborCost | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1); 
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [totals, setTotals] = useState<ExternalTotalsRow>({} as ExternalTotalsRow);
  const [sortColumn, setSortColumn] = useState<keyof ExternalLaborCost | 'VendorNo' | 'Vendor' | 'Rate' | 'Hours' | 'TotalCost' | 'Purpose' | undefined>(undefined);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    async function fetchLaborCostData() {
      try {
        const res = await fetch('api/externalLaborCost');
        if (res.ok) {
          const {laborCostData, totals}:{laborCostData: ExternalLaborCost[], totals: ExternalTotalsRow} = await res.json();
          setLaborCostData(laborCostData);
          setTotals(totals);
        } else {
          console.error('Failed to fetch labor cost data');
        }
      } catch (error) {
        console.error('Error fetching vendors:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchLaborCostData();
  }, []);

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when search query, items per page, or sort changes
  }, [searchQuery, itemsPerPage, sortColumn, sortDirection]);

  // Filter vendors based on search query
  const filteredVendors = laborCostData.filter(vendor => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      vendor.Purpose.toLowerCase().includes(query) ||
      vendor.Vendor.toLowerCase().includes(query) ||
      vendor.VendorNO.toLowerCase().includes(query)  
    );
  });

  // Sorting logic
  const sortedVendor = [...filteredVendors].sort((a, b) => {
    if (!sortColumn) return 0;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let valueA: any, valueB: any;
    switch (sortColumn) {
      case 'VendorNo':
        valueA = a.VendorNO || '';
        valueB = b.VendorNO || '';
        break;
      case 'Vendor':
        valueA = a.Vendor  || '';
        valueB = b.Vendor || '';
        break;
      case 'Purpose':
        valueA = a.Purpose || '';
        valueB = b.Purpose || '';
        break;
      case 'StartDate':
        valueA = a.StartDate || '';
        valueB = b.StartDate|| '';
        break;
      case 'FinishDate':
        valueA = a.FinishDate || '';
        valueB = b.FinishDate || '';
        break;
      default:
        valueA = a[sortColumn] || 0;
        valueB = b[sortColumn] || 0;
        break;
    }

    // Handle numbers
    if (['TotalCost', 'Hours', 'Rate'].includes(sortColumn)) {
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
  const handleSort = (column: keyof ExternalLaborCost | 'VendorNo' | 'Vendor' | 'Purpose' | 'Hours' | 'Rate' | 'TotalCost') => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
    setCurrentPage(1); // Reset to first page on sort
  };

  // Calculate current vendors for the page
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentVendors = sortedVendor.slice(indexOfFirst, indexOfLast);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-4 max-h-screen bg-gray-50 flex gap-4 max-lg:flex-col">
       <div className={`bg-white rounded-lg shadow-sm overflow-x-auto ${selectedVendor ? 'flex-1' : 'w-full'}`}>
      
        <ExternalLaborCostHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <ExternalLaborTableHeader
          sortColumn={sortColumn ?? ""}
          sortDirection={sortDirection}
          onSort={handleSort}
        />

        <div className="bg-white z-10 flex -mt-1 flex-col items-stretch font-inter justify-center max-lg:max-w-full py-1">
          {currentVendors.map((vendor, index) => (
            <ExternalLaborRow
              key={vendor.VendorNO}
              ExternalLabor={vendor}
              isSelected={selectedVendor?.VendorNO === vendor.VendorNO}
              onSelect={() => setSelectedVendor(vendor)}
              isAlternate={index % 2 === 0}
            />
          ))}
          <ExternalLaborTotalRow
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
            totalPages={Math.ceil(sortedVendor.length / itemsPerPage)}
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
      {selectedVendor && (
        <ExternalLaborSideBar selectedVendor={selectedVendor} onClose={() => setSelectedVendor(null)} />
      )}
    </div>
  );
}