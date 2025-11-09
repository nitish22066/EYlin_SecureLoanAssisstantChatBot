// OSO Authorization Configuration for Loan Assistant
import { Oso } from "oso";

// Initialize OSO authorization engine
export const oso = new Oso();

// Define authorization policies for loan operations
export const initializeOSOPolicies = async () => {
  try {
    // Policy for loan application access
    await oso.loadStr(`
      # User can access their own loan applications
      allow(user, "read", loan_application) if
        loan_application.userId = user.id;
      
      # User can create loan applications
      allow(user, "create", loan_application) if
        user.age >= 18;
      
      # Admin can access all loan applications
      allow(user, "admin", loan_application) if
        user.role = "admin";
      
      # Loan agent can process loan applications
      allow(user, "process", loan_application) if
        user.role = "loan_agent";
      
      # Document verification permissions
      allow(user, "verify_documents", loan_application) if
        loan_application.userId = user.id or
        user.role = "loan_agent" or
        user.role = "admin";
      
      # Escalation permissions
      allow(user, "escalate", loan_application) if
        loan_application.userId = user.id;
    `);
    
    console.log("OSO authorization policies loaded successfully");
  } catch (error) {
    console.error("Failed to load OSO policies:", error);
    throw error;
  }
};

// Authorization helper functions
export const checkPermission = async (user: any, action: string, resource: any) => {
  try {
    return await oso.isAllowed(user, action, resource);
  } catch (error) {
    console.error("Authorization check failed:", error);
    return false;
  }
};

// Loan application authorization middleware
export const authorizeLoanAccess = (action: string) => {
  return async (req: any, res: any, next: any) => {
    try {
      const user = req.user || req.session.user;
      const resource = { type: "loan_application", ...req.body };
      
      const allowed = await checkPermission(user, action, resource);
      
      if (!allowed) {
        return res.status(403).json({ error: "Access denied" });
      }
      
      next();
    } catch (error) {
      console.error("Authorization middleware error:", error);
      res.status(500).json({ error: "Authorization failed" });
    }
  };
};