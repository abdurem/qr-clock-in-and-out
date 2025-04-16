import { NextResponse } from 'next/server';
import { employees } from '../sharedMemory';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  console.log('Request URL:', req.url);
  console.log('Search Params:', searchParams.toString());

  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 });
  }

  const employee = employees.find((emp) => emp.username === username);

  if (!employee) {
    return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
  }

  const url = new URL(req.url);
  const clockInOutRoute = `${url.origin}/api/clock/${username}`;

  return NextResponse.json({
    message: 'Route generated',
    route: clockInOutRoute,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, username } = body;

    if (!name || !username) {
      return NextResponse.json({ error: 'All fields (id, name, username) are required' }, { status: 400 });
    }

    const existingEmployee = employees.find((emp) => emp.username === username);

    if (existingEmployee) {
      return NextResponse.json({ error: 'Employee with this username already exists' }, { status: 409 });
    }

    employees.push({ id: employees.length + 1, name, username, _status: false });

    return NextResponse.json({ message: 'Employee registered successfully', employee: { id: employees.length, name, username } });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}