import { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Calendar, Download, TrendingUp } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SaleRecord {
  id: number;
  date: string;
  billNo: string;
  patientName: string;
  items: number;
  amount: number;
  paymentMethod: string;
  status: string;
}

const salesRecords: SaleRecord[] = [
  { id: 1, date: '2026-04-07', billNo: 'INV-001', patientName: 'John Doe', items: 3, amount: 3776.50, paymentMethod: 'Cash', status: 'Completed' },
  { id: 2, date: '2026-04-07', billNo: 'INV-002', patientName: 'Sarah Wilson', items: 2, amount: 2324.00, paymentMethod: 'Card', status: 'Completed' },
  { id: 3, date: '2026-04-06', billNo: 'INV-003', patientName: 'Mike Johnson', items: 5, amount: 5627.40, paymentMethod: 'UPI', status: 'Completed' },
  { id: 4, date: '2026-04-06', billNo: 'INV-004', patientName: 'Emma Brown', items: 1, amount: 1245.00, paymentMethod: 'Cash', status: 'Completed' },
  { id: 5, date: '2026-04-05', billNo: 'INV-005', patientName: 'David Lee', items: 4, amount: 4340.90, paymentMethod: 'Card', status: 'Completed' },
  { id: 6, date: '2026-04-05', billNo: 'INV-006', patientName: 'Lisa Anderson', items: 2, amount: 2822.00, paymentMethod: 'Cash', status: 'Completed' },
  { id: 7, date: '2026-04-04', billNo: 'INV-007', patientName: 'James Wilson', items: 3, amount: 3444.50, paymentMethod: 'UPI', status: 'Completed' },
  { id: 8, date: '2026-04-04', billNo: 'INV-008', patientName: 'Maria Garcia', items: 6, amount: 7403.60, paymentMethod: 'Card', status: 'Completed' },
];

const monthlySalesData = [
  { month: 'Jan', sales: 348600, transactions: 120 },
  { month: 'Feb', sales: 315400, transactions: 110 },
  { month: 'Mar', sales: 423300, transactions: 145 },
  { month: 'Apr', sales: 381800, transactions: 135 },
  { month: 'May', sales: 481400, transactions: 160 },
  { month: 'Jun', sales: 514600, transactions: 175 },
];

const dailySalesData = [
  { day: 'Mon', sales: 70550 },
  { day: 'Tue', sales: 76360 },
  { day: 'Wed', sales: 64740 },
  { day: 'Thu', sales: 91300 },
  { day: 'Fri', sales: 107900 },
  { day: 'Sat', sales: 120350 },
  { day: 'Sun', sales: 81340 },
];

export function SalesRecords() {
  const [startDate, setStartDate] = useState('2026-04-01');
  const [endDate, setEndDate] = useState('2026-04-07');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRecords = salesRecords.filter(record =>
    record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.billNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalSales = filteredRecords.reduce((sum, record) => sum + record.amount, 0);
  const totalTransactions = filteredRecords.length;
  const averageTransaction = totalSales / totalTransactions;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">Sales & Records</h1>
        <p className="text-gray-600">View and analyze sales history and revenue</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Sales</p>
              <p className="text-2xl font-semibold text-gray-800">₹{totalSales.toFixed(2)}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-5">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Transactions</p>
              <p className="text-2xl font-semibold text-gray-800">{totalTransactions}</p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-teal-100 rounded-lg">
              <Calendar className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg Transaction</p>
              <p className="text-2xl font-semibold text-gray-800">₹{averageTransaction.toFixed(2)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Monthly Sales Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlySalesData}>
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
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ fill: '#10b981', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Daily Sales (This Week)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dailySalesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }} 
              />
              <Bar dataKey="sales" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <Label className="mb-2 block text-sm">Search</Label>
            <Input 
              placeholder="Search by patient or bill number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <Label className="mb-2 block text-sm">Start Date</Label>
            <Input 
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <Label className="mb-2 block text-sm">End Date</Label>
            <Input 
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
        <div className="mt-4 flex items-center space-x-2">
          <Button variant="outline">Apply Filters</Button>
          <Button variant="ghost">Reset</Button>
          <Button className="ml-auto bg-blue-600 hover:bg-blue-700">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </Card>

      {/* Sales Records Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Bill No.</TableHead>
                <TableHead>Patient Name</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No sales records found
                  </TableCell>
                </TableRow>
              ) : (
                filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.date}</TableCell>
                    <TableCell className="font-medium text-blue-600">{record.billNo}</TableCell>
                    <TableCell>{record.patientName}</TableCell>
                    <TableCell>{record.items}</TableCell>
                    <TableCell className="font-semibold">₹{record.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs ${
                        record.paymentMethod === 'Cash' ? 'bg-green-100 text-green-700' :
                        record.paymentMethod === 'Card' ? 'bg-blue-100 text-blue-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {record.paymentMethod}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                        {record.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Payment Method Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5">
          <h4 className="font-semibold text-gray-800 mb-3">Payment Methods</h4>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Cash</span>
                <span className="font-medium">35%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: '35%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Card</span>
                <span className="font-medium">45%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: '45%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">UPI</span>
                <span className="font-medium">20%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500" style={{ width: '20%' }}></div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <h4 className="font-semibold text-gray-800 mb-3">Top Selling Medicines</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Paracetamol</span>
              <span className="font-medium">245 units</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Amoxicillin</span>
              <span className="font-medium">189 units</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Vitamin D3</span>
              <span className="font-medium">156 units</span>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <h4 className="font-semibold text-gray-800 mb-3">Revenue Growth</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">This Month</span>
              <span className="text-lg font-semibold text-green-600">+15.8%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Last Month</span>
              <span className="text-lg font-semibold text-gray-800">+12.3%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Year to Date</span>
              <span className="text-lg font-semibold text-gray-800">+18.5%</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
