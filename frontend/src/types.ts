// export interface Customer {
//   id?: string;
//   name: string;
//   email: string;
//   phone: string;
// }


export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  company?: string;
  createdAt?: string;
  updatedAt?: string;
}
