const { Medicine, User, Session } = require('../models');
const { Op } = require('sequelize');

// Get Dashboard Statistics
exports.getDashboardStats = async (req, res) => {
  try {
    // Get total medicines count
    const totalMedicines = await Medicine.count();
    
    // Get low stock count
    const lowStockCount = await Medicine.count({
      where: {
        stock: {
          [Op.lt]: sequelize.col('min_stock')
        }
      }
    });
    
    // Get expiring soon count (within 30 days)
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    const expiringSoonCount = await Medicine.count({
      where: {
        expiry_date: {
          [Op.lte]: thirtyDaysFromNow
        }
      }
    });
    
    // Get category distribution
    const categoryStats = await Medicine.findAll({
      attributes: [
        'category',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['category']
    });
    
    // Get supplier distribution
    const supplierStats = await Medicine.findAll({
      attributes: [
        'supplier',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['supplier']
    });
    
    // Get active sessions count
    const activeSessionsCount = await Session.count({
      where: {
        expires_at: {
          [Op.gt]: new Date()
        }
      }
    });
    
    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentActivity = await Medicine.findAll({
      where: {
        updated_at: {
          [Op.gte]: sevenDaysAgo
        }
      },
      order: [['updated_at', 'DESC']],
      limit: 10
    });
    
    // Calculate stock health percentage
    const stockHealth = totalMedicines > 0 
      ? ((totalMedicines - lowStockCount) / totalMedicines * 100).toFixed(1)
      : 100;
    
    // Get top categories by stock issues
    const categoryIssues = await Medicine.findAll({
      attributes: [
        'category',
        [sequelize.fn('COUNT', sequelize.col('id')), 'total'],
        [sequelize.fn('SUM', sequelize.literal('CASE WHEN stock < min_stock THEN 1 ELSE 0 END')), 'critical']
      ],
      group: ['category'],
      having: sequelize.literal('critical > 0')
    });
    
    res.status(200).json({
      success: true,
      data: {
        overview: {
          total_medicines: totalMedicines,
          low_stock_count: lowStockCount,
          expiring_soon_count: expiringSoonCount,
          stock_health_percentage: parseFloat(stockHealth),
          active_sessions: activeSessionsCount
        },
        category_distribution: categoryStats.map(cat => ({
          category: cat.category,
          count: parseInt(cat.dataValues.count)
        })),
        supplier_distribution: supplierStats.map(sup => ({
          supplier: sup.supplier || 'Unknown',
          count: parseInt(sup.dataValues.count)
        })),
        category_issues: categoryIssues.map(cat => ({
          category: cat.category,
          total_medicines: parseInt(cat.dataValues.total),
          critical_medicines: parseInt(cat.dataValues.critical),
          issue_percentage: ((cat.dataValues.critical / cat.dataValues.total) * 100).toFixed(1)
        })),
        recent_activity: recentActivity.map(med => ({
          id: med.id,
          name: med.name,
          action: med.updated_at > med.created_at ? 'updated' : 'created',
          timestamp: med.updated_at
        }))
      }
    });
    
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
      error: error.message
    });
  }
};
