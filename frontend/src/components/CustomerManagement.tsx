// import { useState, useEffect } from "react";
// import CustomerForm from "./CustomerForm";
// import CustomersTable from "./CustomersTable";

// export default function CustomerManagement() {
//   const [customers, setCustomers] = useState<any[]>([]);
//   const [editingCustomer, setEditingCustomer] = useState<any | null>(null);

//   const fetchCustomers = async () => {
//     try {
//       const res = await fetch("http://localhost:5000/customers");
//       const data = await res.json();
//       setCustomers(data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchCustomers();
//   }, []);

//   const handleAddCustomer = async (customer: any) => {
//     try {
//       const res = await fetch("http://localhost:5000/customers", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(customer),
//       });
//       const newCustomer = await res.json();
//       setCustomers([...customers, newCustomer]);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleUpdateCustomer = async (customer: any) => {
//     if (!editingCustomer) return;
//     try {
//       const res = await fetch(`http://localhost:5000/customers/${editingCustomer.id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(customer),
//       });
//       const updatedCustomer = await res.json();
//       setCustomers(customers.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
//       setEditingCustomer(null);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleDeleteCustomer = async (id: string) => {
//     try {
//       await fetch(`http://localhost:5000/customers/${id}`, { method: "DELETE" });
//       setCustomers(customers.filter(c => c.id !== id));
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto p-6">
//       <h1 className="text-3xl font-bold mb-6 text-center">Customer Management</h1>

//       <div className="bg-white p-6 rounded-xl shadow-md">
//         <CustomerForm
//           onSubmit={editingCustomer ? handleUpdateCustomer : handleAddCustomer}
//           onCancel={() => setEditingCustomer(null)}
//           editingCustomer={editingCustomer}
//         />

//         <CustomersTable
//           customers={customers}
//           onEdit={(c) => setEditingCustomer(c)}
//           onDelete={handleDeleteCustomer}
//         />
//       </div>
//     </div>
//   );
// }


// ----------------------------------------------------------------------------


import { useEffect, useState } from "react";
import { collection, addDoc, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import CustomerForm from "./CustomerForm";

interface Customer {
  id?: string;
  name: string;
  email: string;
  phone: string;
  company: string;
}

export default function CustomerManagement() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const fetchCustomers = async () => {
    const querySnapshot = await getDocs(collection(db, "customers"));
    const customerList: Customer[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Customer),
    }));
    setCustomers(customerList);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSubmit = async (customer: Customer) => {
    if (customer.id) {
      // Update existing
      const ref = doc(db, "customers", customer.id);
      await updateDoc(ref, {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        company: customer.company,
      });
    } else {
      // Add new
      await addDoc(collection(db, "customers"), {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        company: customer.company,
      });
    }
    setEditingCustomer(null);
    fetchCustomers();
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Customer Management</h2>

      <CustomerForm
        onSubmit={handleSubmit}
        editingCustomer={editingCustomer}
        onCancel={() => setEditingCustomer(null)}
      />

      <ul className="mt-4 space-y-2">
        {customers.map((c) => (
          <li key={c.id} className="p-2 border rounded flex justify-between">
            <div>
              <p className="font-medium">{c.name}</p>
              <p className="text-sm text-gray-600">{c.email}</p>
              <p className="text-sm">{c.phone} | {c.company}</p>
            </div>
            <button
              onClick={() => setEditingCustomer(c)}
              className="text-blue-600 hover:underline"
            >
              Edit
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
