import React, { useState, useEffect } from "react";
import { DashboardLayout } from "./Dashboard/DashboardLayout";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, BlobProvider, pdf } from "@react-pdf/renderer";
import JSZip from "jszip";

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

export type TaxDocument = {
  tax_doc_id: number;
  employee_id: string;
  tax_year: number;
  total_income: number;
  total_federal_tax: number;
  total_state_tax: number;
  created_on: string;
  file_path: string;
  status: 'approved' | 'pending';
  employee: Employee;
};

const docTypes = [
  "Social Security Tax",
  "Medicare Tax",
  "Idaho State Income Tax",
  "Federal Income Tax",
];

const styles = StyleSheet.create({
  page: { padding: 32, fontSize: 12, fontFamily: 'Helvetica' },
  section: { marginBottom: 16 },
  heading: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  label: { fontWeight: 'bold' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  divider: { borderBottom: '1px solid #ccc', marginVertical: 8 },
});

function TaxDocPDF({ employee, period, payroll }: { employee: Employee, period: string, payroll: any }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.heading}>Employee Tax Statement</Text>
          <View style={styles.row}><Text style={styles.label}>Name:</Text><Text>{employee.name}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Employee ID:</Text><Text>{employee.employee_id}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Role:</Text><Text>{employee.role}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Pay Period:</Text><Text>{period}</Text></View>
        </View>
        <View style={styles.section}>
          <Text style={styles.heading}>Tax Breakdown</Text>
          <View style={styles.row}><Text>Gross Pay:</Text><Text>${payroll.gross}</Text></View>
          <View style={styles.row}><Text>Social Security Tax:</Text><Text>${payroll.socialSecurity}</Text></View>
          <View style={styles.row}><Text>Medicare Tax:</Text><Text>${payroll.medicare}</Text></View>
          <View style={styles.row}><Text>Idaho State Income Tax:</Text><Text>${payroll.idahoTax}</Text></View>
          <View style={styles.row}><Text>Federal Income Tax:</Text><Text>${payroll.federalTax}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Total Tax Withheld:</Text><Text>${payroll.taxes}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Net Pay:</Text><Text>${payroll.net}</Text></View>
        </View>
      </Page>
    </Document>
  );
}

function calculatePayroll(employee: Employee) {
  const FEDERAL_INCOME_TAX_RATE = 0.12;
  const IDAHO_STATE_TAX_RATE = 0.053;
  const SOCIAL_SECURITY_RATE = 0.062;
  const SOCIAL_SECURITY_WAGE_BASE = 160200;
  const MEDICARE_RATE = 0.0145;
  const grossPay = employee.pay_type === 'salary' ? Math.round((employee.salary || 0) / 52) : Math.round((employee.hourly_rate || 0) * 40);
  const socialSecurity = Math.round(Math.min(grossPay, SOCIAL_SECURITY_WAGE_BASE / 52) * SOCIAL_SECURITY_RATE);
  const medicare = Math.round(grossPay * MEDICARE_RATE);
  const idahoTax = ((employee.salary || 0) > 14600) ? Math.round(grossPay * IDAHO_STATE_TAX_RATE) : 0;
  const federalTax = Math.round(grossPay * FEDERAL_INCOME_TAX_RATE);
  const totalTax = socialSecurity + medicare + idahoTax + federalTax;
  const netPay = grossPay - totalTax;
  return { gross: grossPay, socialSecurity, medicare, idahoTax, federalTax, taxes: totalTax, net: netPay };
}

export const LegalDocumentation = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [taxDocuments, setTaxDocuments] = useState<TaxDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [previewEmp, setPreviewEmp] = useState<Employee|null>(null);
  const [showBulkPreview, setShowBulkPreview] = useState(false);
  const [statusMap, setStatusMap] = useState<{[id: string]: string}>({});

  // Fetch data from backend
  const fetchData = async () => {
    try {
      setLoading(true);
      const [employeesRes, taxDocsRes] = await Promise.all([
        fetch('/api/employees'),
        fetch('/api/tax-documents')
      ]);

      if (!employeesRes.ok || !taxDocsRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const [employeesData, taxDocsData] = await Promise.all([
        employeesRes.json(),
        taxDocsRes.json()
      ]);

      setEmployees(employeesData);
      setTaxDocuments(taxDocsData);
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

  const filtered = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.employee_id.toLowerCase().includes(search.toLowerCase())
  );
  const allSelected = selected.length === employees.length;

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };
  const selectAll = () => {
    setSelected(allSelected ? [] : employees.map((e) => e.employee_id));
  };
  const payPeriod = "Current Week";

  // Generate status update for selected employees
  const handleGenerateSelected = async () => {
    const newStatus: {[id: string]: string} = { ...statusMap };
    selected.forEach(id => {
      newStatus[id] = "Ready for Download";
    });
    setStatusMap(newStatus);
    setShowBulkPreview(true);
  };

  // Download all generated PDFs as a zip
  const handleDownloadZip = async () => {
    const zip = new JSZip();
    // Get all employees whose status is 'Ready for Download', regardless of selection
    const toGenerate = employees.filter(e => statusMap[e.employee_id] === "Ready for Download");
    await Promise.all(toGenerate.map(async (emp) => {
      const doc = <TaxDocPDF employee={emp} period={payPeriod} payroll={calculatePayroll(emp)} />;
      const blob = await pdf(doc).toBlob();
      zip.file(`TaxDocument_${emp.employee_id}.pdf`, blob);
    }));
    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);
    const a = document.createElement("a");
    a.href = url;
    a.download = "TaxDocuments_Bulk.zip";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  if (loading) {
    return (
      <DashboardLayout pageTitle="Legal Documentation">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading tax documentation...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout pageTitle="Legal Documentation">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500 text-lg">Error: {error}</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle="Legal Documentation">
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-[#335CFF] border border-[#335CFF] rounded-lg p-6 shadow text-white">
          <div className="text-lg font-semibold mb-2">Social Security Tax</div>
          <div className="text-white text-sm opacity-90">A federal tax that funds retirement and disability benefits. Both employers and employees pay 6.2% of wages up to an annual limit.</div>
        </div>
        <div className="bg-[#335CFF] border border-[#335CFF] rounded-lg p-6 shadow text-white">
          <div className="text-lg font-semibold mb-2">Medicare Tax</div>
          <div className="text-white text-sm opacity-90">A federal tax that funds health insurance for people 65 and older. Both employers and employees pay 1.45% of all wages (no cap).</div>
        </div>
        <div className="bg-[#335CFF] border border-[#335CFF] rounded-lg p-6 shadow text-white">
          <div className="text-lg font-semibold mb-2">Idaho State Income Tax</div>
          <div className="text-white text-sm opacity-90">A state tax on employee income. Idaho has a flat rate of 5.3% for most employees above a certain income threshold.</div>
        </div>
        <div className="bg-[#335CFF] border border-[#335CFF] rounded-lg p-6 shadow text-white">
          <div className="text-lg font-semibold mb-2">Federal Income Tax</div>
          <div className="text-white text-sm opacity-90">A progressive federal tax on employee income. Withheld by employers and paid to the IRS. Rates vary by income and filing status.</div>
        </div>
      </div>
      <div className="mb-8 flex items-center gap-4">
        <input
          className="border rounded px-4 py-2 w-80"
          placeholder="Search employee by name or ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={selectAll}
        >
          {allSelected ? "Deselect All" : "Select All"}
        </button>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          disabled={selected.length === 0}
          onClick={handleGenerateSelected}
        >
          Generate Documents for Selected
        </button>
        <button
          className="bg-blue-50 text-blue-700 px-4 py-2 rounded border border-blue-200"
          // Enable if there is at least one ready document
          disabled={!Object.values(statusMap).some(status => status === "Ready for Download")}
          onClick={handleDownloadZip}
        >
          Download All Ready Documents as ZIP
        </button>
      </div>
      <div className="bg-white rounded-lg shadow border overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b text-gray-500">
              <th className="px-6 py-3 text-left w-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={selectAll}
                />
              </th>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">ID</th>
              <th className="px-6 py-3 text-left">Role</th>
              <th className="px-6 py-3 text-left">Actions</th>
              <th className="px-6 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((emp) => (
              <tr key={emp.employee_id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-3">
                  <input
                    type="checkbox"
                    checked={selected.includes(emp.employee_id)}
                    onChange={() => toggleSelect(emp.employee_id)}
                  />
                </td>
                <td className="px-6 py-3">{emp.name}</td>
                <td className="px-6 py-3">{emp.employee_id}</td>
                <td className="px-6 py-3">{emp.role}</td>
                <td className="px-6 py-3">
                  <button
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded mr-2"
                    onClick={() => { setStatusMap(s => ({ ...s, [emp.employee_id]: "Ready for Download" })); setPreviewEmp(emp); }}
                  >
                    Generate Docs
                  </button>
                  <button
                    className="bg-blue-50 text-blue-700 px-3 py-1 rounded border border-blue-200"
                    onClick={() => setPreviewEmp(emp)}
                    disabled={statusMap[emp.employee_id] !== "Ready for Download"}
                  >
                    Download PDF
                  </button>
                </td>
                <td className="px-6 py-3">
                  <span className={`inline-block px-3 py-1 rounded text-xs font-medium ${statusMap[emp.employee_id] === 'Ready for Download' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                    {statusMap[emp.employee_id] || "Not Generated"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Document Types</h2>
        <ul className="list-disc ml-8 text-gray-700">
          {docTypes.map((type) => (
            <li key={type}>{type}</li>
          ))}
        </ul>
      </div>
      {/* PDF Preview Modal for Individual */}
      {previewEmp && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[600px] max-w-full relative">
            <button className="absolute top-2 right-2 text-gray-500" onClick={() => setPreviewEmp(null)}>✕</button>
            <h2 className="text-xl font-bold mb-4">Tax Document Preview</h2>
            <div className="border rounded mb-4 overflow-auto" style={{height: 400}}>
              <BlobProvider document={<TaxDocPDF employee={previewEmp} period={payPeriod} payroll={calculatePayroll(previewEmp)} />}>
                {({ url, loading }: { url: string | null; loading: boolean }) =>
                  loading ? "Loading preview..." : (
                    url ? (
                      <iframe
                        src={url || undefined}
                        title="PDF Preview"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                      />
                    ) : null
                  )
                }
              </BlobProvider>
            </div>
            <PDFDownloadLink
              document={<TaxDocPDF employee={previewEmp} period={payPeriod} payroll={calculatePayroll(previewEmp)} />}
              fileName={`TaxDocument_${previewEmp.employee_id}.pdf`}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Download PDF
            </PDFDownloadLink>
          </div>
        </div>
      )}
      {/* PDF Preview Modal for Bulk */}
      {showBulkPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[700px] max-w-full relative">
            <button className="absolute top-2 right-2 text-gray-500" onClick={() => setShowBulkPreview(false)}>✕</button>
            <h2 className="text-xl font-bold mb-4">Bulk Tax Documents Preview</h2>
            <div className="border rounded mb-4 overflow-auto" style={{height: 400}}>
              <BlobProvider
                document={
                  <Document>
                    {employees.filter(e => selected.includes(e.employee_id)).map(emp => (
                      <TaxDocPDF key={emp.employee_id} employee={emp} period={payPeriod} payroll={calculatePayroll(emp)} />
                    ))}
                  </Document>
                }
              >
                {({ url, loading }: { url: string | null; loading: boolean }) =>
                  loading ? "Loading preview..." : (
                    url ? (
                      <iframe
                        src={url || undefined}
                        title="PDF Preview"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                      />
                    ) : null
                  )
                }
              </BlobProvider>
            </div>
            <PDFDownloadLink
              document={
                <Document>
                  {employees.filter(e => selected.includes(e.employee_id)).map(emp => (
                    <TaxDocPDF key={emp.employee_id} employee={emp} period={payPeriod} payroll={calculatePayroll(emp)} />
                  ))}
                </Document>
              }
              fileName={`TaxDocuments_Bulk.pdf`}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Download All as PDF
            </PDFDownloadLink>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default LegalDocumentation; 