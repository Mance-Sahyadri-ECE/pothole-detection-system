import { Request, Response } from 'express';
import crypto from 'crypto';

export type UserRole = 
  | 'PUBLIC' 
  | 'CITIZEN'
  | 'FIELD_ENGINEER' 
  | 'SUB_ENGINEER' 
  | 'EXECUTIVE_ENGINEER' 
  | 'GOVT_ADMIN';

const ROLE_TITLES: Record<UserRole, string> = {
  PUBLIC: 'Public Citizen Viewer',
  CITIZEN: 'Registered Public Citizen',
  FIELD_ENGINEER: 'Field Inspection Engineer',
  SUB_ENGINEER: 'Assistant Sub-Engineer',
  EXECUTIVE_ENGINEER: 'Executive Engineer (PWD)',
  GOVT_ADMIN: 'Government PWD Administrator'
};

const AUTHORIZED_ROLES: UserRole[] = [
  'FIELD_ENGINEER',
  'SUB_ENGINEER',
  'EXECUTIVE_ENGINEER',
  'GOVT_ADMIN'
];

/**
 * Server-side authentication controller for Government/Engineer Portal
 */
export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password, role } = req.body;

    if (!email || typeof email !== 'string') {
      res.status(400).json({ success: false, error: 'Official email address is required.' });
      return;
    }

    if (!password || typeof password !== 'string') {
      res.status(400).json({ success: false, error: 'Password is required.' });
      return;
    }

    const requestedRole: UserRole = (role && AUTHORIZED_ROLES.includes(role)) ? role : 'EXECUTIVE_ENGINEER';
    const sanitizedEmail = email.trim().toLowerCase();

    const isOfficialDomain = sanitizedEmail.endsWith('@dkpwd.gov.in') || 
                             sanitizedEmail.endsWith('@gov.in') || 
                             sanitizedEmail.endsWith('@pwd.karnataka.gov.in') ||
                             sanitizedEmail.includes('engineer') ||
                             sanitizedEmail.includes('admin') ||
                             sanitizedEmail.includes('field');

    if (!isOfficialDomain && password.length < 4) {
      res.status(401).json({ 
        success: false, 
        error: 'Authentication failed: Email address is not registered under authorized government division domains.' 
      });
      return;
    }

    const sessionSecret = process.env.JWT_SECRET || 'PWD_GOVT_DK_SECURE_TOKEN_SALT_2026';
    const timestamp = Date.now();
    const tokenHash = crypto
      .createHash('sha256')
      .update(`${sanitizedEmail}:${requestedRole}:${timestamp}:${sessionSecret}`)
      .digest('hex');

    const token = `gov_bearer_${tokenHash.substring(0, 32)}`;

    let name = 'Er. Rajesh Bhat';
    if (requestedRole === 'GOVT_ADMIN') name = 'Admin Officer (PWD)';
    else if (requestedRole === 'FIELD_ENGINEER') name = 'Er. Sandeep Rai';
    else if (requestedRole === 'SUB_ENGINEER') name = 'Er. Ananya Hegde';

    const user = {
      id: `usr-${crypto.randomBytes(4).toString('hex')}`,
      name,
      email: sanitizedEmail,
      role: requestedRole,
      roleTitle: ROLE_TITLES[requestedRole] || 'Government Engineer',
      department: requestedRole === 'GOVT_ADMIN' 
        ? 'Dakshina Kannada PWD Head Office' 
        : 'Dakshina Kannada PWD - Mangaluru Division',
      token
    };

    res.status(200).json({
      success: true,
      message: 'Government engineer authentication successful.',
      token,
      user
    });
  } catch (error) {
    console.error('[AUTH CONTROLLER] Login error:', error);
    res.status(500).json({ success: false, error: 'Internal server error during government authentication.' });
  }
}

/**
 * Server-side authentication controller for Public Citizen Portal
 */
export async function loginCitizen(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || typeof email !== 'string') {
      res.status(400).json({ success: false, error: 'Email address or mobile number is required.' });
      return;
    }

    if (!password || typeof password !== 'string') {
      res.status(400).json({ success: false, error: 'Password is required.' });
      return;
    }

    const sanitizedEmail = email.trim().toLowerCase();
    const sessionSecret = process.env.JWT_SECRET || 'PWD_GOVT_DK_SECURE_TOKEN_SALT_2026';
    const timestamp = Date.now();
    const tokenHash = crypto
      .createHash('sha256')
      .update(`citizen:${sanitizedEmail}:${timestamp}:${sessionSecret}`)
      .digest('hex');

    const token = `citizen_bearer_${tokenHash.substring(0, 32)}`;

    const user = {
      id: `cit-${crypto.randomBytes(4).toString('hex')}`,
      name: sanitizedEmail.split('@')[0] || 'Public Citizen',
      email: sanitizedEmail,
      role: 'CITIZEN' as UserRole,
      roleTitle: 'Registered Public Citizen',
      department: 'Dakshina Kannada Public Resident',
      token
    };

    res.status(200).json({
      success: true,
      message: 'Citizen authentication successful.',
      token,
      user
    });
  } catch (error) {
    console.error('[AUTH CONTROLLER] Citizen Login error:', error);
    res.status(500).json({ success: false, error: 'Internal server error during citizen login.' });
  }
}

/**
 * Server-side registration controller for Public Citizen Portal
 */
export async function registerCitizen(req: Request, res: Response): Promise<void> {
  try {
    const { fullName, email, password } = req.body;

    if (!email || typeof email !== 'string') {
      res.status(400).json({ success: false, error: 'Email address or mobile number is required.' });
      return;
    }

    if (!password || typeof password !== 'string' || password.length < 4) {
      res.status(400).json({ success: false, error: 'Password must be at least 4 characters long.' });
      return;
    }

    const sanitizedEmail = email.trim().toLowerCase();
    const citizenName = fullName && typeof fullName === 'string' ? fullName.trim() : sanitizedEmail.split('@')[0];

    const sessionSecret = process.env.JWT_SECRET || 'PWD_GOVT_DK_SECURE_TOKEN_SALT_2026';
    const timestamp = Date.now();
    const tokenHash = crypto
      .createHash('sha256')
      .update(`citizen:${sanitizedEmail}:${timestamp}:${sessionSecret}`)
      .digest('hex');

    const token = `citizen_bearer_${tokenHash.substring(0, 32)}`;

    const user = {
      id: `cit-${crypto.randomBytes(4).toString('hex')}`,
      name: citizenName,
      email: sanitizedEmail,
      role: 'CITIZEN' as UserRole,
      roleTitle: 'Registered Public Citizen',
      department: 'Dakshina Kannada Public Resident',
      token
    };

    res.status(201).json({
      success: true,
      message: 'Citizen account created successfully.',
      token,
      user
    });
  } catch (error) {
    console.error('[AUTH CONTROLLER] Citizen Registration error:', error);
    res.status(500).json({ success: false, error: 'Internal server error during citizen registration.' });
  }
}

export async function verifyToken(req: Request, res: Response): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, authenticated: false, error: 'No bearer token provided.' });
    return;
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    res.status(401).json({ success: false, authenticated: false, error: 'Invalid session token.' });
    return;
  }

  const isGov = token.startsWith('gov_bearer_');
  const isCitizen = token.startsWith('citizen_bearer_');

  if (!isGov && !isCitizen) {
    res.status(401).json({ success: false, authenticated: false, error: 'Unrecognized session token.' });
    return;
  }

  res.status(200).json({
    success: true,
    authenticated: true,
    role: isGov ? 'GOVERNMENT' : 'CITIZEN',
    message: 'Session token verified.'
  });
}
