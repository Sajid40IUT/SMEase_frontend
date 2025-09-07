import React, { useState, useEffect } from "react";
import { DashboardLayout } from "./Dashboard/DashboardLayout";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { PlusCircle, Edit, Trash2, X } from "lucide-react";

// Database types that match our Prisma schema
export type Supplier = {
  supplier_id: number;
  name: string;
  contact: string;
  email: string;
};

export type Product = {
  upc: string;
  name: string;
  stock: number;
  sold: number;
  min_stock: number;
  supplier_id: number;
  supplier: Supplier;
};

const emptyForm = {
  upc: "",
  name: "",
  stock: "",
  sold: "",
  minStock: "",
  supplierName: "",
  supplierContact: "",
  supplierEmail: "",
};

export const InventoryManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<any>(emptyForm);
  const [formError, setFormError] = useState("");
  const [showDelete, setShowDelete] = useState<{ product: Product | null; open: boolean }>({ product: null, open: false });
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Open modal for add or edit
  const openModal = (product?: Product) => {
    setFormError("");
    setEditProduct(product || null);
    if (product) {
      setForm({
        upc: product.upc,
        name: product.name,
        stock: product.stock.toString(),
        sold: product.sold.toString(),
        minStock: product.min_stock.toString(),
        supplierName: product.supplier.name,
        supplierContact: product.supplier.contact,
        supplierEmail: product.supplier.email,
      });
    } else {
      setForm(emptyForm);
    }
    setShowModal(true);
  };

  // Handle form input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Add or update product
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setActionLoading(true);

    try {
      if (!form.upc || !form.name || !form.stock || !form.sold || !form.minStock || !form.supplierName || !form.supplierContact || !form.supplierEmail) {
        setFormError("All fields are required.");
        return;
      }

      if (editProduct) {
        // Update existing product
        // First update the supplier
        const supplierResponse = await fetch(`/api/suppliers/${editProduct.supplier.supplier_id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: form.supplierName,
            contact: form.supplierContact,
            email: form.supplierEmail,
          }),
        });

        if (!supplierResponse.ok) {
          const err = await supplierResponse.json();
          throw new Error(err.error || 'Failed to update supplier');
        }

        // Then update the product
        const productResponse = await fetch(`/api/products/${editProduct.upc}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: form.name,
            stock: parseInt(form.stock, 10),
            sold: parseInt(form.sold, 10),
            min_stock: parseInt(form.minStock, 10),
          }),
        });

        if (!productResponse.ok) {
          const err = await productResponse.json();
          throw new Error(err.error || 'Failed to update product');
        }
      } else {
        // Create new product
        // Check if UPC already exists
        if (products.some((p) => p.upc === form.upc)) {
          setFormError("UPC must be unique.");
          return;
        }

        // First create the supplier
        const supplierResponse = await fetch('/api/suppliers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: form.supplierName,
            contact: form.supplierContact,
            email: form.supplierEmail,
          }),
        });

        if (!supplierResponse.ok) {
          const err = await supplierResponse.json();
          throw new Error(err.error || 'Failed to create supplier');
        }

        const supplier = await supplierResponse.json();

        // Then create the product
        const productResponse = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            upc: form.upc,
            name: form.name,
            stock: parseInt(form.stock, 10),
            sold: parseInt(form.sold, 10),
            min_stock: parseInt(form.minStock, 10),
            supplier_id: supplier.supplier_id,
          }),
        });

        if (!productResponse.ok) {
          const err = await productResponse.json();
          throw new Error(err.error || 'Failed to create product');
        }
      }

      // Refresh the product list
      await fetchProducts();
      
      // Reset form and close modal
      setShowModal(false);
      setEditProduct(null);
      setForm(emptyForm);
    } catch (err: any) {
      setFormError(err.message);
      console.error('Error saving product:', err);
    } finally {
      setActionLoading(false);
    }
  };

  // Delete product
  const handleDelete = async () => {
    if (!showDelete.product) return;
    setActionLoading(true);
    
    try {
      const response = await fetch(`/api/products/${showDelete.product.upc}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to delete product');
      }
      
      setShowDelete({ product: null, open: false });
      await fetchProducts(); // Refresh the list
    } catch (err: any) {
      setError(err.message);
      console.error('Error deleting product:', err);
    } finally {
      setActionLoading(false);
    }
  };

  // Filtered products
  const filteredProducts = products.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.upc.toLowerCase().includes(q) ||
      (p.supplier?.name || '').toLowerCase().includes(q) ||
      (p.supplier?.contact || '').toLowerCase().includes(q) ||
      (p.supplier?.email || '').toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <DashboardLayout pageTitle="Inventory Management">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading inventory...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout pageTitle="Inventory Management">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500 text-lg">Error: {error}</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle="Inventory Management">
      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 opacity-100" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg z-10 animate-fadeInScale">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600" onClick={() => setShowModal(false)}>
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold mb-2 text-center">{editProduct ? "Edit Product" : "Add New Product"}</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">UPC</label>
                  <input name="upc" value={form.upc} onChange={handleChange} placeholder="UPC" className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#335CFF]" disabled={!!editProduct} />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Product Name</label>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="Product Name" className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#335CFF]" />
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Stock</label>
                  <input name="stock" value={form.stock} onChange={handleChange} placeholder="Stock" type="number" className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#335CFF]" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Sold</label>
                  <input name="sold" value={form.sold} onChange={handleChange} placeholder="Sold" type="number" className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#335CFF]" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Min Stock</label>
                  <input name="minStock" value={form.minStock} onChange={handleChange} placeholder="Min Stock" type="number" className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#335CFF]" />
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Supplier Name</label>
                  <input name="supplierName" value={form.supplierName} onChange={handleChange} placeholder="Supplier Name" className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#335CFF]" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Supplier Contact</label>
                  <input name="supplierContact" value={form.supplierContact} onChange={handleChange} placeholder="Contact" className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#335CFF]" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Supplier Email</label>
                  <input name="supplierEmail" value={form.supplierEmail} onChange={handleChange} placeholder="Email" className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#335CFF]" />
                </div>
              </div>
              {formError && <div className="text-red-500 text-sm text-center">{formError}</div>}
              <Button type="submit" className="bg-[#335CFF] text-white w-full mt-2 py-2 text-base rounded-lg shadow hover:bg-[#2546b8] transition" disabled={actionLoading}>
                {actionLoading ? 'Saving...' : (editProduct ? "Update Product" : "Add Product")}
              </Button>
            </form>
          </div>
          <style>{`
            @keyframes fadeInScale {
              0% { opacity: 0; transform: scale(0.95); }
              100% { opacity: 1; transform: scale(1); }
            }
            .animate-fadeInScale {
              animation: fadeInScale 0.25s cubic-bezier(0.4,0,0.2,1);
            }
          `}</style>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {showDelete.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 opacity-100" onClick={() => setShowDelete({ product: null, open: false })} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm z-10 animate-fadeInScale">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600" onClick={() => setShowDelete({ product: null, open: false })}>
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold mb-4 text-center">Delete Product</h2>
            <p className="text-gray-600 mb-6 text-center">Are you sure you want to delete <strong>{showDelete.product?.name}</strong>?</p>
            <div className="flex gap-4 justify-center">
              <Button className="bg-gray-200 text-gray-700" onClick={() => setShowDelete({ product: null, open: false })}>Cancel</Button>
              <Button className="bg-[#FF4D4F] text-white" onClick={handleDelete} disabled={actionLoading}>
                {actionLoading ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
          <style>{`
            @keyframes fadeInScale {
              0% { opacity: 0; transform: scale(0.95); }
              100% { opacity: 1; transform: scale(1); }
            }
            .animate-fadeInScale {
              animation: fadeInScale 0.25s cubic-bezier(0.4,0,0.2,1);
            }
          `}</style>
        </div>
      )}
      {/* Main Content */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Product Inventory</h1>
        <div className="flex gap-4 items-center">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, UPC, or supplier..."
            className="border border-gray-300 rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-[#335CFF]"
          />
          <Button className="flex gap-2 bg-[#335CFF] text-white" onClick={() => openModal()}>
            <PlusCircle className="w-5 h-5" /> Add Product
          </Button>
        </div>
      </div>
      <Card className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 border-b">
              <th className="py-3 px-4 font-semibold">Product</th>
              <th className="py-3 px-4 font-semibold">UPC</th>
              <th className="py-3 px-4 font-semibold">Stock</th>
              <th className="py-3 px-4 font-semibold">Sold</th>
              <th className="py-3 px-4 font-semibold">Min Stock</th>
              <th className="py-3 px-4 font-semibold">Supplier</th>
              <th className="py-3 px-4 font-semibold">Contact</th>
              <th className="py-3 px-4 font-semibold">Email</th>
              <th className="py-3 px-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr><td colSpan={9} className="py-4 text-center text-gray-400">No products found.</td></tr>
            ) : (
              filteredProducts.map((p) => (
                <tr key={p.upc} className="border-b hover:bg-[#F7F8FA]">
                  <td className="py-3 px-4 font-semibold">{p.name}</td>
                  <td className="py-3 px-4">{p.upc}</td>
                  <td className="py-3 px-4">{p.stock}</td>
                  <td className="py-3 px-4">{p.sold}</td>
                  <td className="py-3 px-4">{p.min_stock}</td>
                  <td className="py-3 px-4">{p.supplier?.name || 'N/A'}</td>
                  <td className="py-3 px-4">{p.supplier?.contact || 'N/A'}</td>
                  <td className="py-3 px-4">{p.supplier?.email || 'N/A'}</td>
                  <td className="py-3 px-4 flex gap-2">
                    <Button className="bg-[#EEF4FF] text-[#335CFF] px-3 py-1 text-xs font-semibold" onClick={() => openModal(p)}><Edit className="w-4 h-4" /></Button>
                    <Button className="bg-[#FFEEF0] text-[#FF4D4F] px-3 py-1 text-xs font-semibold" onClick={() => setShowDelete({ product: p, open: true })}><Trash2 className="w-4 h-4" /></Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </DashboardLayout>
  );
}; 