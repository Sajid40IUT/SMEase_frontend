import React from "react";
import { Bell, ChevronDown, Search, LayoutGrid, ClipboardList, Box, Users, UserCircle, Info, Settings } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";

interface DashboardLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
}

export const DashboardLayout = ({ children, pageTitle }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-[280px] bg-[#FAFCFE] p-6 flex flex-col border-r border-[#F0F0F0] min-h-screen sticky top-0 h-screen">
        <div className="flex items-center gap-3.5 mb-12">
          <img className="w-10 h-10" alt="SMEase Logo" src="/image-1.png" />
          <span className="text-2xl font-bold">SMEase</span>
        </div>
        <nav className="flex flex-col gap-2">
          {/* Dashboard */}
          <Button
            variant="ghost"
            className={`justify-start gap-3 h-12 px-4 ${isActive("/dashboard") ? "bg-[#EEF4FF] text-[#335CFF] font-semibold" : "text-[#23272E] font-normal"}`}
            onClick={() => navigate('/dashboard')}
          >
            <LayoutGrid className="w-5 h-5" />
            Dashboard
          </Button>

          {/* Inventory Section */}
          <div className="mt-6 mb-1 text-xs text-[#6B7280] font-semibold px-4">Inventory</div>
          <Button
            variant="ghost"
            className={`justify-start gap-3 h-12 px-4 ${isActive("/inventory-overview") ? "bg-[#EEF4FF] text-[#335CFF] font-semibold" : "text-[#23272E] font-normal"}`}
            onClick={() => navigate('/inventory-overview')}
          >
            <ClipboardList className="w-5 h-5 text-[#8A94A6]" />
            Inventory Overview
          </Button>
          <Button
            variant="ghost"
            className={`justify-start gap-3 h-12 px-4 ${isActive("/inventory-management") ? "bg-[#EEF4FF] text-[#335CFF] font-semibold" : "text-[#23272E] font-normal"}`}
            onClick={() => navigate('/inventory-management')}
          >
            <Box className="w-5 h-5 text-[#8A94A6]" />
            Inventory Management
          </Button>

          {/* Employee Section */}
          <div className="mt-6 mb-1 text-xs text-[#6B7280] font-semibold px-4">Employee</div>
          <Button
            variant="ghost"
            className={`justify-start gap-3 h-12 px-4 ${isActive("/employee-overview") ? "bg-[#EEF4FF] text-[#335CFF] font-semibold" : "text-[#23272E] font-normal"}`}
            onClick={() => navigate('/employee-overview')}
          >
            <ClipboardList className="w-5 h-5 text-[#8A94A6]" />
            Employee Overview
          </Button>
          <Button
            variant="ghost"
            className={`justify-start gap-3 h-12 px-4 ${isActive("/employee-management") ? "bg-[#EEF4FF] text-[#335CFF] font-semibold" : "text-[#23272E] font-normal"}`}
            onClick={() => navigate('/employee-management')}
          >
            <Users className="w-5 h-5 text-[#8A94A6]" />
            Employee Management
          </Button>

          {/* Separator */}
          <div className="mt-6 border-b border-[#E5E7EB]" />

          {/* Payroll & Legal Section */}
          <div className="mt-6 mb-1 text-xs text-[#6B7280] font-semibold px-4">Payroll & Legal</div>
          <Button
            variant="ghost"
            className={`justify-start gap-3 h-12 px-4 ${isActive("/payroll-distribution") ? "bg-[#EEF4FF] text-[#335CFF] font-semibold" : "text-[#23272E] font-normal"}`}
            onClick={() => navigate('/payroll-distribution')}
          >
            <Users className="w-5 h-5 text-[#8A94A6]" />
            Payroll Distribution
          </Button>
          <Button
            variant="ghost"
            className={`justify-start gap-3 h-12 px-4 ${isActive("/legal-documentation") ? "bg-[#EEF4FF] text-[#335CFF] font-semibold" : "text-[#23272E] font-normal"}`}
            onClick={() => navigate('/legal-documentation')}
          >
            <ClipboardList className="w-5 h-5 text-[#8A94A6]" />
            Legal Documentation
          </Button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-[#F7F8FA] p-0">
        {/* Top Header */}
        <div className="w-full flex items-center justify-between px-10 py-6 border-b border-[#E5E7EB] bg-white">
          <h1 className="text-2xl font-bold">{pageTitle || "Dashboard"}</h1>
          <div className="flex-1 flex justify-center">
            <div className="relative w-[400px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input 
                className="w-full pl-10 h-11 bg-[#F5F6FA] border-none rounded-lg text-base placeholder:text-[#B0B7C3]" 
                placeholder="Search" 
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Info className="w-6 h-6 text-gray-400 cursor-pointer" />
            <Settings className="w-6 h-6 text-gray-400 cursor-pointer" />
            <Bell className="w-6 h-6 text-gray-400 cursor-pointer" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-[#335CFF] bg-[#EEF4FF] flex items-center justify-center">
                <UserCircle className="w-8 h-8 text-[#335CFF]" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-sm">Taszid Izaz</span>
                <span className="text-xs text-gray-400">Admin</span>
              </div>
            </div>
          </div>
        </div>
        <div className="px-10 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}; 