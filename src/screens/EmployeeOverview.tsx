import React, { useState, useEffect } from "react";
import { Users, LayoutGrid, ArrowRight, UserCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { DashboardLayout } from "./Dashboard/DashboardLayout";

// Database Employee type that matches our Prisma schema
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

export const EmployeeOverview = () => {
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<any>({
    type: "Regular Employee",
    name: "",
    email: "",
    phone: "",
    role: "",
    department: "",
    hourlyRate: "",
    contractDuration: "",
    paymentTerms: "",
    description: "",
  });
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch employees from backend
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/employees');
      if (!response.ok) {
        throw new Error('Failed to fetch employees');
      }
      const data = await response.json();
      setEmployees(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);
  const handleChange = (k: string, v: any) => setForm({ ...form, [k]: v });

  const handleSubmit = async () => {
    try {
      setActionLoading(true);
      
      // Prepare the employee data according to our database schema
      const employeeData = {
        employee_id: `EMP-${Math.floor(Math.random() * 9000) + 1000}`,
        name: form.name,
        role: form.role,
        department: form.department || "Sales",
        phone: form.phone,
        email: form.email,
        joined_date: new Date().toISOString(),
        status: "Active",
        pay_type: form.type === "Hourly Employee" ? "hourly" : "salary",
        salary: form.type === "Regular Employee" ? Number(form.hourlyRate) * 40 * 52 : null, // Calculate annual salary
        hourly_rate: form.type === "Hourly Employee" ? Number(form.hourlyRate) : null,
        preferred_day_off: "Friday",
        default_shift: "09:00 AM - 05:00 PM",
      };

      const response = await fetch('/api/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create employee');
      }

      // Refresh the employee list
      await fetchEmployees();
      
      // Reset form and close modal
      setShowModal(false);
      setStep(1);
      setForm({ type: "Regular Employee", name: "", email: "", phone: "", role: "", department: "", hourlyRate: "", contractDuration: "", paymentTerms: "", description: "" });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err: any) {
      console.error('Error creating employee:', err);
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout pageTitle="Employee Overview">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading employees...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout pageTitle="Employee Overview">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500 text-lg">Error: {error}</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle="Employee Overview">
      {success && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded shadow-lg text-lg font-semibold transition-all">
          Employee added successfully!
        </div>
      )}
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-400 mb-6">
        <span>Dashboard</span>
        <span className="mx-2">&gt;</span>
        <span className="text-[#335CFF] font-semibold">Employee Overview</span>
      </div>

      {/* Top Section */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        {/* Add New Employee */}
        <div className="col-span-1 bg-[#335CFF] rounded-xl p-6 flex flex-col justify-between text-white cursor-pointer" onClick={() => setShowModal(true)}>
          <div className="flex items-center gap-3 mb-8">
            <Users className="w-8 h-8" />
            <span className="font-bold text-lg">Add New Employee</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm opacity-80">Quickly add new employee here</span>
            <ArrowRight className="w-6 h-6" />
          </div>
        </div>
        {/* Check Payroll Reports */}
        <div className="col-span-1 bg-[#EEF4FF] rounded-xl p-6 flex flex-col justify-between text-[#335CFF] cursor-pointer">
          <div className="flex items-center gap-3 mb-8">
            <LayoutGrid className="w-8 h-8" />
            <span className="font-bold text-lg">Check Payroll Reports</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm opacity-80">See detailed employee payroll report</span>
            <ArrowRight className="w-6 h-6" />
          </div>
        </div>
        {/* Employee Count */}
        <div className="col-span-1 bg-white rounded-xl p-6 flex flex-col justify-between border border-[#F0F0F0]">
          <span className="text-xs text-gray-400 mb-2">Employee Count</span>
          <span className="text-3xl font-bold mb-2">{employees.length}</span>
          <span className="text-xs text-gray-400">3 Joined this month</span>
        </div>
        {/* Currently Active */}
        <div className="col-span-1 bg-white rounded-xl p-6 flex flex-col justify-between border border-[#F0F0F0]">
          <span className="text-xs text-gray-400 mb-2">Currently Active</span>
          <span className="text-3xl font-bold mb-2">{employees.filter(emp => emp.status === 'Active').length}</span>
          <span className="text-xs text-gray-400">Active employees</span>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-3 gap-6">
        {/* Employee Activity */}
        <div className="bg-white rounded-xl p-6 border border-[#F0F0F0] flex flex-col">
          <span className="font-semibold mb-4">Employee Activity</span>
          <div className="mb-4">
            <span className="text-xs text-gray-400">Absent</span>
            <div className="flex items-center gap-3 mt-2">
              <div className="w-8 h-8 rounded-full bg-[#F0F0F0] flex items-center justify-center">
                <UserCircle className="w-6 h-6 text-gray-400" />
              </div>
              <div>
                <div className="font-semibold">Ayesha Rahman</div>
                <div className="text-xs text-gray-400">Store Supervisor</div>
              </div>
              <span className="ml-auto px-3 py-1 rounded-full bg-[#FFEEF0] text-[#FF4D4F] text-xs font-semibold">Absent</span>
            </div>
          </div>
          <div>
            <span className="text-xs text-gray-400">On Leave</span>
            <div className="flex flex-col gap-2 mt-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#F0F0F0] flex items-center justify-center">
                  <UserCircle className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <div className="font-semibold">Sohel Mia</div>
                  <div className="text-xs text-gray-400">Cashier</div>
                </div>
                <span className="ml-auto px-3 py-1 rounded-full bg-[#FFF8E1] text-[#FFC107] text-xs font-semibold">On Leave</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#F0F0F0] flex items-center justify-center">
                  <UserCircle className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <div className="font-semibold">Jannatul Ferdous</div>
                  <div className="text-xs text-gray-400">Sales Associate</div>
                </div>
                <span className="ml-auto px-3 py-1 rounded-full bg-[#FFF8E1] text-[#FFC107] text-xs font-semibold">On Leave</span>
              </div>
            </div>
          </div>
        </div>
        {/* Top Performers This Week */}
        <div className="bg-white rounded-xl p-6 border border-[#F0F0F0] flex flex-col">
          <span className="font-semibold mb-4">Top Performers This Week</span>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 flex items-center justify-center font-bold text-[#B0B7C3]">1</span>
              <div>
                <div className="font-semibold">Ayesha Rahman</div>
                <div className="text-xs text-gray-400">Store Supervisor</div>
              </div>
              <span className="ml-auto font-bold">100%</span>
              <span className="ml-2 text-xs text-gray-400">42 hrs Logged</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 flex items-center justify-center font-bold text-[#B0B7C3]">2</span>
              <div>
                <div className="font-semibold">Sohel Mia</div>
                <div className="text-xs text-gray-400">Cashier</div>
              </div>
              <span className="ml-auto font-bold">100%</span>
              <span className="ml-2 text-xs text-gray-400">41.5 hrs Logged</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 flex items-center justify-center font-bold text-[#B0B7C3]">3</span>
              <div>
                <div className="font-semibold">Ayesha Rahman</div>
                <div className="text-xs text-gray-400">Store Supervisor</div>
              </div>
              <span className="ml-auto font-bold">99%</span>
              <span className="ml-2 text-xs text-gray-400">41 hrs Logged</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 flex items-center justify-center font-bold text-[#B0B7C3]">4</span>
              <div>
                <div className="font-semibold">Ayesha Rahman</div>
                <div className="text-xs text-gray-400">Store Supervisor</div>
              </div>
              <span className="ml-auto font-bold">98%</span>
              <span className="ml-2 text-xs text-gray-400">40 hrs Logged</span>
            </div>
          </div>
        </div>
        {/* Attendance Info */}
        <div className="bg-white rounded-xl p-6 border border-[#F0F0F0] flex flex-col items-center">
          <span className="font-semibold mb-4 self-start">Attendance Info</span>
          <svg width="120" height="120" viewBox="0 0 36 36" className="mb-4">
            <circle cx="18" cy="18" r="16" fill="#F5F6FA" />
            <path d="M18 2 a 16 16 0 1 1 0 32" fill="none" stroke="#335CFF" strokeWidth="4" strokeDasharray="87 13" />
          </svg>
          <span className="text-3xl font-bold mb-2">87%</span>
          <span className="text-xs text-gray-400 mb-4">Attendance</span>
          <div className="flex gap-4 mt-auto">
            <span className="flex items-center gap-1 text-xs"><span className="w-2 h-2 rounded-full bg-[#335CFF] inline-block" />Present</span>
            <span className="flex items-center gap-1 text-xs"><span className="w-2 h-2 rounded-full bg-[#FF4D4F] inline-block" />Absent</span>
            <span className="flex items-center gap-1 text-xs"><span className="w-2 h-2 rounded-full bg-[#FFD600] inline-block" />Sick</span>
            <span className="flex items-center gap-1 text-xs"><span className="w-2 h-2 rounded-full bg-[#B0B7C3] inline-block" />Day-off</span>
          </div>
        </div>
      </div>

      {/* Employees Overview Table Section */}
      <h2 className="text-xl font-semibold mb-6">Employees Overview</h2>
      <div className="bg-white rounded-xl border border-[#F0F0F0] p-6 mb-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div className="flex-1 flex gap-2">
            <input type="text" placeholder="Search using name, id, role" className="border border-[#E5E7EB] rounded-lg px-4 py-2 w-full text-sm focus:outline-none" />
            <Button className="bg-[#335CFF] text-white px-8">Search</Button>
          </div>
          <div className="flex gap-2 mt-2 md:mt-0">
            <Button variant="outline" className="text-xs px-4 py-2">Role</Button>
            <Button variant="outline" className="text-xs px-4 py-2">Status</Button>
            <Button variant="outline" className="text-xs px-4 py-2">Last 7 Days</Button>
            <Button variant="outline" className="text-xs px-4 py-2">20th Feb</Button>
            <span className="text-xs text-gray-400">-</span>
            <Button variant="outline" className="text-xs px-4 py-2">27th Feb</Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b">
                <th className="py-3 px-4 font-semibold">Name</th>
                <th className="py-3 px-4 font-semibold">Employee ID</th>
                <th className="py-3 px-4 font-semibold">Role</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Shift Time</th>
                <th className="py-3 px-4 font-semibold">Attendance %</th>
                <th className="py-3 px-4 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp, idx) => (
                <tr key={emp.employee_id} className="border-b hover:bg-[#F7F8FA]">
                  <td className="py-3 px-4 text-[#335CFF] font-semibold cursor-pointer">{emp.name}</td>
                  <td className="py-3 px-4">{emp.employee_id}</td>
                  <td className="py-3 px-4">{emp.role}</td>
                  <td className="py-3 px-4">
                    {emp.status === "Active" && <span className="px-3 py-1 rounded-full bg-[#E6F9F0] text-[#00B96B] font-semibold text-xs">Active</span>}
                    {emp.status === "Absent" && <span className="px-3 py-1 rounded-full bg-[#FFEEF0] text-[#FF4D4F] font-semibold text-xs">Absent</span>}
                    {emp.status === "On Leave" && <span className="px-3 py-1 rounded-full bg-[#FFF8E1] text-[#FFC107] font-semibold text-xs">On Leave</span>}
                  </td>
                  <td className="py-3 px-4">{emp.default_shift}</td>
                  <td className="py-3 px-4">93%</td>
                  <td className="py-3 px-4">
                    <Button className="bg-[#EEF4FF] text-[#335CFF] px-4 py-1 text-xs font-semibold">View Profile</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Add New Employee */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative p-0 overflow-hidden">
            <button className="absolute top-6 right-6 text-2xl text-gray-400 hover:text-black" onClick={() => setShowModal(false)}>&times;</button>
            <div className="p-8 pt-12">
              {/* Stepper */}
              <div className="flex items-center gap-2 mb-8">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step>=1?"bg-[#335CFF] text-white":"bg-gray-200 text-gray-400"}`}>1</div>
                <span className={step>=1?"text-[#335CFF] font-semibold":"text-gray-400"}>Employee Type</span>
                <span className="mx-2">&gt;</span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step>=2?"bg-[#335CFF] text-white":"bg-gray-200 text-gray-400"}`}>2</div>
                <span className={step>=2?"text-[#335CFF] font-semibold":"text-gray-400"}>Personal Info</span>
                <span className="mx-2">&gt;</span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step>=3?"bg-[#335CFF] text-white":"bg-gray-200 text-gray-400"}`}>3</div>
                <span className={step>=3?"text-[#335CFF] font-semibold":"text-gray-400"}>Contract</span>
                <span className="mx-2">&gt;</span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step>=4?"bg-[#335CFF] text-white":"bg-gray-200 text-gray-400"}`}>4</div>
                <span className={step>=4?"text-[#335CFF] font-semibold":"text-gray-400"}>Review</span>
              </div>
              {/* Step 1: Employee Type */}
              {step===1 && (
                <div>
                  <div className="text-center text-xl font-semibold mb-8">What type of employee is this?</div>
                  <div className="flex gap-6 justify-center mb-8">
                    {["Regular Employee","Hourly Employee","Contractual Employee"].map((type) => (
                      <div key={type} className={`flex-1 border rounded-xl p-6 flex flex-col items-center cursor-pointer ${form.type===type?"border-[#335CFF] bg-[#F5F8FF]":"border-[#E5E7EB] bg-white"}`} onClick={()=>handleChange("type",type)}>
                        <UserCircle className={`w-10 h-10 mb-4 ${form.type===type?"text-[#335CFF]":"text-gray-400"}`} />
                        <div className="font-bold mb-1 text-center">{type}</div>
                        <div className="text-xs text-gray-400 mb-4 text-center">
                          {type==="Regular Employee" && "Full-time employees eligible for benefits."}
                          {type==="Hourly Employee" && "Part-time employees paid by the hour."}
                          {type==="Contractual Employee" && "Independent contractors without benefits."}
                        </div>
                        <Button className={form.type===type?"bg-[#335CFF] text-white w-full":"bg-white text-[#335CFF] border border-[#335CFF] w-full"}>Edit Information</Button>
                        {form.type===type && <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#335CFF] flex items-center justify-center text-white"><svg width="16" height="16" fill="none"><circle cx="8" cy="8" r="8" fill="#335CFF"/><path d="M5 8l2 2 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></div>}
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-8">
                    <Button variant="outline" className="w-32" onClick={()=>setShowModal(false)}>Back</Button>
                    <Button className="w-32 bg-[#335CFF] text-white" onClick={handleNext}>Next &rarr;</Button>
                  </div>
                </div>
              )}
              {/* Step 2: Personal Info */}
              {step===2 && (
                <div>
                  <div className="text-center text-xl font-semibold mb-8">Please enter the employee's basic details.</div>
                  <div className="flex flex-col gap-4 mb-8">
                    <input className="border rounded-lg px-4 py-2" placeholder="Name*" value={form.name} onChange={e=>handleChange("name",e.target.value)} />
                    <input className="border rounded-lg px-4 py-2" placeholder="Email*" value={form.email} onChange={e=>handleChange("email",e.target.value)} />
                    <input className="border rounded-lg px-4 py-2" placeholder="Phone Number*" value={form.phone} onChange={e=>handleChange("phone",e.target.value)} />
                    <input className="border rounded-lg px-4 py-2" placeholder="Role*" value={form.role} onChange={e=>handleChange("role",e.target.value)} />
                    <input className="border rounded-lg px-4 py-2" placeholder="Department*" value={form.department} onChange={e=>handleChange("department",e.target.value)} />
                  </div>
                  <div className="flex justify-between mt-8">
                    <Button variant="outline" className="w-32" onClick={handleBack}>Back</Button>
                    <Button className="w-32 bg-[#335CFF] text-white" onClick={handleNext}>Next &rarr;</Button>
                  </div>
                </div>
              )}
              {/* Step 3: Contract */}
              {step===3 && (
                <div>
                  <div className="text-center text-xl font-semibold mb-8">Please confirm the contractual information</div>
                  <div className="flex flex-col gap-4 mb-8">
                    <input className="border rounded-lg px-4 py-2" placeholder="Hourly Rate" value={form.hourlyRate} onChange={e=>handleChange("hourlyRate",e.target.value)} />
                    <input className="border rounded-lg px-4 py-2" placeholder="Contract Duration*" value={form.contractDuration} onChange={e=>handleChange("contractDuration",e.target.value)} />
                    <input className="border rounded-lg px-4 py-2" placeholder="Payment Terms*" value={form.paymentTerms} onChange={e=>handleChange("paymentTerms",e.target.value)} />
                    <textarea className="border rounded-lg px-4 py-2" placeholder="Description (Optional)" value={form.description} onChange={e=>handleChange("description",e.target.value)} maxLength={200} />
                  </div>
                  <div className="flex justify-between mt-8">
                    <Button variant="outline" className="w-32" onClick={handleBack}>Back</Button>
                    <Button className="w-32 bg-[#335CFF] text-white" onClick={handleNext}>Next &rarr;</Button>
                  </div>
                </div>
              )}
              {/* Step 4: Review */}
              {step===4 && (
                <div>
                  <div className="text-center text-xl font-semibold mb-8">Review and Confirm Details</div>
                  <div className="mb-8">
                    <div className="mb-4"><span className="font-bold">Employee Type Info</span><br/>Employee Type: {form.type}</div>
                    <div className="mb-4"><span className="font-bold">Personal Info</span><br/>Name: {form.name}<br/>Email: {form.email}<br/>Phone: {form.phone}<br/>Role: {form.role}<br/>Department: {form.department}</div>
                    <div className="mb-4"><span className="font-bold">Contractual Info</span><br/>Hourly Rate: {form.hourlyRate}<br/>Contract Duration: {form.contractDuration}<br/>Payment Terms: {form.paymentTerms}<br/>Description: {form.description}</div>
                  </div>
                  <div className="flex justify-between mt-8">
                    <Button variant="outline" className="w-32" onClick={handleBack}>Back</Button>
                    <Button className="w-32 bg-[#335CFF] text-white" onClick={handleSubmit} disabled={actionLoading}>
                      {actionLoading ? 'Creating...' : 'Continue &rarr;'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}; 