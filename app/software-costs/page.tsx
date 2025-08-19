import DynamicTable from '@/components/DynamicTable';
import '../../app/globals.css';

export default function EmployeesPage() {
  return (
    // Component file
    <div className="grid-page-container">
      <div className="grid-page-header">
         SOFTWARE COSTS
      </div>
      <div className="grid-toolbar-row  flex justify-between items-center">
        <div></div>
      </div>
      <div className="grid-container">
        <DynamicTable model="SoftwareCosts" />
      </div>
    </div>   
  );
}