import React from 'react';
import { Link } from 'react-router-dom';

interface ActionCardProps {
  title: string;
  icon: React.ReactNode;
  buttonText: string;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'disabled';
  iconBgColor?: string;
  iconTextColor?: string;
}

const ActionCard: React.FC<ActionCardProps> = ({
  title,
  icon,
  buttonText,
  href,
  onClick,
  variant = 'primary',
  iconBgColor = 'bg-blue-100',
  iconTextColor = 'text-blue-600'
}) => {
  const buttonVariants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white border-transparent',
    secondary: 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100',
    disabled: 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
  };

  const CardContent = () => (
    <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-all duration-300 h-full">
      <div className="flex flex-col items-center text-center h-full">
        <div className={`w-16 h-16 mb-4 rounded-2xl flex items-center justify-center ${iconBgColor}`}>
          <div className={iconTextColor}>
            {icon}
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex-grow flex items-center">
          {title}
        </h3>
        <div className="w-full">
          {href ? (
            <Link to={href} className="block w-full">
              <button 
                className={`w-full px-4 py-3 rounded-2xl border font-medium transition-all duration-200 ${buttonVariants[variant]}`}
                disabled={variant === 'disabled'}
              >
                {buttonText}
              </button>
            </Link>
          ) : (
            <button 
              onClick={onClick}
              className={`w-full px-4 py-3 rounded-2xl border font-medium transition-all duration-200 ${buttonVariants[variant]}`}
              disabled={variant === 'disabled'}
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

// Pre-built action cards
export const UsersCard: React.FC = () => (
  <ActionCard
    title="Users"
    icon={
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
      </svg>
    }
    buttonText="View Users"
    href="/users"
    variant="secondary"
    iconBgColor="bg-purple-100"
    iconTextColor="text-purple-600"
  />
);

export const CustomersCard: React.FC = () => (
  <ActionCard
    title="Customers"
    icon={
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 0 1 5.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 0 1 9.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    }
    buttonText="View Customers"
    href="/customers"
    variant="primary"
    iconBgColor="bg-green-100"
    iconTextColor="text-green-600"
  />
);

export const AddCustomerCard: React.FC = () => (
  <ActionCard
    title="Add Customer"
    icon={
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    }
    buttonText="Add Customer"
    href="/customers/add"
    variant="primary"
    iconBgColor="bg-orange-100"
    iconTextColor="text-orange-600"
  />
);

export const AnalyticsCard: React.FC = () => (
  <ActionCard
    title="Analytics"
    icon={
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    }
    buttonText="Coming Soon"
    variant="disabled"
    iconBgColor="bg-gray-100"
    iconTextColor="text-gray-500"
  />
);

export default ActionCard;