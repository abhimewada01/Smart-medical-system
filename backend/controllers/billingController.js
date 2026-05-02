const { Medicine } = require('../models');
const WhatsAppService = require('../services/whatsappService');

// Generate Bill Receipt
exports.generateBillReceipt = async (req, res) => {
  try {
    const { patientName, patientPhone, items, discount, tax, paymentMethod } = req.body;
    
    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discountAmount = subtotal * (discount / 100);
    const taxAmount = (subtotal - discountAmount) * (tax / 100);
    const totalAmount = subtotal - discountAmount + taxAmount;
    
    // Generate bill number
    const billNumber = `INV-${Date.now().toString().slice(-6)}`;
    const billDate = new Date().toISOString().split('T')[0];
    
    // Create bill data object
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
};

// Send Bill via WhatsApp
exports.sendBillViaWhatsApp = async (req, res) => {
  try {
    const { billId, patientPhone } = req.body;
    
    // In a real implementation, you would fetch bill from database
    // For now, we'll use the bill data from the request
    const billData = req.body.billData;
    
    if (!billData || !patientPhone) {
      return res.status(400).json({
        success: false,
        message: 'Bill data and patient phone are required'
      });
    }
    
    // Initialize WhatsApp service
    const whatsappService = new WhatsAppService();
    
    // Send bill receipt via WhatsApp
    const result = await whatsappService.sendBillReceipt(billData, patientPhone);
    
    if (result.success) {
      res.status(200).json({
        success: true,
        data: {
          messageId: result.messageId,
          phoneNumber: result.phoneNumber,
          billNumber: billData.billNumber
        },
        message: 'Bill sent successfully via WhatsApp'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send bill via WhatsApp',
        error: result.error
      });
    }
    
  } catch (error) {
    console.error('Send bill via WhatsApp error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send bill via WhatsApp',
      error: error.message
    });
  }
};

// Send Bill via Email (alternative)
exports.sendBillViaEmail = async (req, res) => {
  try {
    const { billId, patientEmail, billData } = req.body;
    
    if (!billData || !patientEmail) {
      return res.status(400).json({
        success: false,
        message: 'Bill data and patient email are required'
      });
    }
    
    // In a real implementation, you would use a service like SendGrid or Nodemailer
    const emailContent = `
      <h2>MediCare Bill Receipt</h2>
      <p>Bill Number: ${billData.billNumber}</p>
      <p>Date: ${billData.date}</p>
      <p>Patient: ${billData.patientName}</p>
      <p>Total Amount: ₹${billData.totalAmount.toFixed(2)}</p>
      <p>Payment Method: ${billData.paymentMethod}</p>
    `;
    
    console.log('Email bill content generated:', emailContent);
    
    res.status(200).json({
      success: true,
      data: {
        email: patientEmail,
        billNumber: billData.billNumber
      },
      message: 'Bill email content generated (email service integration needed)'
    });
    
  } catch (error) {
    console.error('Send bill via email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate email bill',
      error: error.message
    });
  }
};

// Get Bill History
exports.getBillHistory = async (req, res) => {
  try {
    const { page = 1, limit = 20, patientPhone, startDate, endDate } = req.query;
    const offset = (page - 1) * limit;
    
    // In a real implementation, you would query a bills table
    // For now, return mock data
    const mockBills = [
      {
        id: 1,
        billNumber: 'INV-123456',
        date: '2026-05-01',
        patientName: 'John Doe',
        patientPhone: '+91 9876543210',
        totalAmount: 2499.50,
        paymentMethod: 'Cash',
        status: 'Sent'
      },
      {
        id: 2,
        billNumber: 'INV-123457',
        date: '2026-05-02',
        patientName: 'Sarah Wilson',
        patientPhone: '+91 8765432109',
        totalAmount: 1899.00,
        paymentMethod: 'Card',
        status: 'Sent'
      }
    ];
    
    // Apply filters
    let filteredBills = mockBills;
    
    if (patientPhone) {
      filteredBills = filteredBills.filter(bill => 
        bill.patientPhone.includes(patientPhone)
      );
    }
    
    if (startDate) {
      filteredBills = filteredBills.filter(bill => 
        bill.date >= startDate
      );
    }
    
    if (endDate) {
      filteredBills = filteredBills.filter(bill => 
        bill.date <= endDate
      );
    }
    
    res.status(200).json({
      success: true,
      data: filteredBills.slice(offset, offset + limit),
      pagination: {
        total: filteredBills.length,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(filteredBills.length / limit)
      }
    });
    
  } catch (error) {
    console.error('Get bill history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bill history',
      error: error.message
    });
  }
};
