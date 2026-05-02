# Backend Architecture Analysis - User Data Storage

## **Current Implementation Status**

Your project currently uses a **Frontend-Only Mock Architecture** - there is no actual backend server or database. Let me break down exactly where user data is stored and how it flows.

---

## **1. Data Storage Locations**

### **Primary Storage: Mock Database (In-Memory)**
```javascript
// Location: src/app/contexts/AuthContext.tsx (Lines 25-60)
const mockUsers = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@medicareclinic.com',
    password: 'admin123',           // Plain text (security issue!)
    phone: '+91 9876543210',
    address: '123 Medical Center, Delhi, India 110001',
    clinicName: 'MediCare Central Clinic',
    role: 'Administrator',
    avatar: 'SJ'
  },
  // ... 2 more users
];
```

### **Secondary Storage: Browser localStorage**
```javascript
// Location: AuthContext.tsx (Lines 68-84)
// Stored data:
localStorage.setItem('authToken', 'token_1713123456789_1');
localStorage.setItem('userData', JSON.stringify(userObject));
```

---

## **2. Data Models/Schemas**

### **User Interface Definition**
```typescript
// Location: src/app/contexts/AuthContext.tsx (Lines 3-12)
interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  clinicName: string;
  role: string;
  avatar?: string;
}
```

### **Auth Context Interface**
```typescript
// Location: src/app/contexts/AuthContext.tsx (Lines 14-21)
interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  isLoading: boolean;
}
```

---

## **3. API Routes (Mock Implementation)**

### **Authentication Routes**
```javascript
// Location: AuthContext.tsx (Lines 86-130)
// POST /api/auth/login (Mock Implementation)
const login = async (email: string, password: string): Promise<boolean> => {
  // 1. Simulate network delay (1000ms)
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 2. Find user in mock database
  const foundUser = mockUsers.find(u => u.email === email && u.password === password);
  
  // 3. Generate token
  const authToken = `token_${Date.now()}_${foundUser.id}`;
  
  // 4. Save to localStorage
  localStorage.setItem('authToken', authToken);
  localStorage.setItem('userData', JSON.stringify(foundUser));
  
  return foundUser !== undefined;
};

// POST /api/auth/logout (Mock Implementation)
const logout = () => {
  setUser(null);
  setToken(null);
  localStorage.removeItem('authToken');
  localStorage.removeItem('userData');
};

// PUT /api/users/profile (Mock Implementation)
const updateUser = (userData: Partial<User>) => {
  const updatedUser = { ...user, ...userData };
  setUser(updatedUser);
  localStorage.setItem('userData', JSON.stringify(updatedUser));
};
```

---

## **4. Frontend-Backend Connection**

### **Current Connection Method: Direct Context**
```javascript
// Frontend components connect directly to AuthContext
import { useAuth } from '../contexts/AuthContext';

const { user, login, logout, updateUser } = useAuth();
```

### **No Actual HTTP Requests**
- Your app does NOT make real API calls
- No fetch() or axios calls to backend endpoints
- All "API" calls are simulated in-memory functions

---

## **5. Data Flow Analysis**

### **Login Flow**
```
User enters credentials
    |
    v
Login Component calls useAuth().login()
    |
    v
AuthContext.login() searches mockUsers array
    |
    v
If found: Save to localStorage + update state
    |
    v
Redirect to dashboard
```

### **Profile Update Flow**
```
User edits profile form
    |
    v
Profile Component calls useAuth().updateUser()
    |
    v
AuthContext.updateUser() updates in-memory state
    |
    v
Save to localStorage
    |
    v
UI re-renders with new data
```

---

## **6. Data Verification Methods**

### **Check localStorage (Browser Console)**
```javascript
// Check if data is stored
console.log('Token:', localStorage.getItem('authToken'));
console.log('User Data:', JSON.parse(localStorage.getItem('userData')));

// Verify specific fields
const userData = JSON.parse(localStorage.getItem('userData'));
console.log('Name:', userData?.name);
console.log('Email:', userData?.email);
console.log('Phone:', userData?.phone);
```

### **Check React State (React DevTools)**
```javascript
// In browser console
const authContext = document.querySelector('[data-reactroot]')._reactInternalInstance;
console.log('Current User State:', authContext?.context?.user);
```

### **Monitor State Changes**
```javascript
// Add to AuthContext.tsx for debugging
useEffect(() => {
  console.log('User state changed:', user);
}, [user]);

useEffect(() => {
  console.log('Token state changed:', token);
}, [token]);
```

---

## **7. Current Limitations & Issues**

### **Security Issues**
1. **Plain text passwords** stored in mock database
2. **No real authentication** - just array.find()
3. **No JWT validation** - tokens are just strings
4. **No session management**

### **Data Persistence Issues**
1. **No database** - data resets on page reload of mockUsers
2. **localStorage only** - limited storage capacity
3. **No data validation** - any data can be saved
4. **No backup/recovery** - data lost if localStorage cleared

### **Scalability Issues**
1. **No real API** - cannot handle multiple users
2. **No concurrent access** - single-user only
3. **No data relationships** - no patient/medicine links
4. **No audit trail** - no change tracking

---

## **8. Production Implementation Plan**

### **Recommended Backend Stack**
```
Backend: Node.js + Express.js
Database: PostgreSQL (or MySQL)
ORM: Sequelize or Prisma
Authentication: JWT + bcrypt
API: RESTful endpoints
```

### **Database Schema (Recommended)**
```sql
-- Users Table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  clinic_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'User',
  avatar VARCHAR(10),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sessions Table
CREATE TABLE user_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **API Endpoints (Real Implementation)**
```javascript
// auth.js - Authentication Routes
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  // 1. Find user in database
  const user = await User.findOne({ where: { email } });
  
  // 2. Verify password
  const isValid = await bcrypt.compare(password, user.password_hash);
  
  // 3. Generate JWT token
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
  
  // 4. Save session
  await Session.create({ userId: user.id, token, expiresAt });
  
  res.json({ success: true, token, user });
});

// users.js - Profile Routes
router.put('/profile', authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const updates = req.body;
  
  // Update user in database
  const user = await User.update(updates, { where: { id: userId } });
  
  res.json({ success: true, user });
});
```

---

## **9. How to Verify Current Implementation**

### **Step 1: Test Login Flow**
```javascript
// 1. Open browser dev tools
// 2. Go to Console tab
// 3. Login with test credentials
// 4. Check console logs for "Auth initialized with user:"
```

### **Step 2: Test Profile Update**
```javascript
// 1. Go to Profile page
// 2. Change name and save
// 3. Check localStorage: localStorage.getItem('userData')
// 4. Refresh page and verify data persists
```

### **Step 3: Check Data Integrity**
```javascript
// In browser console
const userData = JSON.parse(localStorage.getItem('userData'));
console.log('All user fields:', {
  name: userData?.name,
  email: userData?.email,
  phone: userData?.phone,
  address: userData?.address,
  clinicName: userData?.clinicName,
  role: userData?.role
});
```

---

## **10. Migration Path to Real Backend**

### **Phase 1: Keep Current Structure**
- Maintain AuthContext for state management
- Replace mock functions with real API calls
- Keep localStorage for temporary caching

### **Phase 2: Add Real Backend**
- Create Express.js server
- Implement real database models
- Add authentication middleware

### **Phase 3: Full Integration**
- Remove mock data completely
- Add proper error handling
- Implement real-time updates

---

## **Summary**

**Current State**: Your project uses a frontend-only mock system with no real backend or database. User data is stored in:
1. **Mock array** in AuthContext.tsx (resets on page reload)
2. **localStorage** (persists across sessions)

**No actual API calls, database connections, or server-side processing exists.**

**For production use**, you need to implement a real backend with proper database, authentication, and API endpoints.
