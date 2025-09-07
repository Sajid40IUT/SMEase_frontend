import { config } from './config';

const API_BASE_URL = config.API_BASE_URL;

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json();
};

export const api = {
  // Employee endpoints
  employees: {
    getAll: () => fetch(`${API_BASE_URL}/employees`).then(handleResponse),
    getById: (id: string) => fetch(`${API_BASE_URL}/employees/${id}`).then(handleResponse),
    create: (data: any) => fetch(`${API_BASE_URL}/employees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
    update: (id: string, data: any) => fetch(`${API_BASE_URL}/employees/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
    delete: (id: string) => fetch(`${API_BASE_URL}/employees/${id}`, {
      method: 'DELETE',
    }).then(handleResponse),
  },

  // Supplier endpoints
  suppliers: {
    getAll: () => fetch(`${API_BASE_URL}/suppliers`).then(handleResponse),
    getById: (id: string) => fetch(`${API_BASE_URL}/suppliers/${id}`).then(handleResponse),
    create: (data: any) => fetch(`${API_BASE_URL}/suppliers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
    update: (id: string, data: any) => fetch(`${API_BASE_URL}/suppliers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
    delete: (id: string) => fetch(`${API_BASE_URL}/suppliers/${id}`, {
      method: 'DELETE',
    }).then(handleResponse),
  },

  // Product endpoints
  products: {
    getAll: () => fetch(`${API_BASE_URL}/products`).then(handleResponse),
    getById: (id: string) => fetch(`${API_BASE_URL}/products/${id}`).then(handleResponse),
    create: (data: any) => fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
    update: (id: string, data: any) => fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
    delete: (id: string) => fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
    }).then(handleResponse),
  },

  // Sale endpoints
  sales: {
    getAll: () => fetch(`${API_BASE_URL}/sales`).then(handleResponse),
    getById: (id: string) => fetch(`${API_BASE_URL}/sales/${id}`).then(handleResponse),
    create: (data: any) => fetch(`${API_BASE_URL}/sales`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
    update: (id: string, data: any) => fetch(`${API_BASE_URL}/sales/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
    delete: (id: string) => fetch(`${API_BASE_URL}/sales/${id}`, {
      method: 'DELETE',
    }).then(handleResponse),
  },

  // Payroll endpoints
  payroll: {
    periods: {
      getAll: () => fetch(`${API_BASE_URL}/payroll-periods`).then(handleResponse),
      getById: (id: string) => fetch(`${API_BASE_URL}/payroll-periods/${id}`).then(handleResponse),
      create: (data: any) => fetch(`${API_BASE_URL}/payroll-periods`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(handleResponse),
      update: (id: string, data: any) => fetch(`${API_BASE_URL}/payroll-periods/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(handleResponse),
      delete: (id: string) => fetch(`${API_BASE_URL}/payroll-periods/${id}`, {
        method: 'DELETE',
      }).then(handleResponse),
    },
    payslips: {
      getAll: () => fetch(`${API_BASE_URL}/payslips`).then(handleResponse),
      getById: (id: string) => fetch(`${API_BASE_URL}/payslips/${id}`).then(handleResponse),
      create: (data: any) => fetch(`${API_BASE_URL}/payslips`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(handleResponse),
      update: (id: string, data: any) => fetch(`${API_BASE_URL}/payslips/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(handleResponse),
      delete: (id: string) => fetch(`${API_BASE_URL}/payslips/${id}`, {
        method: 'DELETE',
      }).then(handleResponse),
    },
  },

  // Tax document endpoints
  taxDocuments: {
    getAll: () => fetch(`${API_BASE_URL}/tax-documents`).then(handleResponse),
    getById: (id: string) => fetch(`${API_BASE_URL}/tax-documents/${id}`).then(handleResponse),
    create: (data: any) => fetch(`${API_BASE_URL}/tax-documents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
    update: (id: string, data: any) => fetch(`${API_BASE_URL}/tax-documents/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
    delete: (id: string) => fetch(`${API_BASE_URL}/tax-documents/${id}`, {
      method: 'DELETE',
    }).then(handleResponse),
  },
};
