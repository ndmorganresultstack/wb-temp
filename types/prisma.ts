// app/types/prisma.ts
import { PrismaClient } from '@prisma/client';

declare module '@prisma/client' {
  export interface CustomPrismaClient extends PrismaClient {
    internalLabor: PrismaClient['internalLabor'];
    externalLabor: PrismaClient['externalLabor'];
    employees: PrismaClient['employees'];
    // Add other models as needed
  }
}

export type PrismaModelName = 'InternalLabor' | 'ExternalLabor' | 'Employees' ;
export type PrismaModelDelegate = {
  [K in PrismaModelName]: K extends 'InternalLabor'
    ? PrismaClient['internalLaborDelegate']
    : K extends 'ExternalLabor'
    ? PrismaClient['externalLaborDelegate']
    : K extends 'Employees'
    ? PrismaClient['employeesDelegate']
    : never;
}[PrismaModelName];

export interface SelectOption {
  value: string;
  label: string;
}