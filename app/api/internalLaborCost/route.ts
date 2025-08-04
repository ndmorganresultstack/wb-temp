// app/api/employees/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Fetch all InternalLabor records with related Employee data
    const laborCostData = await prisma.internalLabor.findMany({
      include: {
        Employees: {
          include: {
            BusinessTitles: true,
            FunctionCategories: true,
            RoleResponsibilities: true,
          },
        },
      },
    });

    // Fetch all FiscalYearLaborDetails with related InternalLabor data
    const fiscalYearLaborDetails = await prisma.fiscalYearLaborDetails.findMany({
      include: {
        InternalLabor: {
          include: {
            Employees: {
              include: {
                BusinessTitles: true,
                FunctionCategories: true,
                RoleResponsibilities: true,
              },
            },
          },
        },
      },
    });

    // Create a map to group FiscalYear details by LaborID
    const fiscalYearMap = new Map<number, any[]>();
    fiscalYearLaborDetails.forEach((detail) => {
      const laborId = detail.LaborID;
      if (!fiscalYearMap.has(laborId)) {
        fiscalYearMap.set(laborId, []);
      }
      fiscalYearMap.get(laborId)!.push({
        FYDetailID: detail.FYDetailID,
        FiscalYear: detail.FiscalYear,
        AnnualAmount: detail.AnnualAmount,
        IncreasePct: detail.IncreasePct,
        YoYChange: detail.YoYChange,
        CreatedAt: detail.CreatedAt,
        UpdatedAt: detail.UpdatedAt,
      });
    });

    // Map FiscalYear details to their corresponding InternalLabor records
    const enrichedLaborData = laborCostData.map((labor) => ({
      ...labor,
      FiscalYears: fiscalYearMap.get(labor.LaborID) || [], // Attach fiscal year details as a child array
    }));

    return NextResponse.json(enrichedLaborData);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch labor cost data' }, { status: 500 });
  }
}