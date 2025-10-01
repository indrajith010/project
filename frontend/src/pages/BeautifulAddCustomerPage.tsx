// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';

// interface CustomerFormData {
//   name: string;
//   email: string;
//   phone: string;
//   company: string;
//   address: string;
//   notes: string;
// }

// const BeautifulAddCustomerPage: React.FC = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState<CustomerFormData>({
//     name: '',
//     email: '',
//     phone: '',
//     company: '',
//     address: '',
//     notes: ''
//   });

//   const [errors, setErrors] = useState<Partial<CustomerFormData>>({});

//   const validateForm = (): boolean => {
//     const newErrors: Partial<CustomerFormData> = {};

//     if (!formData.name.trim()) {
//       newErrors.name = 'Name is required';
//     }

//     if (!formData.email.trim()) {
//       newErrors.email = 'Email is required';
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = 'Email is invalid';
//     }

//     if (!formData.phone.trim()) {
//       newErrors.phone = 'Phone is required';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       return;
//     }

//     setLoading(true);
    
//     try {
//       // Simulate API call
//       await new Promise(resolve => setTimeout(resolve, 1500));
      
//       // Here you would make actual API call
//       console.log('Creating customer:', formData);
      
//       // Navigate back to customers list
//       navigate('/customers');
//     } catch (error) {
//       console.error('Error creating customer:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
    
//     // Clear error when user starts typing
//     if (errors[name as keyof CustomerFormData]) {
//       setErrors(prev => ({
//         ...prev,
//         [name]: undefined
//       }));
//     }
//   };

//   return (
//     <div className="p-4 sm:p-6 lg:p-8">
//       <div className="max-w-4xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex items-center space-x-4 mb-4">
//             <Link
//               to="/customers"
//               className="inline-flex items-center text-gray-500 hover:text-gray-700 transition-colors"
//             >
//               <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//               </svg>
//               Back to Customers
//             </Link>
//           </div>
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Customer</h1>
//           <p className="text-gray-600">Create a new customer record in your database</p>
//         </div>

//         {/* Form */}
//         <div className="bg-white rounded-2xl shadow-md overflow-hidden">
//           <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
//             <h2 className="text-lg font-semibold text-gray-900">Customer Information</h2>
//           </div>
          
//           <form onSubmit={handleSubmit} className="p-6 space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {/* Name */}
//               <div>
//                 <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
//                   Full Name *
//                 </label>
//                 <input
//                   type="text"
//                   id="name"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   className={`block w-full px-4 py-3 border rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
//                     errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200'
//                   }`}
//                   placeholder="Enter customer's full name"
//                 />
//                 {errors.name && (
//                   <p className="mt-1 text-sm text-red-600 flex items-center">
//                     <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                     </svg>
//                     {errors.name}
//                   </p>
//                 )}
//               </div>

//               {/* Email */}
//               <div>
//                 <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
//                   Email Address *
//                 </label>
//                 <input
//                   type="email"
//                   id="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   className={`block w-full px-4 py-3 border rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
//                     errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'
//                   }`}
//                   placeholder="customer@example.com"
//                 />
//                 {errors.email && (
//                   <p className="mt-1 text-sm text-red-600 flex items-center">
//                     <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                     </svg>
//                     {errors.email}
//                   </p>
//                 )}
//               </div>

//               {/* Phone */}
//               <div>
//                 <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
//                   Phone Number *
//                 </label>
//                 <input
//                   type="tel"
//                   id="phone"
//                   name="phone"
//                   value={formData.phone}
//                   onChange={handleChange}
//                   className={`block w-full px-4 py-3 border rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
//                     errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-200'
//                   }`}
//                   placeholder="+1 (555) 123-4567"
//                 />
//                 {errors.phone && (
//                   <p className="mt-1 text-sm text-red-600 flex items-center">
//                     <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                     </svg>
//                     {errors.phone}
//                   </p>
//                 )}
//               </div>

//               {/* Company */}
//               <div>
//                 <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
//                   Company
//                 </label>
//                 <input
//                   type="text"
//                   id="company"
//                   name="company"
//                   value={formData.company}
//                   onChange={handleChange}
//                   className="block w-full px-4 py-3 border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                   placeholder="Company name"
//                 />
//               </div>
//             </div>

//             {/* Address */}
//             <div>
//               <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
//                 Address
//               </label>
//               <input
//                 type="text"
//                 id="address"
//                 name="address"
//                 value={formData.address}
//                 onChange={handleChange}
//                 className="block w-full px-4 py-3 border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                 placeholder="Street address, city, state, zip"
//               />
//             </div>

//             {/* Notes */}
//             <div>
//               <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
//                 Notes
//               </label>
//               <textarea
//                 id="notes"
//                 name="notes"
//                 value={formData.notes}
//                 onChange={handleChange}
//                 rows={4}
//                 className="block w-full px-4 py-3 border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
//                 placeholder="Additional notes about the customer..."
//               />
//             </div>

//             {/* Actions */}
//             <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 disabled:cursor-not-allowed"
//               >
//                 {loading ? (
//                   <>
//                     <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                     </svg>
//                     Creating Customer...
//                   </>
//                 ) : (
//                   <>
//                     <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                     </svg>
//                     Create Customer
//                   </>
//                 )}
//               </button>
              
//               <Link
//                 to="/customers"
//                 className="inline-flex items-center justify-center px-6 py-3 border border-gray-200 text-gray-700 font-medium rounded-2xl hover:bg-gray-50 transition-all duration-200"
//               >
//                 <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//                 Cancel
//               </Link>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BeautifulAddCustomerPage;

// ---------------------------------------------------------------------------------





// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { getDatabase, ref, push } from "firebase/database";

// interface CustomerFormData {
//   name: string;
//   email: string;
//   phone: string;
//   company: string;
//   address: string;
//   notes: string;
// }

// const BeautifulAddCustomerPage: React.FC = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState<CustomerFormData>({
//     name: "",
//     email: "",
//     phone: "",
//     company: "",
//     address: "",
//     notes: "",
//   });

//   const [errors, setErrors] = useState<Partial<CustomerFormData>>({});

//   const validateForm = (): boolean => {
//     const newErrors: Partial<CustomerFormData> = {};

//     if (!formData.name.trim()) newErrors.name = "Name is required";

//     if (!formData.email.trim()) newErrors.email = "Email is required";
//     else if (!/\S+@\S+\.\S+/.test(formData.email))
//       newErrors.email = "Email is invalid";

//     if (!formData.phone.trim()) newErrors.phone = "Phone is required";

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!validateForm()) return;

//     setLoading(true);

//     try {
//       const db = getDatabase();
//       const customersRef = ref(db, "customers");
//       await push(customersRef, formData);

//       console.log("✅ Customer saved to Firebase", formData);

//       // Reset form
//       setFormData({
//         name: "",
//         email: "",
//         phone: "",
//         company: "",
//         address: "",
//         notes: "",
//       });

//       navigate("/customers");
//     } catch (error) {
//       console.error("❌ Error creating customer:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));

//     if (errors[name as keyof CustomerFormData]) {
//       setErrors((prev) => ({ ...prev, [name]: undefined }));
//     }
//   };

//   return (
//     <div className="p-4 sm:p-6 lg:p-8">
//       <div className="max-w-4xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex items-center space-x-4 mb-4">
//             <Link
//               to="/customers"
//               className="inline-flex items-center text-gray-500 hover:text-gray-700 transition-colors"
//             >
//               <svg
//                 className="w-5 h-5 mr-2"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M15 19l-7-7 7-7"
//                 />
//               </svg>
//               Back to Customers
//             </Link>
//           </div>
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">
//             Add New Customer
//           </h1>
//           <p className="text-gray-600">
//             Create a new customer record in your database
//           </p>
//         </div>

//         {/* Form */}
//         <div className="bg-white rounded-2xl shadow-md overflow-hidden">
//           <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
//             <h2 className="text-lg font-semibold text-gray-900">
//               Customer Information
//             </h2>
//           </div>

//           <form onSubmit={handleSubmit} className="p-6 space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {/* Name */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Full Name *
//                 </label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   placeholder="Enter customer's full name"
//                   className={`block w-full px-4 py-3 border rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
//                     errors.name ? "border-red-300 bg-red-50" : "border-gray-200"
//                   }`}
//                 />
//                 {errors.name && (
//                   <p className="mt-1 text-sm text-red-600">{errors.name}</p>
//                 )}
//               </div>

//               {/* Email */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Email Address *
//                 </label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   placeholder="customer@example.com"
//                   className={`block w-full px-4 py-3 border rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
//                     errors.email ? "border-red-300 bg-red-50" : "border-gray-200"
//                   }`}
//                 />
//                 {errors.email && (
//                   <p className="mt-1 text-sm text-red-600">{errors.email}</p>
//                 )}
//               </div>

//               {/* Phone */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Phone Number *
//                 </label>
//                 <input
//                   type="tel"
//                   name="phone"
//                   value={formData.phone}
//                   onChange={handleChange}
//                   placeholder="+91 1234567890"
//                   className={`block w-full px-4 py-3 border rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
//                     errors.phone ? "border-red-300 bg-red-50" : "border-gray-200"
//                   }`}
//                 />
//                 {errors.phone && (
//                   <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
//                 )}
//               </div>

//               {/* Company */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Company
//                 </label>
//                 <input
//                   type="text"
//                   name="company"
//                   value={formData.company}
//                   onChange={handleChange}
//                   placeholder="Company name"
//                   className="block w-full px-4 py-3 border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                 />
//               </div>
//             </div>

//             {/* Address */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Address
//               </label>
//               <input
//                 type="text"
//                 name="address"
//                 value={formData.address}
//                 onChange={handleChange}
//                 placeholder="Street address, city, state, zip"
//                 className="block w-full px-4 py-3 border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//               />
//             </div>

//             {/* Notes */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Notes
//               </label>
//               <textarea
//                 name="notes"
//                 value={formData.notes}
//                 onChange={handleChange}
//                 rows={4}
//                 placeholder="Additional notes about the customer..."
//                 className="block w-full px-4 py-3 border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
//               />
//             </div>

//             {/* Actions */}
//             <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 disabled:cursor-not-allowed"
//               >
//                 {loading ? "Creating Customer..." : "Create Customer"}
//               </button>

//               <Link
//                 to="/customers"
//                 className="inline-flex items-center justify-center px-6 py-3 border border-gray-200 text-gray-700 font-medium rounded-2xl hover:bg-gray-50 transition-all duration-200"
//               >
//                 Cancel
//               </Link>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BeautifulAddCustomerPage;



// ------------------------------------------------------------------------






import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { customersApi } from "../api/backendApi";

interface CustomerFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  notes: string;
}

const BeautifulAddCustomerPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CustomerFormData>({
    name: "",
    email: "",
    phone: "",
    company: "",
    address: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Partial<CustomerFormData>>({});

  const [userLoggedIn, setUserLoggedIn] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUserLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Partial<CustomerFormData> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!userLoggedIn) {
      alert("❌ You must be logged in to add customers.");
      return;
    }

    setLoading(true);
    try {
      // Use the customersApi to create a customer
      await customersApi.create({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        address: formData.address,
        notes: formData.notes
      });

      console.log("✅ Customer saved to Firebase", formData);

      navigate("/customers");
    } catch (error) {
      console.error("❌ Error creating customer:", error);
      alert("Error saving customer. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof CustomerFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link
              to="/customers"
              className="inline-flex items-center text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Customers
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Add New Customer
          </h1>
          <p className="text-gray-600">
            Create a new customer record in your database
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">
              Customer Information
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`block w-full px-4 py-3 border rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.name ? "border-red-300 bg-red-50" : "border-gray-200"
                  }`}
                  placeholder="Enter customer's full name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`block w-full px-4 py-3 border rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.email ? "border-red-300 bg-red-50" : "border-gray-200"
                  }`}
                  placeholder="customer@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`block w-full px-4 py-3 border rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.phone ? "border-red-300 bg-red-50" : "border-gray-200"
                  }`}
                  placeholder="+1 (555) 123-4567"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Company */}
              <div>
                <label
                  htmlFor="company"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Company
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Company name"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="block w-full px-4 py-3 border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Street address, city, state, zip"
              />
            </div>

            {/* Notes */}
            <div>
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                className="block w-full px-4 py-3 border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                placeholder="Additional notes about the customer..."
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 disabled:cursor-not-allowed"
              >
                {loading ? "Creating Customer..." : "Create Customer"}
              </button>

              <Link
                to="/customers"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-200 text-gray-700 font-medium rounded-2xl hover:bg-gray-50 transition-all duration-200"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BeautifulAddCustomerPage;
