// Simple Vercel Serverless Function
// No Express, no middleware, just pure Node.js handler

export default function handler(req, res) {
  // Enable CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Route: GET /api - Test endpoint
  if (req.method === 'GET' && req.url === '/api') {
    return res.status(200).json({ 
      message: 'Backend Running 🚀',
      timestamp: new Date().toISOString()
    });
  }

  // Route: GET /api/medicines - Return sample medicines
  if (req.method === 'GET' && req.url === '/api/medicines') {
    const medicines = [
      { 
        id: 1, 
        name: 'Paracetamol', 
        stock: 45, 
        price: 207.50,
        category: 'Pain Relief'
      },
      { 
        id: 2, 
        name: 'Amoxicillin', 
        stock: 20, 
        price: 415.00,
        category: 'Antibiotic'
      },
      { 
        id: 3, 
        name: 'Ibuprofen', 
        stock: 150, 
        price: 290.50,
        category: 'Pain Relief'
      }
    ];
    
    return res.status(200).json({
      success: true,
      data: medicines,
      count: medicines.length
    });
  }

  // Route: POST /api/ai - AI endpoint
  if (req.method === 'POST' && req.url === '/api/ai') {
    // Accept any JSON input
    const userInput = req.body || {};
    
    return res.status(200).json({
      response: 'AI feature working',
      timestamp: new Date().toISOString(),
      input_received: userInput,
      status: 'operational'
    });
  }

  // Route: GET /api/health - Health check
  if (req.method === 'GET' && req.url === '/api/health') {
    return res.status(200).json({
      status: 'OK',
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    });
  }

  // 404 - Route not found
  return res.status(404).json({ 
    error: 'Route not found',
    available_routes: [
      'GET /api',
      'GET /api/medicines', 
      'POST /api/ai',
      'GET /api/health'
    ]
  });
}
