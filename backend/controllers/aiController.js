const { Medicine } = require('../models');
const { Op } = require('sequelize');

// AI Recommendations Engine
exports.getRecommendations = async (req, res) => {
  try {
    const { medicine_id, stock_threshold = 10 } = req.query;
    
    // Get all medicines for analysis
    const medicines = await Medicine.findAll({
      order: [['stock', 'ASC']]
    });
    
    const recommendations = [];
    
    // Recommendation 1: Low Stock Alert
    const lowStockMedicines = medicines.filter(med => med.stock < med.min_stock);
    if (lowStockMedicines.length > 0) {
      recommendations.push({
        type: 'low_stock',
        priority: 'high',
        title: '🚨 Critical: Low Stock Medicines',
        description: `${lowStockMedicines.length} medicines need immediate restocking`,
        medicines: lowStockMedicines.map(med => ({
          id: med.id,
          name: med.name,
          current_stock: med.stock,
          min_stock: med.min_stock,
          status: med.status,
          action: 'restock_immediately'
        })),
        suggested_action: 'Contact suppliers immediately for these medicines'
      });
    }
    
    // Recommendation 2: Expiring Medicines
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    const expiringMedicines = medicines.filter(med => 
      new Date(med.expiry_date) <= thirtyDaysFromNow
    );
    
    if (expiringMedicines.length > 0) {
      recommendations.push({
        type: 'expiry',
        priority: 'high',
        title: '⏰ Alert: Medicines Expiring Soon',
        description: `${expiringMedicines.length} medicines will expire within 30 days`,
        medicines: expiringMedicines.map(med => ({
          id: med.id,
          name: med.name,
          expiry_date: med.expiry_date,
          days_until_expiry: Math.ceil((new Date(med.expiry_date) - new Date()) / (1000 * 60 * 60 * 24))
        })),
        suggested_action: 'Consider promotional sales or return to suppliers'
      });
    }
    
    // Recommendation 3: Stock Pattern Analysis
    const categoryAnalysis = {};
    medicines.forEach(med => {
      if (!categoryAnalysis[med.category]) {
        categoryAnalysis[med.category] = { total: 0, critical: 0, good: 0 };
      }
      categoryAnalysis[med.category].total++;
      if (med.status === 'Critical') {
        categoryAnalysis[med.category].critical++;
      } else {
        categoryAnalysis[med.category].good++;
      }
    });
    
    // Find categories with most issues
    const problemCategories = Object.entries(categoryAnalysis)
      .filter(([cat, data]) => data.critical > data.good)
      .map(([cat, data]) => ({
        category: cat,
        critical_count: data.critical,
        good_count: data.good,
        issue_percentage: ((data.critical / data.total) * 100).toFixed(1)
      }))
      .sort((a, b) => b.issue_percentage - a.issue_percentage);
    
    if (problemCategories.length > 0) {
      recommendations.push({
        type: 'pattern',
        priority: 'medium',
        title: '📊 Stock Pattern Analysis',
        description: 'Categories with critical stock issues detected',
        analysis: problemCategories,
        suggested_action: 'Review stock management for these categories'
      });
    }
    
    // Recommendation 4: Supplier Optimization
    const supplierAnalysis = {};
    medicines.forEach(med => {
      if (!supplierAnalysis[med.supplier]) {
        supplierAnalysis[med.supplier] = { 
          medicines: [], 
          avg_price: 0, 
          critical_count: 0 
        };
      }
      supplierAnalysis[med.supplier].medicines.push(med);
      supplierAnalysis[med.supplier].critical_count += med.status === 'Critical' ? 1 : 0;
    });
    
    // Calculate supplier performance
    Object.keys(supplierAnalysis).forEach(supplier => {
      const supplierData = supplierAnalysis[supplier];
      const totalPrice = supplierData.medicines.reduce((sum, med) => sum + parseFloat(med.price_usd), 0);
      supplierData.avg_price = totalPrice / supplierData.medicines.length;
      supplierData.critical_percentage = ((supplierData.critical_count / supplierData.medicines.length) * 100).toFixed(1);
    });
    
    const bestSuppliers = Object.entries(supplierAnalysis)
      .filter(([sup, data]) => data.critical_percentage < 20)
      .sort((a, b) => a[1].avg_price - b[1].avg_price)
      .slice(0, 3);
    
    if (bestSuppliers.length > 0) {
      recommendations.push({
        type: 'supplier',
        priority: 'low',
        title: '🏢 Supplier Optimization',
        description: 'Top performing suppliers with low critical stock issues',
        best_suppliers: bestSuppliers.map(([sup, data]) => ({
          supplier: sup,
          avg_price: data.avg_price.toFixed(2),
          critical_percentage: data.critical_percentage,
          medicines_count: data.medicines.length
        })),
        suggested_action: 'Consider increasing orders from top-performing suppliers'
      });
    }
    
    // Recommendation 5: Specific Medicine Analysis (if medicine_id provided)
    if (medicine_id) {
      const targetMedicine = await Medicine.findByPk(medicine_id);
      if (targetMedicine) {
        const similarMedicines = medicines.filter(med => 
          med.category === targetMedicine.category && med.id !== targetMedicine.id
        );
        
        const avgStock = similarMedicines.reduce((sum, med) => sum + med.stock, 0) / similarMedicines.length;
        const recommendedStock = Math.max(targetMedicine.min_stock, Math.ceil(avgStock * 1.5));
        
        recommendations.push({
          type: 'specific_medicine',
          priority: 'medium',
          title: `💊 ${targetMedicine.name} Analysis`,
          description: 'Stock level and recommendation analysis',
          medicine_analysis: {
            current: targetMedicine.stock,
            recommended: recommendedStock,
            min_required: targetMedicine.min_stock,
            category_average: Math.ceil(avgStock),
            status: targetMedicine.status
          },
          suggested_action: recommendedStock > targetMedicine.stock 
            ? `Restock to ${recommendedStock} units` 
            : 'Current stock level is adequate'
        });
      }
    }
    
    // Sort recommendations by priority
    recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
    
    res.status(200).json({
      success: true,
      data: recommendations,
      summary: {
        total_medicines: medicines.length,
        critical_medicines: lowStockMedicines.length,
        expiring_medicines: expiringMedicines.length,
        recommendations_count: recommendations.length,
        generated_at: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('AI Recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate AI recommendations',
      error: error.message
    });
  }
};
