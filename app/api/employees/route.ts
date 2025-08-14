
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import Error from 'next/error';

export async function GET() {
  try {
    const employees = await prisma.employees.findMany({
      include: {
        BusinessTitles: true,
        FunctionCategories: true,
        RoleResponsibilities: true,
      },
    });
    return NextResponse.json(employees);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: `Failed to fetch employees ${error}` }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { FirstName, LastName, EE_NO, EmployeeStatus, BusinessTitleId, FunctionCategoryId, RoleResponsibilityId } = body;

    if (!FirstName || !LastName || !EE_NO) {
      return NextResponse.json({ error: 'FirstName, LastName, and EE_NO are required' }, { status: 400 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = {
      FirstName,
      LastName,
      EE_NO,
      EmployeeStatus: EmployeeStatus || 'Active',
    };

    if (BusinessTitleId) {
      data.BusinessTitles = { connect: { BusinessTitleId: BusinessTitleId } };
    }
    if (FunctionCategoryId) {
      data.FunctionCategories = { connect: { FunctionCategoryId: FunctionCategoryId } };
    }
    if (RoleResponsibilityId) {
      data.RoleResponsibilities = { connect: { RoleResponsibilityId: RoleResponsibilityId } };
    }

    const newEmployee = await prisma.employees.create({
      data,
      include: {
        BusinessTitles: true,
        FunctionCategories: true,
        RoleResponsibilities: true,
      },
    });

    return NextResponse.json(newEmployee, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create employee' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const {updatedData } = body;
    const { EE_NO, FirstName, LastName, EmployeeStatus, BusinessTitleId, FunctionCategoryId, TermDate, RoleResponsibilityId, PersonalEmail, HireDate, 
      HomePhone, HomeAddress,Apt, City,HomeStateAbbrev,Zip,Birthday,TOS } = updatedData;

    if (!EE_NO) {
      return NextResponse.json({ error: 'EE_NO is required for updating' }, { status: 400 });
    }

    const UpdatedAt = new Date(); 
    
    const updatedEmployee = await prisma.employees.update({
      where: { EE_NO },
      data: {
        FirstName,
        LastName,
        EmployeeStatus,
        BusinessTitles: BusinessTitleId ? { connect: { BusinessTitleId: BusinessTitleId } } : undefined,
        FunctionCategories: FunctionCategoryId ? { connect: { FunctionCategoryId: FunctionCategoryId } } : undefined,
        RoleResponsibilities: RoleResponsibilityId ? { connect: { RoleResponsibilityId: RoleResponsibilityId } } : undefined,
        PersonalEmail,
        HomePhone,
        HomeAddress,
        Apt,
        City,
        HomeStateAbbrev,
        Zip,
        UpdatedAt,
        TermDate,
        HireDate,
        Birthday,
        TOS
      },
      include: {
        BusinessTitles: true,
        FunctionCategories: true,
        RoleResponsibilities: true,
      },
    });

    return NextResponse.json(updatedEmployee);
  } catch (error) {
    console.error(error);
    if (typeof error === 'object' && error !== null && 'code' in error && (error as { code?: string }).code === 'P2025') {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update employee' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { EE_NO } = await request.json();

    if (!EE_NO) {
      return NextResponse.json({ error: 'EE_NO is required for deletion' }, { status: 400 });
    }

    await prisma.employees.delete({
      where: { EE_NO },
    });

    return NextResponse.json({ message: 'Employee deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(error);
    if (typeof error === 'object' && error !== null && 'code' in error && (error as { code?: string }).code === 'P2025') {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete employee' }, { status: 500 });
  }
}