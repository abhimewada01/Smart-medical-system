# Smart Medical System Backend API

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- MySQL 8.0+
- npm or yarn

### Installation
```bash
# Clone the project
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your database credentials
nano .env

# Create database (run once)
mysql -u root -p < database/schema.sql

# Start development server
npm run dev
```

### Production Deployment
```bash
# Install production dependencies
npm install --production

# Start production server
npm start
```

---

## 📊 Database Setup

### 1. MySQL Database Creation
```bash
# Connect to MySQL
mysql -u root -p

# Run the schema
source database/schema.sql
```

### 2. Environment Variables
```bash
# .env file configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=medical_system
JWT_SECRET=your_super_secret_jwt_key
PORT=3000
CURRENCY_API_KEY=your_currency_api_key
```

---

## 🛠️ API Endpoints

### Authentication
All endpoints require `Authorization: Bearer <token>` header except login.

#### POST `/api/auth/login`
```json
Request:
{
  "email": "sarah.johnson@medicareclinic.com",
  "password": "admin123"
}

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Dr. Sarah Johnson",
    "email": "sarah.johnson@medicareclinic.com",
    "role": "Administrator"
  }
}
```

### Medicine Management

#### GET `/api/medicines`
Get all medicines with pagination and search.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 50)
- `category` (string): Filter by category
- `search` (string): Search by name

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Paracetamol 500mg",
      "category": "Pain Relief",
      "stock": 45,
      "min_stock": 100,
      "price_usd": 2.50,
      "price_inr": 207.50,
      "status": "Good",
      "expiry_date": "2026-12-31",
      "supplier": "PharmaCorp"
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 50,
    "pages": 1
  }
}
```

#### POST `/api/medicines`
Create new medicine.

**Request:**
```json
{
  "name": "New Medicine",
  "category": "Pain Relief",
  "stock": 100,
  "min_stock": 20,
  "price_usd": 5.00,
  "expiry_date": "2026-12-31",
  "supplier": "PharmaCorp"
}
```

#### PUT `/api/medicines/:id`
Update medicine by ID.

#### DELETE `/api/medicines/:id`
Delete medicine by ID.

#### GET `/api/medicines/low-stock`
Get medicines with stock below minimum level.

#### GET `/api/medicines/expiring-soon`
Get medicines expiring within 30 days.

### AI Recommendations

#### GET `/api/ai/recommendations`
Get intelligent recommendations based on current data.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "type": "low_stock",
      "priority": "high",
      "title": "🚨 Critical: Low Stock Medicines",
      "description": "3 medicines need immediate restocking",
      "medicines": [...],
      "suggested_action": "Contact suppliers immediately"
    }
  ],
  "summary": {
    "total_medicines": 50,
    "critical_medicines": 3,
    "expiring_medicines": 5,
    "recommendations_count": 4
  }
}
```

### Dashboard Statistics

#### GET `/api/dashboard/stats`
Get comprehensive dashboard statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "total_medicines": 50,
      "low_stock_count": 3,
      "expiring_soon_count": 5,
      "stock_health_percentage": 94.0,
      "active_sessions": 12
    },
    "category_distribution": [...],
    "supplier_distribution": [...],
    "category_issues": [...],
    "recent_activity": [...]
  }
}
```

---

## 🤖 Features

### 1. Medicine Management
- ✅ CRUD operations (Create, Read, Update, Delete)
- ✅ Automatic stock status calculation
- ✅ Currency conversion (USD → INR)
- ✅ Search and filtering
- ✅ Pagination support
- ✅ Input validation

### 2. AI Recommendations Engine
- ✅ Low stock detection and alerts
- ✅ Expiry date monitoring
- ✅ Stock pattern analysis
- ✅ Supplier performance analysis
- ✅ Category-wise insights
- ✅ Specific medicine recommendations

### 3. Currency Conversion
- ✅ Real-time API integration (exchangerate-api.com)
- ✅ Fallback conversion rate (83 INR/USD)
- ✅ Automatic INR calculation on medicine creation/update
- ✅ Both USD and INR stored in database

### 4. Security & Performance
- ✅ JWT authentication
- ✅ Rate limiting (100 requests/15min)
- ✅ CORS configuration
- ✅ Input validation
- ✅ SQL injection protection
- ✅ Password hashing with bcrypt
- ✅ Request logging

### 5. Database Features
- ✅ Automatic status calculation
- ✅ Timestamps for auditing
- ✅ Foreign key relationships
- ✅ Indexes for performance
- ✅ Data validation at model level

---

## 🔧 Development

### Running in Development
```bash
npm run dev
```
Server runs on `http://localhost:3000` with auto-reload on file changes.

### Database Migrations
```bash
# Create initial database
mysql -u root -p < database/schema.sql

# Reset database (development only)
npm run reset-db
```

### Testing
```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

---

## 🌐 API Usage Examples

### Using curl
```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"sarah.johnson@medicareclinic.com","password":"admin123"}'

# Get medicines
curl -X GET http://localhost:3000/api/medicines \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create medicine
curl -X POST http://localhost:3000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name":"Test Medicine","category":"Pain Relief","stock":50,"min_stock":10,"price_usd":5.00}'

# Get AI recommendations
curl -X GET http://localhost:3000/api/ai/recommendations \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Using JavaScript/Fetch
```javascript
// Login
const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'sarah.johnson@medicareclinic.com',
    password: 'admin123'
  })
});

const { token } = await loginResponse.json();

// Get medicines
const medicinesResponse = await fetch('http://localhost:3000/api/medicines', {
  headers: { 'Authorization': `Bearer ${token}` }
});

const { data: medicines } = await medicinesResponse.json();
```

---

## 📁 Project Structure

```
backend/
├── config/
│   └── database.js          # Database configuration
├── controllers/
│   ├── medicineController.js  # Medicine CRUD operations
│   ├── aiController.js       # AI recommendations
│   └── dashboardController.js # Dashboard statistics
├── middleware/
│   └── auth.js             # JWT authentication
├── models/
│   └── index.js            # Sequelize models
├── routes/
│   ├── medicineRoutes.js     # Medicine API routes
│   ├── aiRoutes.js          # AI API routes
│   └── dashboardRoutes.js    # Dashboard API routes
├── database/
│   └── schema.sql           # Database creation script
├── .env.example              # Environment variables template
├── server.js                # Express server setup
├── package.json             # Dependencies and scripts
└── README.md               # This file
```

---

## 🔍 Monitoring & Debugging

### Health Check
```bash
curl http://localhost:3000/health
```

### Logs
- All requests logged to console with timestamp
- Errors logged with stack traces
- Database queries logged in development mode

### Performance Monitoring
- Request/response times in logs
- Database query performance monitoring
- Rate limiting statistics

---

## 🚀 Production Deployment

### Environment Setup
```bash
# Production environment variables
NODE_ENV=production
DB_HOST=your-production-db-host
DB_PORT=3306
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=medical_system_prod
JWT_SECRET=your-production-jwt-secret
PORT=3000
CORS_ORIGIN=https://your-frontend-domain.com
```

### Security Considerations
- Use HTTPS in production
- Set strong JWT secret
- Configure database user with limited privileges
- Set up database backups
- Monitor logs regularly
- Use environment variables for secrets

### Scaling Recommendations
- Use connection pooling (configured)
- Implement Redis for session storage
- Add database read replicas
- Use load balancer for multiple instances
- Set up monitoring and alerting

---

## 🤝 Support

For issues and questions:
- Check the console logs for detailed error messages
- Verify database connection and permissions
- Ensure all environment variables are set
- Check API responses with proper authentication

Built with ❤️ using Node.js, Express.js, Sequelize, and MySQL
