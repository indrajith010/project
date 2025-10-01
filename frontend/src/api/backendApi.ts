import { ref, get, set, update } from "firebase/database";
import { db } from '../firebaseConfig';

export interface Customer {
  customer_id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  company?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface CreateCustomerData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  company?: string;
  notes?: string;
}

export interface UpdateCustomerData {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  company?: string;
  notes?: string;
  is_active?: boolean;
}

// Customers API
export const customersApi = {
  // Get all customers
  getAll: async (): Promise<Customer[]> => {
    const customersRef = ref(db, 'customers');
    const snapshot = await get(customersRef);
    if (snapshot.exists()) {
      const customers = Object.values(snapshot.val()) as Customer[];
      return customers.filter(c => c.is_active !== false);
    }
    return [];
  },

  // Create new customer
  create: async (customerData: CreateCustomerData): Promise<Customer> => {
    const newCustomerId = `cust_${Date.now()}`;
    const customer: Customer = {
      customer_id: newCustomerId,
      ...customerData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_active: true
    };
    
    const customerRef = ref(db, `customers/${newCustomerId}`);
    await set(customerRef, customer);
    return customer;
  },

  // Update customer
  update: async (customerId: string, customerData: UpdateCustomerData): Promise<Customer> => {
    const customerRef = ref(db, `customers/${customerId}`);
    const updateData = {
      ...customerData,
      updated_at: new Date().toISOString()
    };
    
    await update(customerRef, updateData);
    
    // Get updated customer data
    const snapshot = await get(customerRef);
    if (!snapshot.exists()) {
      throw new Error('Customer not found');
    }
    return snapshot.val();
  },

  // Delete customer (soft delete)
  delete: async (customerId: string): Promise<void> => {
    const customerRef = ref(db, `customers/${customerId}`);
    await update(customerRef, {
      is_active: false,
      updated_at: new Date().toISOString()
    });
  }
};

export default {
  customers: customersApi
};