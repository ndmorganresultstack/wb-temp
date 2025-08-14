
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { InternalLaborCost } from '@/lib/types';

// Define a type for the totals row
interface TotalsRow {
  BaseAnnualSalary: number;
  Bonus: number;
  EESRE: number;
  AnnualAdmin: number;
  AnnualProperty: number;
  TotalCost: number;
  Headcount: number;
  BonusPct: number;
  ShareAdmin: number;
}

export async function GET() {
  try {
    // Fetch all InternalLabor records with related Employee data
    const laborCostData = await prisma.internalLabor.findMany({
      include: {
        ServiceAccounts: true,
        FiscalYearLaborDetails: true,
        Employees: {
          include: {
            BusinessTitles: true,
            FunctionCategories: true,
            RoleResponsibilities: true,
          },
        },
      },
    });

    // Calculate totals
    const totals: TotalsRow = laborCostData.reduce(
      (acc, labor) => {
        return {
          BaseAnnualSalary: acc.BaseAnnualSalary + Number(labor.BaseAnnualSalary),
          Bonus: acc.Bonus + Number(labor.Bonus),
          EESRE: acc.EESRE + Number(labor.EESRE),
          AnnualAdmin: acc.AnnualAdmin + Number(labor.AnnualAdmin),
          AnnualProperty: acc.AnnualProperty + Number(labor.AnnualProperty),
          TotalCost: acc.TotalCost + Number(labor.TotalCost),
          Headcount: acc.Headcount + Number(labor.Employees.Headcount),
          BonusPct : acc.BonusPct + Number(labor.BonusPct),
          ShareAdmin: acc.ShareAdmin + Number(labor.ShareAdmin)
        };
      },
      {
        BaseAnnualSalary: 0,
        Bonus: 0,
        EESRE: 0,
        AnnualAdmin: 0,
        AnnualProperty: 0,
        TotalCost: 0,
        Headcount: 0,
        BonusPct : 0,
        ShareAdmin: 0,
      }
    );
 

    // Return laborCostData and totals
    return NextResponse.json({ laborCostData, totals });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch labor cost data'+error }, { status: 500 });
  }
}
