
import { useState, useEffect } from "react";
import Button from "./ui/button";
import Input from "./ui/input";


interface Customer {
  id?: string;
  name: string;
  email: string;
  phone: string;
  company: string;
}

interface CustomerFormProps {
  onSubmit: (customer: Customer) => void;
  onCancel?: () => void;
  editingCustomer?: Customer | null;
}

export default function CustomerForm({
  onSubmit,
  onCancel,
  editingCustomer,
}: CustomerFormProps) {
  const [form, setForm] = useState<Customer>({
    name: "",
    email: "",
    phone: "",
    company: "",
  });

  useEffect(() => {
    if (editingCustomer) {
      setForm(editingCustomer);
    }
  }, [editingCustomer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
    setForm({ name: "", email: "", phone: "", company: "" });
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        {editingCustomer ? "Edit Customer" : "Add Customer"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          required
          className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <Input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          type="email"
          required
          className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <Input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone"
          required
          className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <Input
          name="company"
          value={form.company}
          onChange={handleChange}
          placeholder="Company"
          required
          className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <div className="flex gap-3 justify-center mt-6">
          <Button type="submit" className="px-6 py-2 font-semibold rounded-md bg-blue-600 text-white hover:bg-blue-700 transition">Save</Button>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} className="px-6 py-2 font-semibold rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 transition">
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
