import { Employees, BusinessTitles, RoleResponsibilities, FunctionCategories } from '@/app/generated/prisma';

export interface EmployeeWithRelations extends Employees {
  BusinessTitles?: BusinessTitles;
  RoleResponsibilities?: RoleResponsibilities;
  FunctionCategories?: FunctionCategories;
}

export interface ExternalLaborCost {
  VendorNO: string;
  Vendor: string;
  Purpose: string;
  StartDate:Date;
  FinishDate:Date;
  Hours:number;
  Rate:number;
  TotalCost:number;
  ShareAdmin:number;
  AnnualAdmin:number;
  AnnualProperty:number;
  CreatedAt:Date;
  UpdatedAt:Date;

}

export interface InternalLaborCost {
  LaborID: number;
  EE_NO: string;
  BaseAnnualSalary: number;
  MonthlySalary: number;
  Bonus: number;
  BonusPct: number;
  EESRE: number;
  TotalCost: number;
  ShareAdmin: number;
  AnnualAdmin: number;
  AnnualProperty: number;
  ServiceAccountId: number | null;
  MonthlyBreakdowns: string;
  CreatedAt: string;
  UpdatedAt: string;
  Employees: {
    EE_NO: string;
    LastName: string;
    FirstName: string;
    Headcount: number;
    BusinessTitleId: number;
    FunctionCategoryId: number;
    RoleResponsibilityId: number;
    HireDate: Date | null;
    TOS: number | null; // Time of Service
    TermDate: Date | null;
    Birthday: Date | null;
    HomeAddress: string;
    Apt: string;
    City: string;
    HomeStateAbbrev: string;
    Zip: string;
    HomePhone: string;
    PersonalEmail: string;
    EmployeeStatus: string;
    CreatedAt: string;
    UpdatedAt: string;
    BusinessTitles: {
      BusinessTitleId: number;
      TitleName: string;
      CreatedAt: string;
      UpdatedAt: string;
    } | null;
    FunctionCategories: {
      FunctionCategoryId: number;
      CategoryName: string;
      CreatedAt: string;
      UpdatedAt: string;
    };
    RoleResponsibilities: {
      RoleResponsibilityId: number;
      RoleName: string;
      CreatedAt: string;
      UpdatedAt: string;
    };
  } | null; // Placeholder for employees
  FiscalYearLaborDetails: {
    FYDetailID: number;
    FiscalYear: number;
    AnnualAmount: number;
    IncreasePct: number | null;
    YoYChange: number | null;
    CreatedAt: string;
    UpdatedAt: string;
  }[] | null;
  ServiceAccounts: {
    ServiceAccountId: number;
    ServiceDescription: string;
    CreatedAt: string;
    UpdatedAt: string;
  } | null;
}

export interface TotalsRow {
  BaseAnnualSalary: number;
  Bonus: number;
  BonusPct: number;
  EESRE: number;
  ShareAdmin: number;
  AnnualAdmin: number;
  AnnualProperty: number;
  TotalCost: number;
  Headcount: number;
}
export interface ExternalTotalsRow {
  Hours: number;
  Rate: number; 
  ShareAdmin: number;
  AnnualAdmin: number;
  AnnualProperty: number;
  TotalCost: number; 
}
