import { Request, Response, NextFunction } from 'express';

export interface AuthenticatedRequest extends Request {
  userRole?: string;
  userId?: string;
}

export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, error: 'Unauthorized: Missing session bearer token.' });
    return;
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    res.status(401).json({ success: false, error: 'Unauthorized: Invalid session token format.' });
    return;
  }

  if (token.startsWith('gov_bearer_')) {
    req.userRole = 'GOVERNMENT';
    next();
  } else if (token.startsWith('citizen_bearer_')) {
    req.userRole = 'CITIZEN';
    next();
  } else {
    res.status(401).json({ success: false, error: 'Unauthorized: Invalid or unrecognized session token.' });
  }
}

export function requireGovRole(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, error: 'Access denied: Authentication required for government operations.' });
    return;
  }

  const token = authHeader.split(' ')[1];
  if (!token || !token.startsWith('gov_bearer_')) {
    res.status(403).json({ 
      success: false, 
      error: 'Access denied: Citizen accounts do not have permission to modify government portal data.' 
    });
    return;
  }

  req.userRole = 'GOVERNMENT';
  next();
}
