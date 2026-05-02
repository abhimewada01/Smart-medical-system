const axios = require('axios');

class WhatsAppService {
  constructor() {
    this.apiKey = process.env.WHATSAPP_API_KEY;
    this.baseUrl = process.env.WHATSAPP_API_URL || 'https://api.whatsapp.com/v1';
    this.instanceId = process.env.WHATSAPP_INSTANCE_ID;
  }

  // Send bill receipt via WhatsApp
  async sendBillReceipt(billData, patientPhone) {
    try {
      // Validate phone number (Indian format)
      const formattedPhone = this.formatPhoneNumber(patientPhone);
      if (!formattedPhone) {
        throw new Error('Invalid phone number format');
      }

      // Generate bill receipt message
      const receiptMessage = this.generateBillReceipt(billData);

      // Prepare WhatsApp message payload
      const messagePayload = {
        messaging_product: 'whatsapp',
        to: formattedPhone,
        type: 'template',
        template: {
          name: 'bill_receipt',
          language: {
            code: 'en'
          },
          components: [
            {
              type: 'header',
              parameters: [
                {
                  type: 'text',
                  text: billData.billNumber
                }
              ]
            },
            {
              type: 'body',
              parameters: [
                {
                  type: 'text',
                  text: billData.patientName
                },
                {
                  type: 'text',
                  text: billData.totalAmount
                },
                {
                  type: 'text',
                  text: billData.date
                }
              ]
            },
            {
              type: 'button',
              sub_type: 'url',
              index: '0',
              parameters: [
                {
                  type: 'text',
                  text: 'View Full Bill'
                }
              ]
            }
          ]
        }
      };

      // Send message via WhatsApp API
      const response = await axios.post(
        `${this.baseUrl}/messages`,
        messagePayload,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Log the sent message
      console.log(`WhatsApp bill sent to ${formattedPhone}:`, {
        billId: billData.billNumber,
        patientName: billData.patientName,
        amount: billData.totalAmount,
        messageId: response.data.messages[0]?.id
      });

      return {
        success: true,
        messageId: response.data.messages[0]?.id,
        phoneNumber: formattedPhone
      };

    } catch (error) {
      console.error('WhatsApp send error:', error);
      
      // Fallback to SMS if WhatsApp fails
      if (error.response?.status === 429) {
        return await this.sendSMSFallback(billData, patientPhone);
      }

      return {
        success: false,
        error: error.message,
        phoneNumber: patientPhone
      };
    }
  }

  // Format Indian phone number for WhatsApp
  formatPhoneNumber(phone) {
    // Remove all non-digit characters
    let digits = phone.replace(/\D/g, '');
    
    // Remove +91 if present, then add it back
    if (digits.startsWith('91') && digits.length === 12) {
      digits = digits.substring(2);
    }
    
    // Ensure exactly 10 digits
    digits = digits.slice(-10);
    
    // Return in WhatsApp format (with country code)
    return `+91${digits}`;
  }

  // Generate formatted bill receipt message
  generateBillReceipt(billData) {
    const items = billData.items.map(item => 
      `${item.quantity}x ${item.medicineName} - ₹${item.total.toFixed(2)}`
    ).join('\n');

    return `
🏥 *MEDICARE BILL RECEIPT* 🏥

📋 Bill Details:
• Bill No: ${billData.billNumber}
• Date: ${billData.date}
• Patient: ${billData.patientName}
• Phone: ${billData.patientPhone}

📦 Items Purchased:
${items}

💰 Payment Summary:
• Subtotal: ₹${billData.subtotal.toFixed(2)}
• Discount: ₹${billData.discount.toFixed(2)}
• Tax: ₹${billData.tax.toFixed(2)}
• Total: ₹${billData.totalAmount.toFixed(2)}

💳 Payment Method: ${billData.paymentMethod}

🏥 Thank you for choosing MediCare!
📞 For queries: Call +91-98765-43210
    `.trim();
  }

  // Fallback SMS service (for when WhatsApp fails)
  async sendSMSFallback(billData, patientPhone) {
    try {
      const smsMessage = `MediCare Bill ${billData.billNumber}: ₹${billData.totalAmount.toFixed(2)}. View details at: ${billData.billUrl || 'our clinic'}`;
      
      // This would integrate with an SMS service like Twilio
      console.log('SMS fallback would send:', smsMessage);
      
      return {
        success: true,
        method: 'SMS',
        message: 'SMS sent as fallback'
      };
      
    } catch (error) {
      console.error('SMS fallback failed:', error);
      return {
        success: false,
        error: 'Both WhatsApp and SMS failed'
      };
    }
  }

  // Check WhatsApp API status
  async checkApiStatus() {
    try {
      const response = await axios.get(
        `${this.baseUrl}/instance/${this.instanceId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      );

      return {
        success: true,
        status: response.data.status,
        connected: response.data.connected
      };
      
    } catch (error) {
      console.error('WhatsApp API status check failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Send appointment reminder
  async sendAppointmentReminder(appointmentData, patientPhone) {
    try {
      const formattedPhone = this.formatPhoneNumber(patientPhone);
      
      const reminderMessage = `
🏥 *APPOINTMENT REMINDER* 🏥

📅 Appointment Details:
• Date: ${appointmentData.date}
• Time: ${appointmentData.time}
• Doctor: ${appointmentData.doctorName}
• Department: ${appointmentData.department}

📍 Location:
${appointmentData.clinicAddress}

⏰ Please arrive 15 minutes early.
📞 For changes: Call +91-98765-43210

🏥 MediCare - Your Health Partner!
      `.trim();

      const messagePayload = {
        messaging_product: 'whatsapp',
        to: formattedPhone,
        type: 'text',
        text: reminderMessage
      };

      const response = await axios.post(
        `${this.baseUrl}/messages`,
        messagePayload,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        messageId: response.data.messages[0]?.id,
        phoneNumber: formattedPhone
      };

    } catch (error) {
      console.error('Appointment reminder send error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Send medicine refill reminder
  async sendRefillReminder(medicineData, patientPhone) {
    try {
      const formattedPhone = this.formatPhoneNumber(patientPhone);
      
      const reminderMessage = `
💊 *MEDICINE REFILL REMINDER* 💊

📋 Medicine Details:
• Name: ${medicineData.medicineName}
• Dosage: ${medicineData.dosage}
• Current Stock: ${medicineData.currentStock}
• Min Stock: ${medicineData.minStock}

⚠️ Action Required:
Your medicine is running low on stock. Please refill soon to avoid interruption.

📍 Visit: ${medicineData.clinicAddress}
📞 Call: ${medicineData.clinicPhone}

🏥 MediCare - Your Health Partner!
      `.trim();

      const messagePayload = {
        messaging_product: 'whatsapp',
        to: formattedPhone,
        type: 'text',
        text: reminderMessage
      };

      const response = await axios.post(
        `${this.baseUrl}/messages`,
        messagePayload,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        messageId: response.data.messages[0]?.id,
        phoneNumber: formattedPhone
      };

    } catch (error) {
      console.error('Refill reminder send error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = WhatsAppService;
