import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Trash2, Edit, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { PortfolioItem } from "@/types/admin";
import { useData } from "@/contexts/DataContext";

const PortfolioManagement = () => {
  const { portfolioItems, updatePortfolioItems } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [formData, setFormData] = useState({ 
    title: "", 
    category: "Wedding", 
    image: "", 
    description: "" 
  });

  const handleOpenDialog = (item?: PortfolioItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        title: item.title,
        category: item.category,
        image: item.image,
        description: item.description || ""
      });
    } else {
      setEditingItem(null);
      setFormData({ title: "", category: "Wedding", image: "", description: "" });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.image) {
      toast.error("Please fill in title and image URL");
      return;
    }

    if (editingItem) {
      // Update existing item
      const updatedItems = portfolioItems.map(item =>
        item.id === editingItem.id
          ? { ...item, ...formData }
          : item
      );
      updatePortfolioItems(updatedItems);
      toast.success("Portfolio item updated!");
    } else {
      // Add new item
      const newItem: PortfolioItem = {
        id: Date.now().toString(),
        ...formData,
        date: new Date().toISOString().split('T')[0]
      };
      updatePortfolioItems([...portfolioItems, newItem]);
      toast.success("Portfolio item added!");
    }

    setIsDialogOpen(false);
    setFormData({ title: "", category: "Wedding", image: "", description: "" });
    setEditingItem(null);
  };

  const handleDelete = (id: string) => {
    const updatedItems = portfolioItems.filter(p => p.id !== id);
    updatePortfolioItems(updatedItems);
    toast.success("Portfolio item removed!");
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg p-6 text-white shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Portfolio Management</h2>
            <p className="text-pink-100 mt-1">Manage your portfolio images and descriptions</p>
          </div>
          <Button 
            onClick={() => handleOpenDialog()} 
            className="bg-white text-purple-600 hover:bg-gray-100"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Image
          </Button>
        </div>
      </div>

      {portfolioItems.length === 0 ? (
        <Card className="shadow-md">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <ImageIcon className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Portfolio Items Yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Start building your portfolio by adding your first image
            </p>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Add First Image
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {portfolioItems.map((item) => (
            <Card key={item.id} className="shadow-md hover:shadow-xl transition-shadow">
              <CardContent className="p-0">
                <div className="relative group">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-64 object-cover rounded-t-lg"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/400x300?text=Image+Not+Found";
                    }}
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleOpenDialog(item)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{item.category}</p>
                  {item.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {item.description}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    Added: {new Date(item.date).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? "Edit Portfolio Item" : "Add Portfolio Item"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Elegant Wedding Ceremony"
              />
            </div>
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(v) => setFormData({ ...formData, category: v })}
              >
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Wedding">Wedding</SelectItem>
                  <SelectItem value="Corporate">Corporate</SelectItem>
                  <SelectItem value="Birthday">Birthday</SelectItem>
                  <SelectItem value="Social">Social</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="image">Image URL *</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="/src/assets/portfolio-image.jpg"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Enter the path to your image file
              </p>
            </div>
            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of this event..."
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} className="flex-1">
                {editingItem ? "Update" : "Add"} Portfolio Item
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsDialogOpen(false);
                  setEditingItem(null);
                  setFormData({ title: "", category: "Wedding", image: "", description: "" });
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PortfolioManagement;
