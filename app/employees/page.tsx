import DynamicTable from '@/components/DynamicTable';
import '../../app/globals.css';

export default function EmployeesPage() {
  return (
    
        <div>
          <div className="ml-4">
          <h1>EMPLOYEES</h1>
          </div>
          <DynamicTable model="Employees" />
       
        </div>
   
  );
}