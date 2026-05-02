import { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  MessageSquare,
  Share2,
  Trash2,
  Filter
} from 'lucide-react';
import { Separator } from '../components/ui/separator';

interface Notification {
  id: number;
  type: 'alert' | 'success' | 'info' | 'warning';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  action?: string;
}

const initialNotifications: Notification[] = [
  {
    id: 1,
    type: 'alert',
    title: 'Low Stock Alert',
    message: 'Paracetamol 500mg is running low. Current stock: 45 units (Min: 100)',
    timestamp: '2026-04-07 10:30 AM',
    read: false,
    action: 'Reorder'
  },
  {
    id: 2,
    type: 'alert',
    title: 'Low Stock Alert',
    message: 'Amoxicillin 250mg needs restocking. Current stock: 20 units (Min: 50)',
    timestamp: '2026-04-07 09:15 AM',
    read: false,
    action: 'Reorder'
  },
  {
    id: 3,
    type: 'warning',
    title: 'Medicine Expiring Soon',
    message: 'Omeprazole 20mg will expire on 2026-09-10. Consider marking down.',
    timestamp: '2026-04-06 03:45 PM',
    read: false
  },
  {
    id: 4,
    type: 'success',
    title: 'Payment Received',
    message: 'Payment of $67.80 received from Mike Johnson (INV-003)',
    timestamp: '2026-04-06 02:30 PM',
    read: true
  },
  {
    id: 5,
    type: 'info',
    title: 'New Patient Registered',
    message: 'Lisa Anderson has been successfully registered in the system.',
    timestamp: '2026-04-06 11:00 AM',
    read: true
  },
  {
    id: 6,
    type: 'alert',
    title: 'Low Stock Alert',
    message: 'Metformin 500mg stock is critically low: 15 units (Min: 60)',
    timestamp: '2026-04-05 04:20 PM',
    read: false,
    action: 'Reorder'
  },
  {
    id: 7,
    type: 'success',
    title: 'Inventory Updated',
    message: 'Successfully received shipment of 200 units of Vitamin D3 1000IU',
    timestamp: '2026-04-05 10:15 AM',
    read: true
  },
  {
    id: 8,
    type: 'info',
    title: 'Monthly Report Ready',
    message: 'Your monthly sales and inventory report for March 2026 is ready to download.',
    timestamp: '2026-04-01 09:00 AM',
    read: true
  }
];

export function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [filter, setFilter] = useState<'all' | 'unread' | 'alert' | 'success' | 'info'>('all');

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.type === filter;
  });

  const handleMarkAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleDelete = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const handleShare = (notification: Notification) => {
    alert(`Sharing notification via WhatsApp:\n\n${notification.title}\n${notification.message}`);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getCardStyle = (type: string, read: boolean) => {
    const baseStyle = read ? 'bg-white' : 'bg-blue-50 border-blue-200';
    return baseStyle;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Bell className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-semibold text-gray-800">Notifications</h1>
            {unreadCount > 0 && (
              <Badge className="bg-red-500">{unreadCount}</Badge>
            )}
          </div>
          <p className="text-gray-600">Stay updated with system alerts and communications</p>
        </div>
        <Button 
          onClick={handleMarkAllAsRead}
          variant="outline"
          disabled={unreadCount === 0}
        >
          Mark All as Read
        </Button>
      </div>

      {/* Filter Tabs */}
      <Card className="p-4">
        <div className="flex items-center space-x-2 overflow-x-auto">
          <Filter className="w-5 h-5 text-gray-500" />
          <Button
            variant={filter === 'all' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All ({notifications.length})
          </Button>
          <Button
            variant={filter === 'unread' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('unread')}
          >
            Unread ({unreadCount})
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <Button
            variant={filter === 'alert' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('alert')}
            className={filter === 'alert' ? 'bg-red-600 hover:bg-red-700' : ''}
          >
            Alerts
          </Button>
          <Button
            variant={filter === 'success' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('success')}
            className={filter === 'success' ? 'bg-green-600 hover:bg-green-700' : ''}
          >
            Success
          </Button>
          <Button
            variant={filter === 'info' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('info')}
            className={filter === 'info' ? 'bg-blue-600 hover:bg-blue-700' : ''}
          >
            Info
          </Button>
        </div>
      </Card>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <Card className="p-8">
            <div className="text-center text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No notifications to display</p>
            </div>
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`p-5 ${getCardStyle(notification.type, notification.read)} transition-all hover:shadow-md`}
            >
              <div className="flex items-start space-x-4">
                {/* Icon */}
                <div className={`p-2 rounded-lg ${
                  notification.type === 'alert' ? 'bg-red-100' :
                  notification.type === 'success' ? 'bg-green-100' :
                  notification.type === 'warning' ? 'bg-yellow-100' :
                  'bg-blue-100'
                }`}>
                  {getIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className={`font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                        {notification.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full ml-2 mt-2"></div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-gray-500">{notification.timestamp}</span>
                    <div className="flex items-center space-x-2">
                      {notification.action && (
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          {notification.action}
                        </Button>
                      )}
                      {!notification.read && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleShare(notification)}
                      >
                        <Share2 className="w-4 h-4 text-blue-600" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDelete(notification.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* WhatsApp Communication Section */}
      <Card className="p-5">
        <div className="flex items-start space-x-3">
          <MessageSquare className="w-6 h-6 text-green-600" />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800 mb-2">WhatsApp Integration</h3>
            <p className="text-sm text-gray-600 mb-4">
              Share important notifications and alerts directly with your team via WhatsApp.
            </p>
            <div className="flex items-center space-x-2">
              <Button className="bg-green-600 hover:bg-green-700">
                <Share2 className="w-4 h-4 mr-2" />
                Share Low Stock Report
              </Button>
              <Button variant="outline">
                <Share2 className="w-4 h-4 mr-2" />
                Share Daily Summary
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Notification Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <Bell className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-semibold text-gray-800">{notifications.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-8 h-8 text-red-500" />
            <div>
              <p className="text-sm text-gray-600">Alerts</p>
              <p className="text-2xl font-semibold text-red-600">
                {notifications.filter(n => n.type === 'alert').length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-sm text-gray-600">Success</p>
              <p className="text-2xl font-semibold text-green-600">
                {notifications.filter(n => n.type === 'success').length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <Info className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-sm text-gray-600">Unread</p>
              <p className="text-2xl font-semibold text-blue-600">{unreadCount}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
