import { AppError } from "../../utilities/AppError.js";

// تعريف الصلاحيات لكل دور
const rolePermissions = {
  admin: [
    "dashboard",
    "staff",
    "attendance", 
    "service_management",
    "orders",
    "tables",
    "kitchen",
    "reports",
    "reservation",
    "inventory",
    "menu"
  ],
  operation: [
    "dashboard",
    "service_management", 
    "orders",
    "tables",
    "kitchen",
    "reports",
    "reservation",
    "inventory",
    "menu"
  ],
  waiter: [
    "orders",
    "tables"
  ],
  staff: [
    "kitchen"
  ]
};

export const checkPermission = (requiredPermission) => {
  return (req, res, next) => {
    const userRole = req.user?.role;
    
    if (!userRole) {
      return next(new AppError("User role not found", 401));
    }
    
    const userPermissions = rolePermissions[userRole] || [];
    
    if (userPermissions.includes(requiredPermission)) {
      next();
    } else {
      next(new AppError("Insufficient permissions", 403));
    }
  };
};

export const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;
    
    if (!userRole) {
      return next(new AppError("User role not found", 401));
    }
    
    if (allowedRoles.includes(userRole)) {
      next();
    } else {
      next(new AppError("Insufficient permissions", 403));
    }
  };
}; 