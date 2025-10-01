import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Button from "../components/ui/button";
import Input from "../components/ui/input";
import { customersApi } from "../api/backendApi";

interface CustomerForm {
  id?: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
}

export default function EditCustomerPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [formData, setFormData] = useState<CustomerForm>({
    name: "",
    email: "",
    phone: "",
    company: "",
    address: ""
  });

  useEffect(() => {
    const fetchCustomer = async () => {
      if (!id) return;
      
      try {
        setFetchLoading(true);
        const allCustomers = await customersApi.getAll();
        const foundCustomer = allCustomers.find(c => c.customer_id === id);
        
        if (foundCustomer) {
          setFormData({
            id: foundCustomer.customer_id,
            name: foundCustomer.name,
            email: foundCustomer.email,
            phone: foundCustomer.phone || "",
            company: foundCustomer.company || "",
            address: foundCustomer.address || ""
          });
        } else {
          console.error("Customer not found");
          navigate("/customers", { replace: true });
        }
      } catch (error) {
        console.error("Error fetching customer:", error);
        navigate("/customers", { replace: true });
      } finally {
        setFetchLoading(false);
      }
    };

    fetchCustomer();
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    
    setLoading(true);

    try {
      await customersApi.update(id, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        address: formData.address
      });
      navigate("/customers", { replace: true });
    } catch (error) {
      console.error("Error updating customer:", error);
      alert("Failed to update customer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex items-center justify-center p-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent mx-auto"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading customer...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow-lg border border-gray-100 rounded-2xl p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-green-500/10 rounded-full transform translate-x-16 -translate-y-16"></div>
          <div className="relative flex items-center">
            <Link to="/customers" className="mr-6">
              <Button variant="outline" className="px-4 py-2 rounded-xl border-gray-300 hover:border-gray-400 transition-colors">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Customers
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Edit Customer
              </h1>
              <p className="text-gray-600 text-lg">Update customer information</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white shadow-lg border border-gray-100 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-3">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Full Name *
                  </div>
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter customer's full name"
                  className="w-full rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500 py-3 px-4"
                />
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-bold text-gray-700 mb-3">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Company *
                  </div>
                </label>
                <Input
                  id="company"
                  name="company"
                  type="text"
                  required
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Enter company name"
                  className="w-full rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500 py-3 px-4"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-3">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Email Address *
                  </div>
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  className="w-full rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500 py-3 px-4"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-bold text-gray-700 mb-3">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Phone Number *
                  </div>
                </label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className="w-full rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500 py-3 px-4"
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-bold text-gray-700 mb-3">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Address
                  </div>
                </label>
                <Input
                  id="address"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter address"
                  className="w-full rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500 py-3 px-4"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-4 pt-8 border-t border-gray-200">
              <Link to="/customers">
                <Button 
                  variant="outline" 
                  disabled={loading}
                  className="px-6 py-3 rounded-xl border-gray-300 hover:border-gray-400 font-medium transition-colors"
                >
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={loading}
                className={`px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-xl border-0 shadow-md hover:shadow-lg transition-all ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                    Updating Customer...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Update Customer
                  </div>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}