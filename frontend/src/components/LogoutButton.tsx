import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogoutService } from '../services/logoutService';
import Button from './ui/button';

interface LogoutButtonProps {
  variant?: 'primary' | 'outline' | 'secondary';
  className?: string;
  showConfirmation?: boolean;
  children?: React.ReactNode;
}

/**
 * Reusable Logout Button Component
 */
export const LogoutButton: React.FC<LogoutButtonProps> = ({
  variant = 'outline',
  className = '',
  showConfirmation = false,
  children = 'Sign Out'
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);

  const handleLogout = async () => {
    setLoading(true);
    
    try {
      if (showConfirmation) {
        await LogoutService.logoutWithConfirmation(navigate);
      } else {
        await LogoutService.completeLogout(navigate);
      }
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      className={className}
      onClick={handleLogout}
      disabled={loading}
    >
      {loading ? (
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
          Signing out...
        </div>
      ) : (
        children
      )}
    </Button>
  );
};

export default LogoutButton;