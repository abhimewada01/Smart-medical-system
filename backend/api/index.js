import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Initialize Express app
const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Test route - Backend Running Check
app.get('/api', (req, res) => {
  res.status(200).json({
    message: 'Backend Running 🚀',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// AI endpoint - Dummy AI Response
app.post('/api/ai', (req, res) => {
  try {
    const userInput = req.body;
    
    console.log('AI endpoint called with:', userInput);
    
    // Dummy AI response
    const aiResponse = {
      success: true,
      response: 'AI feature working',
      data: {
        timestamp: new Date().toISOString(),
        input_received: userInput,
        ai_status: 'operational',
        features: {
          medicine_recommendations: 'active',
          stock_analysis: 'active',
          pattern_detection: 'active'
        }
      },
      message: 'AI processing completed successfully'
    };
    
    res.status(200).json(aiResponse);
  } catch (error) {
    console.error('AI endpoint error:', error);
    res.status(500).json({
      success: false,
      message: 'AI processing failed',
      error: error.message
    });
  }
});

// Medicine Management Routes
app.get('/api/medicines', (req, res) => {
  try {
    // Mock medicines data for serverless
    const mockMedicines = [
      {
        id: 1,
        name: 'Paracetamol 500mg',
        category: 'Pain Relief',
        stock: 45,
        min_stock: 100,
        price_usd: 2.50,
        price_inr: 207.50,
        status: 'Critical',
        expiry_date: '2026-12-31',
        supplier: 'PharmaCorp'
      },
      {
        id: 2,
        name: 'Amoxicillin 250mg',
        category: 'Antibiotic',
        stock: 20,
        min_stock: 50,
        price_usd: 5.00,
        price_inr: 415.00,
        status: 'Critical',
        expiry_date: '2026-10-15',
        supplier: 'MediSupply'
      },
      {
        id: 3,
        name: 'Ibuprofen 400mg',
        category: 'Pain Relief',
        stock: 150,
        min_stock: 80,
        price_usd: 3.50,
        price_inr: 290.50,
        status: 'Good',
        expiry_date: '2027-03-20',
        supplier: 'PharmaCorp'
      }
    ];
    
    const { page = 1, limit = 50, category, search } = req.query;
    const offset = (page - 1) * limit;
    
    let filteredMedicines = mockMedicines;
    
    if (category) {
      filteredMedicines = filteredMedicines.filter(med => med.category === category);
    }
    
    if (search) {
      filteredMedicines = filteredMedicines.filter(med => 
        med.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    const paginatedMedicines = filteredMedicines.slice(offset, offset + parseInt(limit));
    
    res.status(200).json({
      success: true,
      data: paginatedMedicines,
      pagination: {
        total: filteredMedicines.length,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(filteredMedicines.length / limit)
      }
    });
  } catch (error) {
    console.error('Get medicines error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch medicines',
      error: error.message
    });
  }
});

app.post('/api/medicines', (req, res) => {
  try {
    const { name, category, stock, min_stock, price_usd, expiry_date, supplier } = req.body;
    
    // Validate required fields
    if (!name || !category || stock === undefined || min_stock === undefined || !price_usd || !expiry_date) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }
    
    // Convert USD to INR (using fixed rate for serverless)
    const price_inr = parseFloat(price_usd) * 83;
    
    // Auto-calculate status
    const status = stock < min_stock ? 'Critical' : 'Good';
    
    // Create mock medicine (in real app, would save to database)
    const newMedicine = {
      id: Date.now(),
      name,
      category,
      stock: parseInt(stock),
      min_stock: parseInt(min_stock),
      price_usd: parseFloat(price_usd),
      price_inr,
      expiry_date,
      supplier: supplier || 'Unknown',
      status,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    res.status(201).json({
      success: true,
      data: newMedicine,
      message: 'Medicine created successfully'
    });
  } catch (error) {
    console.error('Create medicine error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create medicine',
      error: error.message
    });
  }
});

// AI Recommendations Route
app.get('/api/ai/recommendations', (req, res) => {
  try {
    const recommendations = [
      {
        type: 'low_stock',
        priority: 'high',
        title: '🚨 Critical: Low Stock Medicines',
        description: '2 medicines need immediate restocking',
        medicines: [
          { name: 'Paracetamol 500mg', current_stock: 45, min_stock: 100 },
          { name: 'Amoxicillin 250mg', current_stock: 20, min_stock: 50 }
        ],
        suggested_action: 'Contact suppliers immediately'
      },
      {
        type: 'expiry',
        priority: 'medium',
        title: '⏰ Alert: Medicines Expiring Soon',
        description: '1 medicine will expire within 30 days',
        medicines: [
          { name: 'Amoxicillin 250mg', expiry_date: '2026-10-15', days_until_expiry: 45 }
        ],
        suggested_action: 'Consider promotional sales or return to suppliers'
      }
    ];
    
    res.status(200).json({
      success: true,
      data: recommendations,
      summary: {
        total_medicines: 3,
        critical_medicines: 2,
        expiring_medicines: 1,
        recommendations_count: 2,
        generated_at: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('AI recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate AI recommendations',
      error: error.message
    });
  }
});

// Dashboard Statistics Route
app.get('/api/dashboard/stats', (req, res) => {
  try {
    const stats = {
      overview: {
        total_medicines: 3,
        low_stock_count: 2,
        expiring_soon_count: 1,
        stock_health_percentage: 66.7,
        active_sessions: 5
      },
      category_distribution: [
        { category: 'Pain Relief', count: 2 },
        { category: 'Antibiotic', count: 1 }
      ],
      supplier_distribution: [
        { supplier: 'PharmaCorp', count: 2 },
        { supplier: 'MediSupply', count: 1 }
      ],
      category_issues: [
        { category: 'Pain Relief', total_medicines: 2, critical_medicines: 1, issue_percentage: '50.0' },
        { category: 'Antibiotic', total_medicines: 1, critical_medicines: 1, issue_percentage: '100.0' }
      ],
      recent_activity: [
        { id: 1, name: 'Paracetamol 500mg', action: 'updated', timestamp: '2026-05-02T10:30:00Z' },
        { id: 2, name: 'Amoxicillin 250mg', action: 'created', timestamp: '2026-05-02T09:15:00Z' }
      ]
    };
    
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
      error: error.message
    });
  }
});

// Billing Routes
app.post('/api/billing/generate-receipt', (req, res) => {
  try {
    const { patientName, patientPhone, items, discount = 0, tax = 10, paymentMethod = 'Cash' } = req.body;
    
    if (!patientName || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Patient name and items are required'
      });
    }
    
    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discountAmount = subtotal * (discount / 100);
    const taxAmount = (subtotal - discountAmount) * (tax / 100);
    const totalAmount = subtotal - discountAmount + taxAmount;
    
    // Generate bill number
    const billNumber = `INV-${Date.now().toString().slice(-6)}`;
    const billDate = new Date().toISOString().split('T')[0];
    
    const billData = {
      billNumber,
      date: billDate,
      patientName,
      patientPhone,
      items: items.map(item => ({
        medicineName: item.medicineName,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity
      })),
      subtotal,
      discount,
      tax,
      totalAmount,
      paymentMethod
    };
    
    res.status(200).json({
      success: true,
      data: billData,
      message: 'Bill receipt generated successfully'
    });
  } catch (error) {
    console.error('Generate bill receipt error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate bill receipt',
      error: error.message
    });
  }
});

app.post('/api/billing/send-whatsapp', (req, res) => {
  try {
    const { billData, patientPhone } = req.body;
    
    if (!billData || !patientPhone) {
      return res.status(400).json({
        success: false,
        message: 'Bill data and patient phone are required'
      });
    }
    
    // Mock WhatsApp send (in real app, would integrate with WhatsApp API)
    console.log('WhatsApp bill sent to:', patientPhone);
    console.log('Bill data:', billData);
    
    res.status(200).json({
      success: true,
      data: {
        messageId: `msg_${Date.now()}`,
        phoneNumber: patientPhone,
        billNumber: billData.billNumber
      },
      message: 'Bill sent successfully via WhatsApp'
    });
  } catch (error) {
    console.error('Send bill via WhatsApp error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send bill via WhatsApp',
      error: error.message
    });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.originalUrl,
    available_endpoints: [
      '/api',
      '/api/health',
      '/api/ai',
      '/api/medicines',
      '/api/ai/recommendations',
      '/api/dashboard/stats',
      '/api/billing/generate-receipt',
      '/api/billing/send-whatsapp'
    ]
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// Export the Express app for Vercel
export default app;
