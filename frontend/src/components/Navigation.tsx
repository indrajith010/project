import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

interface User {
  id: number;
  email: string;
  username: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function Navigation() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/customers" && location.pathname === "/customers") {
      return true;
    }
    if (path !== "/customers" && location.pathname.startsWith(path)) {
      return true;
    }
    return false;
  };

  const baseNavItems = [
    { path: "/customers", label: "All Customers", icon: "👥" },
    { path: "/customers/add", label: "Add Customer", icon: "➕" },
    { path: "/profile", label: "My Profile", icon: "👤" },
  ];

  const adminNavItems = [
    { path: "/users", label: "Manage Users", icon: "⚙️" },
  ];

  // Handle clicking outside the user menu to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('#user-menu-button') && showUserMenu) {
        setShowUserMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  // Check user authentication and role
  useEffect(() => {
    const checkUser = () => {
      try {
        const authToken = localStorage.getItem('authToken');
        const userDataStr = localStorage.getItem('user');
        
        if (authToken && userDataStr) {
          const userData = JSON.parse(userDataStr) as User;
          console.log("Navigation - User data:", userData);
          console.log("Navigation - User role:", userData.role);
          setUser(userData);
        } else {
          console.log("Navigation - No authentication found");
          setUser(null);
        }
      } catch (error) {
        console.error("Navigation - Error parsing user data:", error);
        setUser(null);
      }
    };
    
    checkUser();
    
    // Listen for storage changes (login/logout in other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'authToken' || e.key === 'user') {
        checkUser();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isAdminUser = user?.role === 'admin';
  const navItems = [...baseNavItems, ...(isAdminUser ? adminNavItems : [])];
  const userName = user?.username || 'User';

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/customers" className="text-xl font-bold text-gray-900">
                Customer Manager
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? "border-blue-500 text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center">
            {/* User Profile Menu */}
            <div className="relative ml-3">
              <div>
                <button
                  type="button"
                  className="flex items-center max-w-xs text-sm bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  id="user-menu-button"
                  aria-expanded="false"
                  aria-haspopup="true"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <span className="ml-2 mr-1 text-gray-700">{userName}</span>
                  <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              
              {showUserMenu && (
                <div
                  className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu-button"
                >
                  <div className="py-1" role="none">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      onClick={() => setShowUserMenu(false)}
                    >
                      My Profile
                    </Link>
                    
                    {isAdminUser && (
                      <Link
                        to="/users"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                        onClick={() => setShowUserMenu(false)}
                      >
                        User Management
                      </Link>
                    )}
                    
                    <div className="border-t border-gray-100 my-1"></div>
                    
                    {/* User Info */}
                    <div className="px-4 py-2 text-xs text-gray-500">
                      <div>Role: {user?.role}</div>
                      <div>Email: {user?.email}</div>
                    </div>
                    
                    <div className="border-t border-gray-100 my-1"></div>
                    
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        handleLogout();
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="sm:hidden">
        <div className="pt-2 pb-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors ${
                isActive(item.path)
                  ? "bg-blue-50 border-blue-500 text-blue-700"
                  : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}