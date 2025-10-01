import React from 'react';
import { Link } from 'react-router-dom';

interface QuickLinkProps {
  to: string;
  children: React.ReactNode;
}

const QuickLink: React.FC<QuickLinkProps> = ({ to, children }) => (
  <div className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200 group">
    <svg className="w-4 h-4 mr-3 text-blue-500 flex-shrink-0 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
    <Link to={to} className="hover:underline text-sm">
      {children}
    </Link>
  </div>
);

const GettingStarted: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-8 hover:shadow-lg transition-all duration-300">
      <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Getting Started</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Management */}
        <div className="space-y-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-2xl flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">User Management</h3>
          </div>
          <div className="space-y-4">
            <QuickLink to="/users">
              View all system users
            </QuickLink>
            <QuickLink to="/users/add">
              Add new users
            </QuickLink>
            <QuickLink to="/users/roles">
              Manage user roles
            </QuickLink>
            <QuickLink to="/users/permissions">
              Configure permissions
            </QuickLink>
          </div>
        </div>

        {/* Customer Management */}
        <div className="space-y-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-2xl flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 0 1 5.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 0 1 9.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Customer Management</h3>
          </div>
          <div className="space-y-4">
            <QuickLink to="/customers">
              Browse customer database
            </QuickLink>
            <QuickLink to="/customers/add">
              Add new customers
            </QuickLink>
            <QuickLink to="/customers/import">
              Import customer data
            </QuickLink>
            <QuickLink to="/customers/export">
              Export customer reports
            </QuickLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GettingStarted;