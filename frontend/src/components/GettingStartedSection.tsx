import React from 'react';
import { Link } from 'react-router-dom';

interface GettingStartedSectionProps {
  title?: string;
  className?: string;
}

interface QuickLinkProps {
  to: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

const QuickLink: React.FC<QuickLinkProps> = ({ to, children, icon }) => (
  <div className="flex items-center text-gray-700 hover:text-blue-600 transition-colors duration-200">
    {icon || (
      <svg className="w-4 h-4 mr-3 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    )}
    <Link to={to} className="hover:underline">
      {children}
    </Link>
  </div>
);

const GettingStartedSection: React.FC<GettingStartedSectionProps> = ({ 
  title = "Getting Started",
  className = ""
}) => {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-8 ${className}`}>
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{title}</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* User Management */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
          </div>
          <div className="space-y-3 pl-11">
            <QuickLink to="/users">
              View all users in the system
            </QuickLink>
            <QuickLink to="/users/add">
              Add new users with roles
            </QuickLink>
            <QuickLink to="/users/permissions">
              Manage user permissions
            </QuickLink>
            <QuickLink to="/users/roles">
              Configure user roles
            </QuickLink>
          </div>
        </div>

        {/* Customer Management */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 0 1 5.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 0 1 9.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Customer Management</h3>
          </div>
          <div className="space-y-3 pl-11">
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

      {/* Additional Help Section */}
      <div className="mt-8 pt-6 border-t border-gray-100">
        <div className="text-center">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Need Help?</h4>
          <div className="flex justify-center space-x-6">
            <Link 
              to="/documentation" 
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Documentation</span>
            </Link>
            <Link 
              to="/support" 
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Support</span>
            </Link>
            <Link 
              to="/tutorials" 
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Tutorials</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GettingStartedSection;