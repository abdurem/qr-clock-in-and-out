import { NextResponse } from 'next/server';
import { employees } from '../../sharedMemory';

export function GET(req: Request, { params }: { params: { username: string } }) {
  const { username } = params;

  const employee = employees.find((emp) => emp.username === username);

  if (!employee) {
    return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
  }

  // Toggle clock-in/clock-out status
  employee.status = employee.status === true ? false : true;

  return NextResponse.json({
    message: `Employee ${employee.name} is now clocked ${employee.status ? 'in' : 'out'}`,
    status: employee.status,
  });
}

export function POST(req: Request, context: { params: { username: string } }) {
  const { params } = context;
  const { username } = params;

  const employee = employees.find((emp) => emp.username === username);

  if (!employee) {
    return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
  }

  // Toggle clock-in/clock-out status
  employee.status = employee.status === true ? false : true;

  return NextResponse.json({
    message: `Employee ${employee.name} is now clocked ${employee.status ? 'in' : 'out'}`,
    status: employee.status,
  });
}