import React from "react";
import { Bell, ChevronDown, Search, LayoutGrid, ClipboardList, Box, Users, UserCircle, Info, Settings } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "./DashboardLayout";

export const Dashboard = () => {
  const navigate = useNavigate();
  return (
    <DashboardLayout pageTitle="Dashboard">
      {/* Platform Overview Section */}
      <h2 className="text-xl font-semibold mb-6">Platform Overview</h2>
      <div className="grid grid-cols-4 gap-6 mb-12">
        {/* Stat Card 1 */}
        <div className="bg-white rounded-xl p-6 border border-[#F0F0F0] flex flex-col min-h-[140px]">
          <span className="text-xs text-gray-400 mb-2">Total Inventory Items</span>
          <span className="text-3xl font-bold mb-2">14,568</span>
          <span className="text-xs text-gray-400">Total Hours this week</span>
        </div>
        {/* Stat Card 2 */}
        <div className="bg-white rounded-xl p-6 border border-[#F0F0F0] flex flex-col min-h-[140px]">
          <span className="text-xs text-gray-400 mb-2">Weekly Employee Present</span>
          <span className="text-3xl font-bold mb-2">145</span>
          {/* Placeholder for bar chart */}
          <div className="flex items-end gap-1 mt-2 mb-1 h-10">
            {[4, 6, 5, 3, 2, 4, 5].map((v, i) => (
              <div key={i} className="w-4 rounded bg-[#B0B7C3]" style={{height: `${v * 6}px`}} />
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((d) => <span key={d}>{d}</span>)}
                </div>
              </div>
        {/* Stat Card 3 */}
        <div className="bg-white rounded-xl p-6 border border-[#F0F0F0] flex flex-col min-h-[140px]">
          <span className="text-xs text-gray-400 mb-2">Attendance Info</span>
          {/* Placeholder for circular chart */}
          <div className="flex items-center gap-3">
            <svg width="60" height="60" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="16" fill="#F5F6FA" />
              <path d="M18 2 a 16 16 0 1 1 0 32" fill="none" stroke="#335CFF" strokeWidth="4" strokeDasharray="87 13" />
            </svg>
            <div className="flex flex-col">
              <span className="text-2xl font-bold">87%</span>
              <span className="text-xs text-gray-400">Attendance</span>
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            <span className="flex items-center gap-1 text-xs"><span className="w-2 h-2 rounded-full bg-[#335CFF] inline-block" />Present</span>
            <span className="flex items-center gap-1 text-xs"><span className="w-2 h-2 rounded-full bg-[#FF4D4F] inline-block" />Absent</span>
            <span className="flex items-center gap-1 text-xs"><span className="w-2 h-2 rounded-full bg-[#FFD600] inline-block" />Sick</span>
            <span className="flex items-center gap-1 text-xs"><span className="w-2 h-2 rounded-full bg-[#B0B7C3] inline-block" />Day-off</span>
              </div>
            </div>
        {/* Stat Card 4 */}
        <div className="bg-white rounded-xl p-6 border border-[#F0F0F0] flex flex-col min-h-[140px]">
          <span className="text-xs text-gray-400 mb-2">Pending Requests</span>
          <div className="flex gap-2 mb-2">
            <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-[#FFEEF0] text-[#FF4D4F] font-semibold"><span className="w-4 h-4 rounded-full bg-[#FF4D4F] text-white flex items-center justify-center">1</span>leave request</span>
            <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-[#E6F9F0] text-[#00B96B] font-semibold"><span className="w-4 h-4 rounded-full bg-[#00B96B] text-white flex items-center justify-center">2</span>Shift Swap</span>
          </div>
          <Button variant="outline" className="w-24 h-8 text-xs">Details</Button>
        </div>
        {/* Stat Card 5 */}
        <div className="bg-white rounded-xl p-6 border border-[#F0F0F0] flex flex-col min-h-[140px]">
          <span className="text-xs text-gray-400 mb-2">Total Stock</span>
          <span className="text-3xl font-bold mb-2">4568</span>
          <span className="text-xs text-gray-400">Added 345 Items Last Month</span>
              </div>
        {/* Stat Card 6 */}
        <div className="bg-white rounded-xl p-6 border border-[#F0F0F0] flex flex-col min-h-[140px]">
          <span className="text-xs text-gray-400 mb-2">Total Sold</span>
          <span className="text-3xl font-bold mb-2">2689</span>
          <span className="text-xs text-gray-400">Sold 345 Items Last Month</span>
              </div>
        {/* Stat Card 7 */}
        <div className="bg-white rounded-xl p-6 border border-[#F0F0F0] flex flex-col min-h-[140px]">
          <span className="text-xs text-gray-400 mb-2">Employee Count</span>
          <span className="text-3xl font-bold mb-2">68</span>
          <span className="text-xs text-gray-400">3 Joined this month</span>
            </div>
        {/* Stat Card 8 */}
        <div className="bg-white rounded-xl p-6 border border-[#F0F0F0] flex flex-col min-h-[140px]">
          <span className="text-xs text-gray-400 mb-2">Currently Active</span>
          <span className="text-3xl font-bold mb-2">32</span>
          <span className="text-xs text-gray-400">Active hours increased by 2% this month</span>
            </div>
          </div>

      {/* Quick Actions Section */}
      <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
      <div className="grid grid-cols-4 gap-6 mb-12">
        {/* Add New Product */}
        <div className="cursor-pointer border border-[#B1C6FF] rounded-xl p-6 bg-white hover:bg-[#F5F8FF] transition-colors flex flex-col justify-between min-h-[140px]" onClick={() => {}}>
          <Box className="w-8 h-8 text-[#335CFF] mb-6" />
          <div>
            <div className="font-bold text-lg mb-1">Add New Product</div>
            <div className="text-sm text-gray-400 mb-4">Quickly add new inventory items here</div>
            <div className="flex justify-end"><span className="text-2xl text-black">→</span></div>
          </div>
              </div>
        {/* Time Tracking */}
        <div className="cursor-pointer border border-[#B1C6FF] rounded-xl p-6 bg-white hover:bg-[#F5F8FF] transition-colors flex flex-col justify-between min-h-[140px]" onClick={() => {}}>
          <Box className="w-8 h-8 text-[#335CFF] mb-6" />
              <div>
            <div className="font-bold text-lg mb-1">Time Tracking</div>
            <div className="text-sm text-gray-400 mb-4">See all time reports of your employees</div>
            <div className="flex justify-end"><span className="text-2xl text-black">→</span></div>
              </div>
            </div>
        {/* Add New Employee */}
        <div className="cursor-pointer border border-[#B1C6FF] rounded-xl p-6 bg-white hover:bg-[#F5F8FF] transition-colors flex flex-col justify-between min-h-[140px]" onClick={() => {}}>
          <Users className="w-8 h-8 text-[#335CFF] mb-6" />
          <div>
            <div className="font-bold text-lg mb-1">Add New Employee</div>
            <div className="text-sm text-gray-400 mb-4">Quickly add new employee here</div>
            <div className="flex justify-end"><span className="text-2xl text-black">→</span></div>
          </div>
        </div>
        {/* Check Reports */}
        <div className="cursor-pointer border border-[#B1C6FF] rounded-xl p-6 bg-[#F5F8FF] transition-colors flex flex-col justify-between min-h-[140px]" onClick={() => {}}>
          <LayoutGrid className="w-8 h-8 text-[#335CFF] mb-6" />
          <div>
            <div className="font-bold text-lg mb-1">Check Reports</div>
            <div className="text-sm text-gray-400 mb-4">See detailed employee payroll report</div>
            <div className="flex justify-end"><span className="text-2xl text-black">→</span></div>
          </div>
        </div>
      </div>

      {/* Employee Details Section */}
      <h2 className="text-xl font-semibold mb-6">Employee Details</h2>
      <div className="grid grid-cols-5 gap-6 mb-12">
        {[
          { name: "Ayesha Rahman", role: "Store Supervisor", status: "Present", shift: "09:00 AM - 05:00 PM" },
          { name: "Sohel Mia", role: "Cashier", status: "Absent", shift: "10:00 AM - 06:00 PM" },
          { name: "Jannatul Ferdous", role: "Sales Associate", status: "On Leave", shift: "11:00 AM - 07:00 PM" },
          { name: "Rahim Uddin", role: "Inventory Manager", status: "Present", shift: "08:00 AM - 04:00 PM" },
          { name: "Fatema Begum", role: "Store Supervisor", status: "Present", shift: "09:00 AM - 05:00 PM" },
        ].map((emp, idx) => (
          <div key={idx} className="bg-white rounded-xl p-6 border border-[#F0F0F0] flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-[#F0F0F0] flex items-center justify-center mb-3">
              <UserCircle className="w-8 h-8 text-gray-400" />
            </div>
            <div className="font-bold text-lg mb-1">{emp.name}</div>
            <div className="text-xs text-gray-400 mb-2">{emp.role}</div>
            <div className="mb-2">
              {emp.status === "Present" && <span className="px-3 py-1 rounded-full bg-[#E6F9F0] text-[#00B96B] font-semibold text-xs">Present</span>}
              {emp.status === "Absent" && <span className="px-3 py-1 rounded-full bg-[#FFEEF0] text-[#FF4D4F] font-semibold text-xs">Absent</span>}
              {emp.status === "On Leave" && <span className="px-3 py-1 rounded-full bg-[#FFF8E1] text-[#FFC107] font-semibold text-xs">On Leave</span>}
            </div>
            <div className="text-xs text-gray-400">{emp.shift}</div>
          </div>
        ))}
    </div>
    </DashboardLayout>
  );
};
