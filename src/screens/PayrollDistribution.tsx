import React, { useState, useEffect } from "react";
import { DashboardLayout } from "./Dashboard/DashboardLayout";

// Database types that match our Prisma schema
export type Employee = {
  employee_id: string;
  name: string;
  role: string;
  department: string;
  phone: string;
  email: string;
  joined_date: string;
  status: string;
  pay_type: 'salary' | 'hourly';
  salary: number | null;
  hourly_rate: number | null;
  preferred_day_off: string;
  default_shift: string;
};

export type PayrollPeriod = {
  period_id: number;
  start_date: string;
  end_date: string;
  pay_date: string;
};

export type Payslip = {
  payslip_id: number;
  employee_id: string;
  period_id: number;
  gross_salary: number;
  federal_tax: number;
  state_tax: number;
  social_security: number;
  medicare: number;
  other_deductions: number;
  net_pay: number;
  status: 'paid' | 'pending';
  employee: Employee;
  period: PayrollPeriod;
};

// Tax rates (2024/2025)
const FEDERAL_INCOME_TAX_RATE = 0.12; // Simplified for demo, real is progressive
const IDAHO_STATE_TAX_RATE = 0.053; // 5.3% for income over $14,600 (single)
const SOCIAL_SECURITY_RATE = 0.062; // 6.2%
const SOCIAL_SECURITY_WAGE_BASE = 160200; // 2023 limit
const MEDICARE_RATE = 0.0145; // 1.45%

function calculatePayroll(employee: Employee) {
  // Assume weekly pay period
  const grossPay = employee.pay_type === 'salary'
    ? Math.round((employee.salary || 0) / 52)
    : Math.round((employee.hourly_rate || 0) * 40); // Assume 40h/week

  // Social Security (up to wage base)
  const socialSecurity = Math.min(grossPay, SOCIAL_SECURITY_WAGE_BASE / 52) * SOCIAL_SECURITY_RATE;
  // Medicare
  const medicare = grossPay * MEDICARE_RATE;
  // Idaho State Income Tax (simplified: 5.3% of gross if annual > $14,600)
  const idahoTax = ((employee.salary || 0) > 14600) ? grossPay * IDAHO_STATE_TAX_RATE : 0;
  // Federal Income Tax (simplified flat 12%)
  const federalTax = grossPay * FEDERAL_INCOME_TAX_RATE;
  // Total taxes
  const totalTax = socialSecurity + medicare + idahoTax + federalTax;
  // Net pay
  const netPay = grossPay - totalTax;
  return {
    name: employee.name,
    role: employee.role,
    hours: 40,
    gross: grossPay,
    taxes: Math.round(totalTax),
    net: Math.round(netPay),
    status: employee.status === 'Active' ? 'Present' : (employee.status === 'On Leave' ? 'Pending' : 'Not Finalized'),
  };
}

type PayslipRow = ReturnType<typeof calculatePayroll> & { bonus?: number };

export const PayrollDistribution = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [payrollPeriods, setPayrollPeriods] = useState<PayrollPeriod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalPayslip, setModalPayslip] = useState<PayslipRow | null>(null);
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [editPayslip, setEditPayslip] = useState<PayslipRow | null>(null);
  const [bonusInput, setBonusInput] = useState(0);
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Fetch data from backend
  const fetchData = async () => {
    try {
      setLoading(true);
      const [employeesRes, payslipsRes, periodsRes] = await Promise.all([
        fetch('/api/employees'),
        fetch('/api/payslips'),
        fetch('/api/payroll-periods')
      ]);

      if (!employeesRes.ok || !payslipsRes.ok || !periodsRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const [employeesData, payslipsData, periodsData] = await Promise.all([
        employeesRes.json(),
        payslipsRes.json(),
        periodsRes.json()
      ]);

      setEmployees(employeesData);
      setPayslips(payslipsData);
      setPayrollPeriods(periodsData);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const payrollRows = employees.map(calculatePayroll);
  const totalPayroll = payrollRows.reduce((sum, row) => sum + row.gross, 0);
  const totalTax = payrollRows.reduce((sum, row) => sum + row.taxes, 0);
  const pendingPayslips = payrollRows.filter(row => row.status !== 'Present').length;

  const allRoles = Array.from(new Set(employees.map(e => e.role)));
  const allStatuses = ["Present", "Pending", "Not Finalized"];

  // Filtering logic
  const filteredPayroll = payrollRows.filter(row => {
    let pass = true;
    if (roleFilter && row.role !== roleFilter) pass = false;
    if (statusFilter && row.status !== statusFilter) pass = false;
    // Date filtering is a placeholder, as there is no date in row. Add logic if date is available.
    return pass;
  });

  if (loading) {
    return (
      <DashboardLayout pageTitle="Employee Payroll">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading payroll data...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout pageTitle="Employee Payroll">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500 text-lg">Error: {error}</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle="Employee Payroll">
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 shadow border">
          <div className="text-xs text-gray-500 mb-1">Total Payroll (This Period)</div>
          <div className="text-3xl font-bold">${totalPayroll.toLocaleString()}</div>
          <div className="text-xs text-gray-400 mt-1">Gross pay before deductions</div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow border">
          <div className="text-xs text-gray-500 mb-1">Total Tax Withheld</div>
          <div className="text-3xl font-bold">${totalTax.toLocaleString()}</div>
          <div className="text-xs text-gray-400 mt-1">Fed + state income, SS, Medicare, etc.</div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow border">
          <div className="text-xs text-gray-500 mb-1">Next Tax Deposit Due</div>
          <div className="text-2xl font-bold">Oct 5, 2025</div>
          <div className="text-xs text-gray-400 mt-1">Auto-linked to IRS semi-weekly/monthly rules</div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow border flex flex-col justify-between">
          <div>
            <div className="text-xs text-gray-500 mb-1">Pending Payslips</div>
            <div className="text-3xl font-bold">{pendingPayslips}</div>
          </div>
          <button className="mt-2 text-xs text-blue-600 flex items-center gap-1" onClick={() => setShowPendingModal(true)}>See payslips <span>→</span></button>
        </div>
      </div>
      {/* Filter Bar */}
      <div className="flex items-center gap-3 mb-4">
        <select className="border rounded px-3 py-2 text-sm text-gray-700" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
          <option value="">All Roles</option>
          {allRoles.map(role => <option key={role} value={role}>{role}</option>)}
        </select>
        <select className="border rounded px-3 py-2 text-sm text-gray-700" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          {allStatuses.map(status => <option key={status} value={status}>{status}</option>)}
        </select>
        <div className="flex items-center gap-2">
          <input type="date" className="border rounded px-2 py-2 text-sm" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
          <span className="text-gray-400">-</span>
          <input type="date" className="border rounded px-2 py-2 text-sm" value={dateTo} onChange={e => setDateTo(e.target.value)} />
        </div>
        <button className="ml-auto bg-blue-50 text-blue-700 px-4 py-2 rounded flex items-center gap-2 border border-blue-200">
          Export CSV/PDF <span>⇩</span>
        </button>
      </div>
      {/* Payroll Table */}
      <div className="bg-white rounded-lg shadow border overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b text-gray-500">
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Role</th>
              <th className="px-6 py-3 text-left">Hours Worked</th>
              <th className="px-6 py-3 text-left">Gross Pay</th>
              <th className="px-6 py-3 text-left">Taxes</th>
              <th className="px-6 py-3 text-left">Net Pay</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayroll.map((row, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="px-6 py-3">{row.name}</td>
                <td className="px-6 py-3">{row.role}</td>
                <td className="px-6 py-3">{row.hours} hrs</td>
                <td className="px-6 py-3">${row.gross}</td>
                <td className="px-6 py-3">${row.taxes}</td>
                <td className="px-6 py-3">${row.net}</td>
                <td className="px-6 py-3">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${row.status === 'Present' ? 'bg-green-100 text-green-700' : row.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{row.status}</span>
                </td>
                <td className="px-6 py-3">
                  <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded mr-2" onClick={() => { setEditPayslip(row); setBonusInput(row.bonus || 0); }}>Edit</button>
                  <button className="bg-blue-100 text-blue-700 px-3 py-1 rounded" onClick={() => setModalPayslip(row)}>View Payslip</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Payslip Modal */}
      {modalPayslip && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-[400px] max-w-full relative">
            <button className="absolute top-2 right-2 text-gray-500" onClick={() => setModalPayslip(null)}>✕</button>
            <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">Pay Slip</h2>
            <div className="mb-4 border-b pb-4">
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Name:</span>
                <span>{modalPayslip.name}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Role:</span>
                <span>{modalPayslip.role}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Hours Worked:</span>
                <span>{modalPayslip.hours} hrs</span>
              </div>
            </div>
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span>Gross Pay:</span>
                <span className="font-mono">${modalPayslip.gross}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Taxes:</span>
                <span className="font-mono">${modalPayslip.taxes}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Net Pay:</span>
                <span className="font-mono font-bold text-green-700">${modalPayslip.net}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Status:</span>
                <span>{modalPayslip.status}</span>
              </div>
            </div>
            <button
              className="w-full bg-blue-600 text-white py-2 rounded mt-4 hover:bg-blue-700 transition"
              onClick={() => alert(`Payslip emailed to ${modalPayslip.name}`)}
            >
              Email Payslip
            </button>
          </div>
        </div>
      )}
      {/* Pending Payslips Modal */}
      {showPendingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[500px] max-w-full relative">
            <button className="absolute top-2 right-2 text-gray-500" onClick={() => setShowPendingModal(false)}>✕</button>
            <h2 className="text-xl font-bold mb-4 text-blue-700">Pending Payslips</h2>
            <div className="overflow-y-auto max-h-96">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b text-gray-500">
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Role</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {payrollRows.filter(row => row.status !== 'Present').map((row, i) => (
                    <tr key={i} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2">{row.name}</td>
                      <td className="px-4 py-2">{row.role}</td>
                      <td className="px-4 py-2">{row.status}</td>
                      <td className="px-4 py-2">
                        <button className="bg-blue-100 text-blue-700 px-3 py-1 rounded" onClick={() => { setModalPayslip(row); setShowPendingModal(false); }}>View Payslip</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {/* Edit Payslip Modal */}
      {editPayslip && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-[400px] max-w-full relative">
            <button className="absolute top-2 right-2 text-gray-500" onClick={() => setEditPayslip(null)}>✕</button>
            <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">Edit Payslip</h2>
            <div className="mb-4 border-b pb-4">
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Name:</span>
                <span>{editPayslip.name}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Role:</span>
                <span>{editPayslip.role}</span>
              </div>
            </div>
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span>Gross Pay:</span>
                <span className="font-mono">${editPayslip.gross}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Taxes:</span>
                <span className="font-mono">${editPayslip.taxes}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Net Pay:</span>
                <span className="font-mono font-bold text-green-700">${editPayslip.net + bonusInput}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Status:</span>
                <span>{editPayslip.status}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Bonus:</span>
                <input type="number" className="border rounded px-2 py-1 w-24" value={bonusInput} onChange={e => setBonusInput(Number(e.target.value))} />
              </div>
            </div>
            <button
              className="w-full bg-blue-600 text-white py-2 rounded mt-4 hover:bg-blue-700 transition"
              onClick={() => {
                setEditPayslip(null);
              }}
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default PayrollDistribution; 