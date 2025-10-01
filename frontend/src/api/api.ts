import { api } from './client';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: string;
  message: string;
  user: {
    id: number;
    email: string;
    username: string;
    role: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
}

export interface User {
  id: number;
  email: string;
  username: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateUserData {
  email: string;
  password: string;
  username: string;
  role: string;
}

export interface UpdateUserData {
  email?: string;
  password?: string;
  username?: string;
  role?: string;
  is_active?: boolean;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  notes?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateCustomerData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  notes?: string;
}

export interface UpdateCustomerData {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  notes?: string;
  is_active?: boolean;
}

// Authentication API
export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  logout: async (): Promise<void> => {
    // No backend logout endpoint yet, just clear token
    localStorage.removeItem('authToken');
  },

  verify: async (): Promise<User> => {
    // For now, we'll implement basic token verification
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No auth token found');
    }
    // We can implement a /auth/verify endpoint later
    throw new Error('Token verification not implemented yet');
  }
};

// Users API
export const usersAPI = {
  getAll: async (): Promise<User[]> => {
    const response = await api.get('/users');
    return response.data;
  },

  getById: async (id: number): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  create: async (userData: CreateUserData): Promise<User> => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  update: async (id: number, userData: UpdateUserData): Promise<User> => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/users/${id}`);
  }
};

// Customers API
export const customersAPI = {
  getAll: async (search?: string): Promise<Customer[]> => {
    const params = search ? { search } : {};
    const response = await api.get('/customers', { params });
    return response.data;
  },

  getById: async (id: number): Promise<Customer> => {
    const response = await api.get(`/customers/${id}`);
    return response.data;
  },

  create: async (customerData: CreateCustomerData): Promise<Customer> => {
    const response = await api.post('/customers', customerData);
    return response.data;
  },

  update: async (id: number, customerData: UpdateCustomerData): Promise<Customer> => {
    const response = await api.put(`/customers/${id}`, customerData);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/customers/${id}`);
  },

  search: async (query: string): Promise<Customer[]> => {
    const response = await api.get('/customers', { params: { search: query } });
    return response.data;
  }
};
