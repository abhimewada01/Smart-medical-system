import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Lock, 
  Bell, 
  Globe,
  Save,
  Camera
} from 'lucide-react';
import { Separator } from '../components/ui/separator';
import { Switch } from '../components/ui/switch';

export function Profile() {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'settings'>('profile');
  
  // Local state for form editing
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [clinicName, setClinicName] = useState(user?.clinicName || '');
  
  // Loading and error states
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Settings state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [lowStockAlerts, setLowStockAlerts] = useState(true);
  const [dailyReports, setDailyReports] = useState(false);
  const [whatsappNotifications, setWhatsappNotifications] = useState(true);

  // Simulate API call to update profile
  const updateProfileAPI = async (profileData: any) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate API response
    return {
      success: true,
      data: profileData,
      message: 'Profile updated successfully'
    };
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    
    try {
      // Validate required fields
      if (!name.trim() || !email.trim() || !phone.trim()) {
        throw new Error('Name, email, and phone are required fields');
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address');
      }
      
      // Validate phone format (Indian format)
      const phoneRegex = /^\+91\s?[6-9]\d{9}$/;
      if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
        throw new Error('Please enter a valid Indian phone number (+91 followed by 10 digits)');
      }
      
      // Prepare profile data for API
      const profileData = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        address: address.trim(),
        clinicName: clinicName.trim(),
        updatedAt: new Date().toISOString()
      };
      
      // Make API call
      const response = await updateProfileAPI(profileData);
      
      if (response.success) {
        console.log('Profile update successful:', response.data); // Debug log
        
        // Update global user state
        updateUser(response.data);
        
        // Update local form state
        setName(response.data.name);
        setEmail(response.data.email);
        setPhone(response.data.phone);
        setAddress(response.data.address);
        setClinicName(response.data.clinicName);
        
        // Show success message
        setSaveSuccess(true);
        
        // Hide success message after 3 seconds
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        throw new Error('Failed to update profile');
      }
      
    } catch (error: any) {
      setSaveError(error.message || 'Failed to update profile');
      
      // Hide error message after 5 seconds
      setTimeout(() => setSaveError(null), 5000);
    } finally {
      setIsSaving(false);
    }
  };
  
  // Sync form with global user state when user changes
  useEffect(() => {
    if (user) {
      console.log('Syncing profile with user data:', user);
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone);
      setAddress(user.address);
      setClinicName(user.clinicName);
    }
  }, [user]);
  
  // Debug: Log state changes
  useEffect(() => {
    console.log('Name state changed:', name);
  }, [name]);

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Password changed successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">Profile & Settings</h1>
        <p className="text-gray-600">Manage your account and system preferences</p>
      </div>

      {/* Tabs */}
      <Card className="p-4">
        <div className="flex items-center space-x-2">
          <Button
            variant={activeTab === 'profile' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('profile')}
          >
            <User className="w-4 h-4 mr-2" />
            Profile
          </Button>
          <Button
            variant={activeTab === 'security' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('security')}
          >
            <Lock className="w-4 h-4 mr-2" />
            Security
          </Button>
          <Button
            variant={activeTab === 'settings' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('settings')}
          >
            <Globe className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </Card>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Avatar */}
          <Card className="p-6">
            <div className="flex flex-col items-center">
              <Avatar className="w-32 h-32 mb-4">
                <AvatarFallback className="bg-blue-100 text-blue-600 text-3xl">
                  {(user?.name || name) ? (user?.name || name)!.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U'}
                </AvatarFallback>
              </Avatar>
              <h3 className="font-semibold text-gray-800 mb-1">{user?.name || name || 'Loading...'}</h3>
              <p className="text-sm text-gray-600 mb-4">Administrator</p>
              <Button variant="outline" className="w-full">
                <Camera className="w-4 h-4 mr-2" />
                Change Photo
              </Button>
            </div>

            <Separator className="my-6" />

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Member Since</p>
                <p className="font-medium text-gray-800">January 2024</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Role</p>
                <p className="font-medium text-gray-800">System Administrator</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm">
                  Active
                </span>
              </div>
            </div>
          </Card>

          {/* Right Column - Profile Form */}
          <Card className="p-6 lg:col-span-2">
            <h3 className="font-semibold text-gray-800 mb-4">Personal Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input 
                      id="fullName" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input 
                      id="email" 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number (+91)</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input 
                      id="phone" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clinicName">Clinic Name</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input 
                      id="clinicName" 
                      value={clinicName}
                      onChange={(e) => setClinicName(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input 
                    id="address" 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Success and Error Messages */}
              {saveSuccess && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">✓ Profile updated successfully!</p>
                </div>
              )}
              
              {saveError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">✗ {saveError}</p>
                </div>
              )}
              
              <div className="flex justify-end pt-4">
                <Button 
                  onClick={handleSaveProfile} 
                  disabled={isSaving}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <Card className="p-6 max-w-2xl">
          <h3 className="font-semibold text-gray-800 mb-4">Change Password</h3>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input 
                  id="currentPassword" 
                  type="password"
                  placeholder="Enter current password"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input 
                  id="newPassword" 
                  type="password"
                  placeholder="Enter new password"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input 
                  id="confirmPassword" 
                  type="password"
                  placeholder="Confirm new password"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Password Requirements:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• At least 8 characters long</li>
                <li>• Contains uppercase and lowercase letters</li>
                <li>• Includes at least one number</li>
                <li>• Has at least one special character</li>
              </ul>
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Update Password
              </Button>
            </div>
          </form>

          <Separator className="my-6" />

          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Two-Factor Authentication</h3>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-800">Enable 2FA</p>
                <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
              </div>
              <Switch />
            </div>
          </div>
        </Card>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Bell className="w-6 h-6 text-blue-600" />
              <h3 className="font-semibold text-gray-800">Notification Preferences</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">Email Notifications</p>
                  <p className="text-sm text-gray-600">Receive notifications via email</p>
                </div>
                <Switch 
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">Low Stock Alerts</p>
                  <p className="text-sm text-gray-600">Get notified when medicines are running low</p>
                </div>
                <Switch 
                  checked={lowStockAlerts}
                  onCheckedChange={setLowStockAlerts}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">Daily Reports</p>
                  <p className="text-sm text-gray-600">Receive daily summary reports</p>
                </div>
                <Switch 
                  checked={dailyReports}
                  onCheckedChange={setDailyReports}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">WhatsApp Notifications</p>
                  <p className="text-sm text-gray-600">Get important alerts on WhatsApp</p>
                </div>
                <Switch 
                  checked={whatsappNotifications}
                  onCheckedChange={setWhatsappNotifications}
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Globe className="w-6 h-6 text-blue-600" />
              <h3 className="font-semibold text-gray-800">System Settings</h3>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <select 
                    id="currency"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="INR">INR (₹)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <select 
                    id="timezone"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="EST">Eastern Time (EST)</option>
                    <option value="PST">Pacific Time (PST)</option>
                    <option value="GMT">Greenwich Mean Time (GMT)</option>
                    <option value="IST">Indian Standard Time (IST)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <select 
                    id="dateFormat"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <select 
                    id="language"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Save className="w-4 h-4 mr-2" />
                  Save Settings
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-red-200">
            <h3 className="font-semibold text-red-800 mb-4">Danger Zone</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium text-red-900">Export All Data</p>
                  <p className="text-sm text-red-700">Download a copy of all your data</p>
                </div>
                <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-50">
                  Export
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium text-red-900">Delete Account</p>
                  <p className="text-sm text-red-700">Permanently delete your account and all data</p>
                </div>
                <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-100">
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
