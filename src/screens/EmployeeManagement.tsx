import React, { useState, useEffect } from "react";
import { DashboardLayout } from "./Dashboard/DashboardLayout";
import { Button } from "../components/ui/button";
import { UserCircle, MoreVertical } from "lucide-react";

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

const emptyForm: Omit<Employee, "employee_id"> & { employee_id?: string } = {
  name: "",
  role: "",
  department: "",
  phone: "",
  email: "",
  joined_date: "",
  status: "Active",
  pay_type: "salary",
  salary: null,
  hourly_rate: null,
  preferred_day_off: "",
  default_shift: "",
};

export const EmployeeManagement = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Employee | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);
  const [form, setForm] = useState<typeof emptyForm>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch employees from backend
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/employees");
      if (!response.ok) {
        throw new Error("Failed to fetch employees");
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

  // Open modal for add or edit
  const openModal = (emp?: Employee) => {
    setFormError(null);
    setEditEmployee(emp || null);
    setForm(
      emp
        ? { ...emp, joined_date: emp.joined_date?.slice(0, 10) }
        : { ...emptyForm }
    );
    setShowModal(true);
  };

  // Handle form input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Add or update employee
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setActionLoading(true);
    try {
      const payload = {
        ...form,
        salary: form.pay_type === "salary" ? Number(form.salary) : null,
        hourly_rate: form.pay_type === "hourly" ? Number(form.hourly_rate) : null,
        joined_date: new Date(form.joined_date).toISOString(),
      };

      let res;
      if (editEmployee) {
        // Update
        res = await fetch(`/api/employees/${editEmployee.employee_id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        // Add
        const newEmployeeData = {
          ...payload,
          employee_id: form.employee_id || `EMP-${Math.floor(Math.random() * 9000) + 1000}`,
        };
        res = await fetch(`/api/employees`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newEmployeeData),
        });
      }
      
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save employee");
      }
      
      setShowModal(false);
      setEditEmployee(null);
      setForm(emptyForm);
      await fetchEmployees(); // Refresh the list
    } catch (err: any) {
      setFormError(err.message);
      console.error('Error saving employee:', err);
    } finally {
      setActionLoading(false);
    }
  };

  // Delete employee
  const handleDelete = async () => {
    if (!deleteId) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/employees/${deleteId}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to delete employee");
      }
      setDeleteId(null);
      await fetchEmployees(); // Refresh the list
    } catch (err: any) {
      setError(err.message);
      console.error('Error deleting employee:', err);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="p-8">Loading employees...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <DashboardLayout pageTitle="Employee Management">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-400 mb-6">
        <span>Dashboard</span>
        <span className="mx-2">&gt;</span>
        <span className="text-[#335CFF] font-semibold">Employee Management</span>
      </div>
      {/* Add Employee Button */}
      <div className="mb-4 flex justify-end">
        <Button className="bg-[#335CFF] text-white px-4 py-2 text-xs font-semibold" onClick={() => openModal()}>Add Employee</Button>
      </div>
      {/* Table */}
      <div className="bg-white rounded-xl border border-[#F0F0F0] overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 border-b">
              <th className="py-3 px-4 font-semibold">Name</th>
              <th className="py-3 px-4 font-semibold">Employee ID</th>
              <th className="py-3 px-4 font-semibold">Role</th>
              <th className="py-3 px-4 font-semibold">Department</th>
              <th className="py-3 px-4 font-semibold">Status</th>
              <th className="py-3 px-4 font-semibold">Pay Type</th>
              <th className="py-3 px-4 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.employee_id} className="border-b hover:bg-[#F7F8FA] cursor-pointer" onClick={() => setSelected(emp)}>
                <td className="py-3 px-4 flex items-center gap-2">
                  <UserCircle className="w-6 h-6 text-gray-400" />
                  <span>{emp.name}</span>
                </td>
                <td className="py-3 px-4">{emp.employee_id}</td>
                <td className="py-3 px-4">{emp.role}</td>
                <td className="py-3 px-4">{emp.department}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    emp.status === 'Active' ? 'bg-[#E6F9F0] text-[#00B96B]' :
                    emp.status === 'On Leave' ? 'bg-[#FFF8E1] text-[#FFC107]' :
                    'bg-[#FFEEF0] text-[#FF4D4F]'
                  }`}>
                    {emp.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-xs text-gray-600">
                    {emp.pay_type === 'salary' ? 'Salary' : 'Hourly'}
                  </span>
                </td>
                <td className="py-3 px-4 flex gap-2">
                  <Button className="bg-[#EEF4FF] text-[#335CFF] px-3 py-1 text-xs font-semibold" onClick={e => { e.stopPropagation(); openModal(emp); }}>Edit</Button>
                  <Button className="bg-[#FFEEF0] text-[#FF4D4F] px-3 py-1 text-xs font-semibold" onClick={e => { e.stopPropagation(); setDeleteId(emp.employee_id); }}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative p-0 overflow-hidden">
            <button className="absolute top-6 right-6 text-2xl text-gray-400 hover:text-black" onClick={() => setShowModal(false)}>&times;</button>
            <form className="p-8 pt-12" onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-xs font-semibold mb-1">Employee ID</label>
                <input className="w-full border rounded px-3 py-2 text-sm" name="employee_id" value={form.employee_id || ""} onChange={handleChange} required={!editEmployee} disabled={!!editEmployee} />
              </div>
              <div className="mb-4">
                <label className="block text-xs font-semibold mb-1">Name</label>
                <input className="w-full border rounded px-3 py-2 text-sm" name="name" value={form.name} onChange={handleChange} required />
              </div>
              <div className="mb-4">
                <label className="block text-xs font-semibold mb-1">Role</label>
                <input className="w-full border rounded px-3 py-2 text-sm" name="role" value={form.role} onChange={handleChange} required />
              </div>
              <div className="mb-4">
                <label className="block text-xs font-semibold mb-1">Department</label>
                <input className="w-full border rounded px-3 py-2 text-sm" name="department" value={form.department} onChange={handleChange} required />
              </div>
              <div className="mb-4">
                <label className="block text-xs font-semibold mb-1">Phone</label>
                <input className="w-full border rounded px-3 py-2 text-sm" name="phone" value={form.phone} onChange={handleChange} required />
              </div>
              <div className="mb-4">
                <label className="block text-xs font-semibold mb-1">Email</label>
                <input className="w-full border rounded px-3 py-2 text-sm" name="email" value={form.email} onChange={handleChange} required />
              </div>
              <div className="mb-4">
                <label className="block text-xs font-semibold mb-1">Joined Date</label>
                <input type="date" className="w-full border rounded px-3 py-2 text-sm" name="joined_date" value={form.joined_date} onChange={handleChange} required />
              </div>
              <div className="mb-4">
                <label className="block text-xs font-semibold mb-1">Status</label>
                <select className="w-full border rounded px-3 py-2 text-sm" name="status" value={form.status} onChange={handleChange} required>
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Absent">Absent</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-xs font-semibold mb-1">Pay Type</label>
                <select className="w-full border rounded px-3 py-2 text-sm" name="pay_type" value={form.pay_type} onChange={handleChange} required>
                  <option value="salary">Salary</option>
                  <option value="hourly">Hourly</option>
                </select>
              </div>
              {form.pay_type === "salary" && (
                <div className="mb-4">
                  <label className="block text-xs font-semibold mb-1">Annual Salary</label>
                  <input className="w-full border rounded px-3 py-2 text-sm" name="salary" value={form.salary ?? ""} onChange={handleChange} type="number" min="0" />
                </div>
              )}
              {form.pay_type === "hourly" && (
                <div className="mb-4">
                  <label className="block text-xs font-semibold mb-1">Hourly Rate</label>
                  <input className="w-full border rounded px-3 py-2 text-sm" name="hourly_rate" value={form.hourly_rate ?? ""} onChange={handleChange} type="number" min="0" />
                </div>
              )}
              <div className="mb-4">
                <label className="block text-xs font-semibold mb-1">Preferred Day Off</label>
                <input className="w-full border rounded px-3 py-2 text-sm" name="preferred_day_off" value={form.preferred_day_off} onChange={handleChange} required />
              </div>
              <div className="mb-4">
                <label className="block text-xs font-semibold mb-1">Default Shift</label>
                <input className="w-full border rounded px-3 py-2 text-sm" name="default_shift" value={form.default_shift} onChange={handleChange} required />
              </div>
              {formError && <div className="text-red-500 text-xs mb-2">{formError}</div>}
              <div className="flex justify-end gap-2 mt-4">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type="submit" className="bg-[#335CFF] text-white px-4 py-2 text-xs font-semibold" disabled={actionLoading}>
                  {actionLoading ? 'Saving...' : (editEmployee ? "Update" : "Add") + " Employee"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative p-0 overflow-hidden">
            <div className="p-8">
              <h2 className="text-lg font-semibold mb-4">Delete Employee</h2>
              <p className="mb-6">Are you sure you want to delete this employee?</p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
                <Button className="bg-[#FF4D4F] text-white px-4 py-2 text-xs font-semibold" onClick={handleDelete} disabled={actionLoading}>
                  {actionLoading ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Employee Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl relative p-0 overflow-hidden">
            <button className="absolute top-6 right-6 text-2xl text-gray-400 hover:text-black" onClick={() => setSelected(null)}>&times;</button>
            <div className="flex flex-col md:flex-row gap-8 p-8 pt-12">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                    <UserCircle className="w-10 h-10 text-gray-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-lg">{selected.name}</span>
                      <span className={`ml-2 px-3 py-1 rounded-full font-semibold text-xs ${
                        selected.status === 'Active' ? 'bg-[#E6F9F0] text-[#00B96B]' :
                        selected.status === 'On Leave' ? 'bg-[#FFF8E1] text-[#FFC107]' :
                        'bg-[#FFEEF0] text-[#FF4D4F]'
                      }`}>
                        {selected.status}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 flex gap-4">
                      <span>Employee ID: {selected.employee_id}</span>
                      <span>Role: {selected.role}</span>
                      <span>Department: {selected.department}</span>
                      <span>Joined: {selected.joined_date?.slice(0, 10)}</span>
                    </div>
                  </div>
                </div>
                {/* Employee Details */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Contact Information</h3>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Phone:</span> {selected.phone}</div>
                      <div><span className="font-medium">Email:</span> {selected.email}</div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Employment Details</h3>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Pay Type:</span> {selected.pay_type === 'salary' ? 'Salary' : 'Hourly'}</div>
                      {selected.pay_type === 'salary' && selected.salary && (
                        <div><span className="font-medium">Annual Salary:</span> ${selected.salary.toLocaleString()}</div>
                      )}
                      {selected.pay_type === 'hourly' && selected.hourly_rate && (
                        <div><span className="font-medium">Hourly Rate:</span> ${selected.hourly_rate}/hr</div>
                      )}
                      <div><span className="font-medium">Default Shift:</span> {selected.default_shift}</div>
                      <div><span className="font-medium">Preferred Day Off:</span> {selected.preferred_day_off}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}; 