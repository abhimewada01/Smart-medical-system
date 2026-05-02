import { Card } from '../components/ui/card';
import { Users, TrendingUp, AlertTriangle, Activity } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const statsCards = [
  {
    title: 'Total Patients',
    value: '1,248',
    change: '+12%',
    icon: Users,
    color: 'bg-blue-500',
    trend: 'up'
  },
  {
    title: "Today's Revenue",
    value: '₹4,48,460',
    change: '+8%',
    icon: TrendingUp,
    color: 'bg-green-500',
    trend: 'up'
  },
  {
    title: 'Low Stock Alerts',
    value: '23',
    change: 'Urgent',
    icon: AlertTriangle,
    color: 'bg-red-500',
    trend: 'alert'
  },
  {
    title: 'Total Sales',
    value: '₹40,08,070',
    change: '+15%',
    icon: TrendingUp,
    color: 'bg-teal-500',
    trend: 'up'
  },
];

const salesData = [
  { month: 'Jan', sales: 348600, patients: 120 },
  { month: 'Feb', sales: 315400, patients: 110 },
  { month: 'Mar', sales: 423300, patients: 145 },
  { month: 'Apr', sales: 381800, patients: 135 },
  { month: 'May', sales: 481400, patients: 160 },
  { month: 'Jun', sales: 514600, patients: 175 },
];

const medicineCategories = [
  { name: 'Antibiotics', value: 35, color: '#3b82f6' },
  { name: 'Pain Relief', value: 25, color: '#14b8a6' },
  { name: 'Vitamins', value: 20, color: '#8b5cf6' },
  { name: 'Others', value: 20, color: '#f59e0b' },
];

const recentPatients = [
  { id: 1, name: 'John Doe', disease: 'Fever', time: '10:30 AM', status: 'completed' },
  { id: 2, name: 'Sarah Wilson', disease: 'Checkup', time: '11:15 AM', status: 'in-progress' },
  { id: 3, name: 'Mike Johnson', disease: 'Cough', time: '12:00 PM', status: 'waiting' },
  { id: 4, name: 'Emma Brown', disease: 'Diabetes', time: '2:30 PM', status: 'completed' },
];

const lowStockMedicines = [
  { name: 'Paracetamol 500mg', stock: 45, minStock: 100 },
  { name: 'Amoxicillin 250mg', stock: 20, minStock: 50 },
  { name: 'Ibuprofen 400mg', stock: 30, minStock: 80 },
];

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="p-5 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <h3 className="text-2xl font-semibold text-gray-800 mb-2">{stat.value}</h3>
                  <span className={`text-sm ${
                    stat.trend === 'alert' ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {stat.change} from last month
                  </span>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Overview */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-800">Sales Overview</h3>
              <p className="text-sm text-gray-600">Monthly sales trends</p>
            </div>
            <Activity className="w-5 h-5 text-blue-500" />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="sales" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Patient Visits */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-800">Patient Visits</h3>
              <p className="text-sm text-gray-600">Monthly patient count</p>
            </div>
            <Users className="w-5 h-5 text-teal-500" />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }} 
              />
              <Bar dataKey="patients" fill="#14b8a6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Patients */}
        <Card className="p-5 lg:col-span-2">
          <h3 className="font-semibold text-gray-800 mb-4">Recent Patients</h3>
          <div className="space-y-3">
            {recentPatients.map((patient) => (
              <div key={patient.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{patient.name}</p>
                    <p className="text-sm text-gray-600">{patient.disease}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">{patient.time}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    patient.status === 'completed' ? 'bg-green-100 text-green-700' :
                    patient.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {patient.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Low Stock Alerts */}
        <Card className="p-5">
          <div className="flex items-center space-x-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h3 className="font-semibold text-gray-800">Low Stock Alerts</h3>
          </div>
          <div className="space-y-3">
            {lowStockMedicines.map((medicine, index) => (
              <div key={index} className="p-3 bg-red-50 rounded-lg border border-red-100">
                <p className="font-medium text-gray-800 text-sm mb-1">{medicine.name}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-red-600">Stock: {medicine.stock}</span>
                  <span className="text-gray-600">Min: {medicine.minStock}</span>
                </div>
                <div className="mt-2 h-1.5 bg-red-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-500"
                    style={{ width: `${(medicine.stock / medicine.minStock) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Medicine Categories Distribution */}
      <Card className="p-5">
        <h3 className="font-semibold text-gray-800 mb-4">Medicine Categories Distribution</h3>
        <div className="flex items-center justify-center">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={medicineCategories}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {medicineCategories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
