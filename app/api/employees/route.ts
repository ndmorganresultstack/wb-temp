import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { trackTrace, trackException } from '@/lib/appInsights';
import { ClientPrincipal } from '@/lib/auth';

async function checkUserAuthorization(request: NextRequest): Promise<ClientPrincipal | null> {
  try {
    const clientPrincipalHeader = request.headers.get('x-ms-client-principal');
    if (!clientPrincipalHeader) {
      trackTrace('Employees API: No clientPrincipal header', { endpoint: '/api/employees' });
      return null;
    }

    const decoded = Buffer.from(clientPrincipalHeader, 'base64').toString('utf-8');
    const clientPrincipal: ClientPrincipal = JSON.parse(decoded);
    const userEmail = clientPrincipal.userDetails;

    if (!userEmail) {
      trackTrace('Employees API: No userDetails in clientPrincipal', { endpoint: '/api/employees' });
      return null;
    }

    // Check if the user exists in the users table
    const user = await prisma.users.findFirst({
      where: { email: userEmail },
    });

    if (!user) {
      trackTrace('Employees API: User not found in users table', {
        endpoint: '/api/employees',
        userEmail,
      });
      return null;
    }

    trackTrace('Employees API: User authorized', {
      endpoint: '/api/employees',
      userId: clientPrincipal.userId,
      userEmail,
    });
    return clientPrincipal;
  } catch (error: any) {
    trackException(error, { endpoint: '/api/employees', action: 'checkUserAuthorization' });
    return null;
  }
}

export async function GET(request: NextRequest) {
  const clientPrincipal = await checkUserAuthorization(request);
  if (!clientPrincipal) {
    return NextResponse.redirect(new URL('/access-denied', request.url));
  }

  try {
    const employees = await prisma.employees.findMany({
      include: {
        BusinessTitles: true,
        FunctionCategories: true,
        RoleResponsibilities: true,
      },
    });
    trackTrace('Employees API: Fetched employees', {
      endpoint: '/api/employees',
      userId: clientPrincipal.userId,
      count: employees.length,
    });
    return NextResponse.json(employees);
  } catch (error: any) {
    trackException(error, { endpoint: '/api/employees', action: 'GET' });
    return NextResponse.json({ error: `Failed to fetch employees: ${error.message}` }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const clientPrincipal = await checkUserAuthorization(request);
  if (!clientPrincipal) {
    return NextResponse.redirect(new URL('/access-denied', request.url));
  }

  try {
    const body = await request.json();
    const { FirstName, LastName, EE_NO, EmployeeStatus, BusinessTitleId, FunctionCategoryId, RoleResponsibilityId } = body;

    if (!FirstName || !LastName || !EE_NO) {
      trackTrace('Employees API: Missing required fields', {
        endpoint: '/api/employees',
        userId: clientPrincipal.userId,
      });
      return NextResponse.json({ error: 'FirstName, LastName, and EE_NO are required' }, { status: 400 });
    }

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

    trackTrace('Employees API: Created employee', {
      endpoint: '/api/employees',
      userId: clientPrincipal.userId,
      employeeId: newEmployee.EE_NO,
    });
    return NextResponse.json(newEmployee, { status: 201 });
  } catch (error: any) {
    trackException(error, { endpoint: '/api/employees', action: 'POST' });
    return NextResponse.json({ error: `Failed to create employee: ${error.message}` }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const clientPrincipal = await checkUserAuthorization(request);
  if (!clientPrincipal) {
    return NextResponse.redirect(new URL('/access-denied', request.url));
  }

  try {
    const body = await request.json();
    const { updatedData } = body;
    const { EE_NO, FirstName, LastName, EmployeeStatus, BusinessTitleId, FunctionCategoryId, TermDate, RoleResponsibilityId, PersonalEmail, HireDate, HomePhone, HomeAddress, Apt, City, HomeStateAbbrev, Zip, Birthday, TOS } = updatedData;

    if (!EE_NO) {
      trackTrace('Employees API: Missing EE_NO for update', {
        endpoint: '/api/employees',
        userId: clientPrincipal.userId,
      });
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
        TOS,
      },
      include: {
        BusinessTitles: true,
        FunctionCategories: true,
        RoleResponsibilities: true,
      },
    });

    trackTrace('Employees API: Updated employee', {
      endpoint: '/api/employees',
      userId: clientPrincipal.userId,
      employeeId: EE_NO,
    });
    return NextResponse.json(updatedEmployee);
  } catch (error: any) {
    trackException(error, { endpoint: '/api/employees', action: 'PUT' });
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2025') {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }
    return NextResponse.json({ error: `Failed to update employee: ${error.message}` }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const clientPrincipal = await checkUserAuthorization(request);
  if (!clientPrincipal) {
    return NextResponse.redirect(new URL('/access-denied', request.url));
  }

  try {
    const { EE_NO } = await request.json();

    if (!EE_NO) {
      trackTrace('Employees API: Missing EE_NO for deletion', {
        endpoint: '/api/employees',
        userId: clientPrincipal.userId,
      });
      return NextResponse.json({ error: 'EE_NO is required for deletion' }, { status: 400 });
    }

    await prisma.employees.delete({
      where: { EE_NO },
    });

    trackTrace('Employees API: Deleted employee', {
      endpoint: '/api/employees',
      userId: clientPrincipal.userId,
      employeeId: EE_NO,
    });
    return NextResponse.json({ message: 'Employee deleted successfully' }, { status: 200 });
  } catch (error: any) {
    trackException(error, { endpoint: '/api/employees', action: 'DELETE' });
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2025') {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }
    return NextResponse.json({ error: `Failed to delete employee: ${error.message}` }, { status: 500 });
  }
}