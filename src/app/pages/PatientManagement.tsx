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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import { Plus, Search, Edit, Trash2, Phone, Mail } from 'lucide-react';

interface Patient {
  id: number;
  name: string;
  age: number;
  gender: string;
  contact: string;
  email: string;
  disease: string;
  lastVisit: string;
}

const initialPatients: Patient[] = [
  { id: 1, name: 'John Doe', age: 45, gender: 'Male', contact: '+91 9876543210', email: 'john@email.com', disease: 'Hypertension', lastVisit: '2026-04-05' },
  { id: 2, name: 'Sarah Wilson', age: 32, gender: 'Female', contact: '+91 9123456789', email: 'sarah@email.com', disease: 'Diabetes', lastVisit: '2026-04-06' },
  { id: 3, name: 'Mike Johnson', age: 28, gender: 'Male', contact: '+91 8765432109', email: 'mike@email.com', disease: 'Asthma', lastVisit: '2026-04-07' },
  { id: 4, name: 'Emma Brown', age: 55, gender: 'Female', contact: '+91 7654321098', email: 'emma@email.com', disease: 'Arthritis', lastVisit: '2026-04-04' },
  { id: 5, name: 'David Lee', age: 40, gender: 'Male', contact: '+91 6543210987', email: 'david@email.com', disease: 'Migraine', lastVisit: '2026-04-05' },
  { id: 6, name: 'Lisa Anderson', age: 38, gender: 'Female', contact: '+91 5432109876', email: 'lisa@email.com', disease: 'Allergies', lastVisit: '2026-04-06' },
];

export function PatientManagement() {
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.disease.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.contact.includes(searchTerm)
  );

  const validatePhoneNumber = (phone: string): string => {
    // Remove all non-digit characters
    let digitsOnly = phone.replace(/\D/g, '');
    
    // Remove leading 91 if present (to avoid double +91)
    if (digitsOnly.startsWith('91') && digitsOnly.length > 10) {
      digitsOnly = digitsOnly.substring(2);
    }
    
    // Take only last 10 digits
    digitsOnly = digitsOnly.slice(-10);
    
    // Format with +91 prefix
    return `+91 ${digitsOnly}`;
  };

  const handleAddPatient = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Get and validate phone number
    let contact = formData.get('contact') as string;
    contact = validatePhoneNumber(contact);
    
    // Validate that we have exactly 10 digits after +91
    const digitsOnly = contact.replace(/\D/g, '');
    if (digitsOnly.length !== 12 || !digitsOnly.startsWith('91')) {
      alert('Please enter a valid 10-digit phone number');
      return;
    }
    
    const newPatient: Patient = {
      id: patients.length + 1,
      name: formData.get('name') as string,
      age: Number(formData.get('age')),
      gender: formData.get('gender') as string,
      contact: contact,
      email: formData.get('email') as string,
      disease: formData.get('disease') as string,
      lastVisit: new Date().toISOString().split('T')[0],
    };
    
    if (editingPatient) {
      setPatients(patients.map(p => p.id === editingPatient.id ? { ...newPatient, id: editingPatient.id } : p));
    } else {
      setPatients([...patients, newPatient]);
    }
    
    setIsDialogOpen(false);
    setEditingPatient(null);
  };

  const handleEdit = (patient: Patient) => {
    setEditingPatient(patient);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this patient?')) {
      setPatients(patients.filter(p => p.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Patient Management</h1>
          <p className="text-gray-600">Manage all patient records and information</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setEditingPatient(null);
        }}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Patient
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingPatient ? 'Edit Patient' : 'Add New Patient'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddPatient} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    placeholder="John Doe" 
                    defaultValue={editingPatient?.name}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input 
                    id="age" 
                    name="age" 
                    type="number" 
                    placeholder="30" 
                    defaultValue={editingPatient?.age}
                    required 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <select 
                    id="gender" 
                    name="gender" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    defaultValue={editingPatient?.gender || ''}
                    required
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact">Contact Number</Label>
                  <Input 
                    id="contact" 
                    name="contact" 
                    placeholder="+91 9876543210" 
                    defaultValue={editingPatient?.contact}
                    required 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  placeholder="patient@email.com" 
                  defaultValue={editingPatient?.email}
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="disease">Disease / Condition</Label>
                <Input 
                  id="disease" 
                  name="disease" 
                  placeholder="e.g., Hypertension, Diabetes" 
                  defaultValue={editingPatient?.disease}
                  required 
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsDialogOpen(false);
                    setEditingPatient(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  {editingPatient ? 'Update Patient' : 'Add Patient'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input 
              placeholder="Search by name, disease, or contact..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline">Filter</Button>
        </div>
      </Card>

      {/* Patients Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient Name</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Disease</TableHead>
                <TableHead>Last Visit</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No patients found
                  </TableCell>
                </TableRow>
              ) : (
                filteredPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">{patient.name}</TableCell>
                    <TableCell>{patient.age}</TableCell>
                    <TableCell>{patient.gender}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Phone className="w-3 h-3 text-gray-400" />
                        <span className="text-sm">{patient.contact}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Mail className="w-3 h-3 text-gray-400" />
                        <span className="text-sm">{patient.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm">
                        {patient.disease}
                      </span>
                    </TableCell>
                    <TableCell>{patient.lastVisit}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEdit(patient)}
                        >
                          <Edit className="w-4 h-4 text-blue-600" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDelete(patient.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-600 mb-1">Total Patients</p>
          <p className="text-2xl font-semibold text-gray-800">{patients.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600 mb-1">Male Patients</p>
          <p className="text-2xl font-semibold text-gray-800">
            {patients.filter(p => p.gender === 'Male').length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600 mb-1">Female Patients</p>
          <p className="text-2xl font-semibold text-gray-800">
            {patients.filter(p => p.gender === 'Female').length}
          </p>
        </Card>
      </div>
    </div>
  );
}
