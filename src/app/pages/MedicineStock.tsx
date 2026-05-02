import { useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  AlertTriangle,
  Package,
} from "lucide-react";
import { Badge } from "../components/ui/badge";

interface Medicine {
  id: number;
  name: string;
  category: string;
  quantity: number;
  minStock: number;
  price: number;
  expiryDate: string;
  supplier: string;
}

const initialMedicines: Medicine[] = [
  {
    id: 1,
    name: "Paracetamol 500mg",
    category: "Pain Relief",
    quantity: 45,
    minStock: 100,
    price: 207.50,
    expiryDate: "2026-12-31",
    supplier: "PharmaCorp",
  },
  {
    id: 2,
    name: "Amoxicillin 250mg",
    category: "Antibiotic",
    quantity: 20,
    minStock: 50,
    price: 415.00,
    expiryDate: "2026-10-15",
    supplier: "MediSupply",
  },
  {
    id: 3,
    name: "Ibuprofen 400mg",
    category: "Pain Relief",
    quantity: 30,
    minStock: 80,
    price: 290.50,
    expiryDate: "2027-03-20",
    supplier: "PharmaCorp",
  },
  {
    id: 4,
    name: "Vitamin D3 1000IU",
    category: "Vitamins",
    quantity: 150,
    minStock: 60,
    price: 664.00,
    expiryDate: "2027-06-30",
    supplier: "HealthPlus",
  },
  {
    id: 5,
    name: "Omeprazole 20mg",
    category: "Gastric",
    quantity: 85,
    minStock: 70,
    price: 373.50,
    expiryDate: "2026-09-10",
    supplier: "MediSupply",
  },
  {
    id: 6,
    name: "Aspirin 75mg",
    category: "Cardiovascular",
    quantity: 120,
    minStock: 90,
    price: 124.50,
    expiryDate: "2027-01-15",
    supplier: "PharmaCorp",
  },
  {
    id: 7,
    name: "Metformin 500mg",
    category: "Diabetes",
    quantity: 15,
    minStock: 60,
    price: 498.00,
    expiryDate: "2026-11-20",
    supplier: "DiabetesCare",
  },
  {
    id: 8,
    name: "Cetirizine 10mg",
    category: "Allergy",
    quantity: 95,
    minStock: 70,
    price: 166.00,
    expiryDate: "2027-04-25",
    supplier: "HealthPlus",
  },
];

export function MedicineStock() {
  const [medicines, setMedicines] = useState<Medicine[]>(initialMedicines);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [filterLowStock, setFilterLowStock] = useState(false);

  const filteredMedicines = medicines.filter((medicine) => {
    const matchesSearch =
      medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      !filterLowStock || medicine.quantity < medicine.minStock;
    return matchesSearch && matchesFilter;
  });

  const lowStockCount = medicines.filter((m) => m.quantity < m.minStock).length;

  const handleAddMedicine = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newMedicine: Medicine = {
      id: medicines.length + 1,
      name: formData.get("name") as string,
      category: formData.get("category") as string,
      quantity: Number(formData.get("quantity")),
      minStock: Number(formData.get("minStock")),
      price: Number(formData.get("price")),
      expiryDate: formData.get("expiryDate") as string,
      supplier: formData.get("supplier") as string,
    };

    if (editingMedicine) {
      setMedicines(
        medicines.map((m) =>
          m.id === editingMedicine.id
            ? { ...newMedicine, id: editingMedicine.id }
            : m,
        ),
      );
    } else {
      setMedicines([...medicines, newMedicine]);
    }

    setIsDialogOpen(false);
    setEditingMedicine(null);
  };

  const handleEdit = (medicine: Medicine) => {
    setEditingMedicine(medicine);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this medicine?")) {
      setMedicines(medicines.filter((m) => m.id !== id));
    }
  };

  const getStockStatus = (medicine: Medicine) => {
    const percentage = (medicine.quantity / medicine.minStock) * 100;
    if (percentage < 50) return "critical";
    if (percentage < 100) return "low";
    return "good";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Medicine & Stock Management
          </h1>
          <p className="text-gray-600">Monitor and manage medicine inventory</p>
        </div>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) setEditingMedicine(null);
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Medicine
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingMedicine ? "Edit Medicine" : "Add New Medicine"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddMedicine} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Medicine Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Paracetamol 500mg"
                    defaultValue={editingMedicine?.name}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    name="category"
                    placeholder="Pain Relief"
                    defaultValue={editingMedicine?.category}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Current Stock</Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    placeholder="100"
                    defaultValue={editingMedicine?.quantity}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minStock">Min Stock Level</Label>
                  <Input
                    id="minStock"
                    name="minStock"
                    type="number"
                    placeholder="50"
                    defaultValue={editingMedicine?.minStock}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    placeholder="5.00"
                    defaultValue={editingMedicine?.price}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    name="expiryDate"
                    type="date"
                    defaultValue={editingMedicine?.expiryDate}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supplier">Supplier</Label>
                  <Input
                    id="supplier"
                    name="supplier"
                    placeholder="PharmaCorp"
                    defaultValue={editingMedicine?.supplier}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setEditingMedicine(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  {editingMedicine ? "Update Medicine" : "Add Medicine"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stock Alerts Banner */}
      {lowStockCount > 0 && (
        <Card className="p-4 bg-red-50 border-red-200">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-800">Low Stock Alert</h3>
              <p className="text-sm text-red-700">
                {lowStockCount} medicines are running low on stock. Please
                reorder soon!
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilterLowStock(!filterLowStock)}
              className="border-red-300 text-red-700 hover:bg-red-100"
            >
              {filterLowStock ? "Show All" : "View Low Stock"}
            </Button>
          </div>
        </Card>
      )}

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search by medicine name or category..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline">Export</Button>
        </div>
      </Card>

      {/* Medicine Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Medicine Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Min Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMedicines.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="text-center py-8 text-gray-500"
                  >
                    No medicines found
                  </TableCell>
                </TableRow>
              ) : (
                filteredMedicines.map((medicine) => {
                  const status = getStockStatus(medicine);
                  return (
                    <TableRow key={medicine.id}>
                      <TableCell className="font-medium">
                        {medicine.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-blue-50">
                          {medicine.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span
                          className={
                            status === "critical"
                              ? "text-red-600 font-semibold"
                              : ""
                          }
                        >
                          {medicine.quantity}
                        </span>
                      </TableCell>
                      <TableCell>{medicine.minStock}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            status === "critical"
                              ? "bg-red-100 text-red-700"
                              : status === "low"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-green-100 text-green-700"
                          }
                        >
                          {status === "critical"
                            ? "Critical"
                            : status === "low"
                              ? "Low"
                              : "Good"}
                        </Badge>
                      </TableCell>
                      <TableCell>₹{medicine.price.toFixed(2)}</TableCell>
                      <TableCell>{medicine.expiryDate}</TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {medicine.supplier}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(medicine)}
                          >
                            <Edit className="w-4 h-4 text-blue-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(medicine.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <Package className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-sm text-gray-600">Total Medicines</p>
              <p className="text-2xl font-semibold text-gray-800">
                {medicines.length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-8 h-8 text-red-500" />
            <div>
              <p className="text-sm text-gray-600">Low Stock Items</p>
              <p className="text-2xl font-semibold text-red-600">
                {lowStockCount}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Stock Value</p>
            <p className="text-2xl font-semibold text-gray-800">
              ₹
              {medicines
                .reduce((sum, m) => sum + m.quantity * m.price, 0)
                .toFixed(2)}
            </p>
          </div>
        </Card>
        <Card className="p-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Categories</p>
            <p className="text-2xl font-semibold text-gray-800">
              {new Set(medicines.map((m) => m.category)).size}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
