


interface CustomersTableProps {
  customers: any[];
  onEdit: (customer: any) => void;
  onDelete: (id: string) => void;
}

export default function CustomersTable({ customers, onEdit, onDelete }: CustomersTableProps) {
  return (
    <table className="w-full mt-6 border-collapse border border-gray-200">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-2 border">Name</th>
          <th className="p-2 border">Email</th>
          <th className="p-2 border">Phone</th>
          <th className="p-2 border">Company</th>
          <th className="p-2 border">Actions</th>
        </tr>
      </thead>
      <tbody>
        {customers.map(c => (
          <tr key={c.id} className="hover:bg-gray-50">
            <td className="p-2 border">{c.name}</td>
            <td className="p-2 border">{c.email}</td>
            <td className="p-2 border">{c.phone}</td>
            <td className="p-2 border">{c.details}</td>
            <td className="p-2 border space-x-2">
              <button onClick={() => onEdit(c)} className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500">Edit</button>
              <button onClick={() => onDelete(c.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
