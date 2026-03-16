import { useState } from "react";
import { useData } from "@/contexts/DataContext";
import { Service } from "@/types/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, GripVertical, Heart, Building2, PartyPopper, Users, Cake, Sparkles, LucideIcon } from "lucide-react";
import { toast } from "sonner";

const ICONS = ["Heart", "Building2", "PartyPopper", "Users", "Cake", "Sparkles"] as const;

const iconMap: Record<string, LucideIcon> = {
  Heart, Building2, PartyPopper, Users, Cake, Sparkles,
};

const emptyService = (): Omit<Service, "id"> => ({
  title: "",
  description: "",
  image: "",
  features: [""],
  icon: "Sparkles",
});

const ServicesManagement = () => {
  const { services, updateServices } = useData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState(emptyService());
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyService());
    setDialogOpen(true);
  };

  const openEdit = (s: Service) => {
    setEditing(s);
    setForm({ title: s.title, description: s.description, image: s.image, features: [...s.features], icon: s.icon });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    if (!form.description.trim()) { toast.error("Description is required"); return; }
    const cleanFeatures = form.features.filter(f => f.trim());

    if (editing) {
      updateServices(services.map(s => s.id === editing.id ? { ...editing, ...form, features: cleanFeatures } : s));
      toast.success("Service updated");
    } else {
      const newService: Service = { id: Date.now().toString(), ...form, features: cleanFeatures };
      updateServices([...services, newService]);
      toast.success("Service added");
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    updateServices(services.filter(s => s.id !== id));
    setDeleteId(null);
    toast.success("Service deleted");
  };

  const updateFeature = (i: number, val: string) => {
    const updated = [...form.features];
    updated[i] = val;
    setForm(f => ({ ...f, features: updated }));
  };

  const addFeature = () => setForm(f => ({ ...f, features: [...f.features, ""] }));
  const removeFeature = (i: number) => setForm(f => ({ ...f, features: f.features.filter((_, idx) => idx !== i) }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Services</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage the services shown on the Services page</p>
        </div>
        <Button onClick={openAdd} className="bg-purple-600 hover:bg-purple-700 text-white">
          <Plus className="mr-2 h-4 w-4" /> Add Service
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {services.map((service) => {
          const Icon = iconMap[service.icon] ?? Sparkles;
          return (
            <Card key={service.id} className="overflow-hidden">
              <div className="relative h-40 bg-gray-100 dark:bg-gray-800">
                {service.image ? (
                  <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Icon className="w-16 h-16 text-gold/30" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute top-2 right-2 flex gap-1">
                  <Button size="icon" variant="secondary" className="h-7 w-7" onClick={() => openEdit(service)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="icon" variant="destructive" className="h-7 w-7" onClick={() => setDeleteId(service.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <CardHeader className="pb-2 pt-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Icon className="h-4 w-4 text-gold" />
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">{service.description}</p>
                <div className="flex flex-wrap gap-1">
                  {service.features.slice(0, 3).map(f => (
                    <span key={f} className="text-xs bg-gold/10 text-gold px-2 py-0.5 rounded-full">{f}</span>
                  ))}
                  {service.features.length > 3 && (
                    <span className="text-xs text-gray-400">+{service.features.length - 3} more</span>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Service" : "Add Service"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Title</Label>
                <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Weddings" />
              </div>
              <div className="space-y-1.5">
                <Label>Icon</Label>
                <Select value={form.icon} onValueChange={v => setForm(f => ({ ...f, icon: v }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ICONS.map(name => {
                      const Ic = iconMap[name];
                      return (
                        <SelectItem key={name} value={name}>
                          <span className="flex items-center gap-2"><Ic className="h-4 w-4" /> {name}</span>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Image URL</Label>
              <Input
                value={form.image}
                onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
                placeholder="https://... or /assets/your-image.jpg"
              />
              {form.image && (
                <img src={form.image} alt="preview" className="mt-2 h-32 w-full object-cover rounded-md border" onError={e => (e.currentTarget.style.display = "none")} />
              )}
            </div>

            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows={3}
                placeholder="Describe this service..."
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Features</Label>
                <Button type="button" variant="outline" size="sm" onClick={addFeature}>
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add
                </Button>
              </div>
              {form.features.map((f, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <GripVertical className="h-4 w-4 text-gray-300 flex-shrink-0" />
                  <Input
                    value={f}
                    onChange={e => updateFeature(i, e.target.value)}
                    placeholder={`Feature ${i + 1}`}
                    className="flex-1"
                  />
                  <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-600" onClick={() => removeFeature(i)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700 text-white">
              {editing ? "Save Changes" : "Add Service"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Service?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500">This will remove the service from the website. This cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteId && handleDelete(deleteId)}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServicesManagement;
