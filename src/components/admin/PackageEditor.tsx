import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useData } from "@/contexts/DataContext";
import { Package } from "@/types/admin";

const PackageEditor = () => {
  const { packages, updatePackages } = useData();
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSave = (pkg: Package) => {
    updatePackages(packages.map(p => p.id === pkg.id ? pkg : p));
    setEditingId(null);
    toast.success("Package updated!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Package Editor</h2>
        <p className="text-muted-foreground">Manage your event packages</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {packages.map((pkg) => (
          <Card key={pkg.id}>
            <CardHeader>
              <CardTitle>{pkg.name} Package</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {editingId === pkg.id ? (
                <EditForm pkg={pkg} onSave={handleSave} onCancel={() => setEditingId(null)} />
              ) : (
                <ViewMode pkg={pkg} onEdit={() => setEditingId(pkg.id)} />
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const ViewMode = ({ pkg, onEdit }: { pkg: Package; onEdit: () => void }) => (
  <>
    <div>
      <p className="text-sm font-medium">Price</p>
      <p className="text-2xl font-bold">KSh {pkg.price.toLocaleString()}</p>
    </div>
    <div>
      <p className="text-sm font-medium">Description</p>
      <p className="text-sm text-muted-foreground">{pkg.description}</p>
    </div>
    <div>
      <p className="text-sm font-medium mb-2">Features</p>
      <ul className="list-disc list-inside space-y-1">
        {pkg.features.map((feature, i) => (
          <li key={i} className="text-sm text-muted-foreground">{feature}</li>
        ))}
      </ul>
    </div>
    <Button onClick={onEdit} className="w-full">Edit Package</Button>
  </>
);

const EditForm = ({ pkg, onSave, onCancel }: { pkg: Package; onSave: (pkg: Package) => void; onCancel: () => void }) => {
  const [formData, setFormData] = useState(pkg);

  return (
    <>
      <div>
        <Label>Price (KSh)</Label>
        <Input
          type="number"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
        />
      </div>
      <div>
        <Label>Description</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>
      <div>
        <Label>Features (one per line)</Label>
        <Textarea
          value={formData.features.join('\n')}
          onChange={(e) => setFormData({ ...formData, features: e.target.value.split('\n') })}
          rows={6}
        />
      </div>
      <div className="flex gap-2">
        <Button onClick={() => onSave(formData)} className="flex-1">Save</Button>
        <Button onClick={onCancel} variant="outline" className="flex-1">Cancel</Button>
      </div>
    </>
  );
};

export default PackageEditor;
