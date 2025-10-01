import React from 'react';
import { Link } from 'react-router-dom';

interface DashboardCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  buttonText: string;
  buttonVariant?: 'primary' | 'secondary' | 'disabled';
  href?: string;
  onClick?: () => void;
  iconColor?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  description,
  icon,
  buttonText,
  buttonVariant = 'primary',
  href,
  onClick,
  iconColor = 'blue'
}) => {
  const iconColorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
    red: 'bg-red-100 text-red-600',
    gray: 'bg-gray-100 text-gray-600'
  };

  const buttonClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white border-transparent',
    secondary: 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100',
    disabled: 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
  };

  const CardContent = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 h-full">
      <div className="flex flex-col items-center text-center h-full">
        <div className={`w-16 h-16 mb-4 rounded-2xl flex items-center justify-center flex-shrink-0 ${iconColorClasses[iconColor as keyof typeof iconColorClasses]}`}>
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4 flex-grow">{description}</p>
        <div className="w-full">
          {href ? (
            <Link to={href} className="block w-full">
              <button 
                className={`w-full px-4 py-2 rounded-lg border font-medium transition-all duration-200 ${buttonClasses[buttonVariant]}`}
                disabled={buttonVariant === 'disabled'}
              >
                {buttonText}
              </button>
            </Link>
          ) : (
            <button 
              onClick={onClick}
              className={`w-full px-4 py-2 rounded-lg border font-medium transition-all duration-200 ${buttonClasses[buttonVariant]}`}
              disabled={buttonVariant === 'disabled'}
            >
              {buttonText}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return <CardContent />;
};

// Pre-built card components for common use cases
export const ViewUsersCard: React.FC = () => (
  <DashboardCard
    title="Users"
    description="Manage system users and their permissions"
    icon={
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
      </svg>
    }
    buttonText="View Users"
    buttonVariant="secondary"
    href="/users"
    iconColor="purple"
  />
);

export const ViewCustomersCard: React.FC = () => (
  <DashboardCard
    title="Customers"
    description="Browse and manage your customer database"
    icon={
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 0 1 5.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 0 1 9.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    }
    buttonText="View Customers"
    buttonVariant="primary"
    href="/customers"
    iconColor="green"
  />
);

export const AddCustomerCard: React.FC = () => (
  <DashboardCard
    title="Add Customer"
    description="Create new customer records in the system"
    icon={
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    }
    buttonText="Add Customer"
    buttonVariant="primary"
    href="/customers/add"
    iconColor="orange"
  />
);

export const ComingSoonCard: React.FC<{ title: string; description: string; iconColor?: string }> = ({ 
  title, 
  description, 
  iconColor = "gray" 
}) => (
  <DashboardCard
    title={title}
    description={description}
    icon={
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    }
    buttonText="Coming Soon"
    buttonVariant="disabled"
    iconColor={iconColor}
  />
);

export default DashboardCard;