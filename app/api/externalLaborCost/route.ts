
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { InternalLaborCost } from '@/lib/types';

// Define a type for the totals row
interface TotalsRow {
  Hours: number;
  Rate: number;
  TotalCost: number;
  ShareAdmin: number;
  AnnualAdmin: number;
  AnnualProperty: number;  
}

export async function GET() {
  try {
    // Fetch all InternalLabor records with related Employee data
    const laborCostData = await prisma.externalLabor.findMany({     
    });

    // Calculate totals
    const totals: TotalsRow = laborCostData.reduce(
      (acc, labor) => {
        return {  
          AnnualAdmin: acc.AnnualAdmin + Number(labor.AnnualAdmin),
          AnnualProperty: acc.AnnualProperty + Number(labor.AnnualProperty),
          TotalCost: acc.TotalCost + Number(labor.TotalCost), 
          ShareAdmin: acc.ShareAdmin + Number(labor.ShareAdmin),
          Hours: acc.Hours + Number(labor.Hours),
          Rate: acc.Rate + Number(labor.Rate)
        };
      },
      {
        Hours: 0, 
        AnnualAdmin: 0,
        AnnualProperty: 0,
        TotalCost: 0, 
        ShareAdmin: 0,
        Rate:0
      }
    );
 

    // Return laborCostData and totals
    return NextResponse.json({ laborCostData, totals });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: `Failed to fetch labor cost data ${error}` }, { status: 500 });
  }
}
