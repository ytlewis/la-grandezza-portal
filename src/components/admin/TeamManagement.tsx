import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { useData } from "@/contexts/DataContext";
import { TeamMember } from "@/types/admin";

const TeamManagement = () => {
  const { teamMembers, updateTeamMembers } = useData();
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", role: "", bio: "", image: "" });
  const [imagePreview, setImagePreview] = useState<string>("");

  const handleSave = () => {
    if (editingMember) {
      updateTeamMembers(teamMembers.map(m => m.id === editingMember.id ? { ...editingMember, ...formData } : m));
      toast.success("Team member updated!");
    } else {
      updateTeamMembers([...teamMembers, { id: Date.now().toString(), ...formData }]);
      toast.success("Team member added!");
    }
    setIsDialogOpen(false);
    setFormData({ name: "", role: "", bio: "", image: "" });
    setImagePreview("");
    setEditingMember(null);
  };

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    setFormData({ name: member.name, role: member.role, bio: member.bio, image: member.image });
    setImagePreview(member.image);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    updateTeamMembers(teamMembers.filter(m => m.id !== id));
    toast.success("Team member removed!");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please select an image file");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData({ ...formData, image: base64String });
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
    setEditingMember(null);
    setFormData({ name: "", role: "", bio: "", image: "" });
    setImagePreview("");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Team Management</h2>
          <p className="text-muted-foreground">Manage your team members</p>
        </div>
        <Button onClick={handleOpenDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Add Member
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {teamMembers.map((member) => (
          <Card key={member.id}>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div>
                  <h3 className="font-semibold text-lg">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                  <p className="text-sm mt-2">{member.bio}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(member)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(member.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingMember ? "Edit" : "Add"} Team Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pb-4">
            <div>
              <Label>Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <Label>Role</Label>
              <Input
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              />
            </div>
            <div>
              <Label>Bio</Label>
              <Textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={3}
              />
            </div>
            <div>
              <Label>Photo</Label>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="flex-1"
                    id="team-photo-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('team-photo-upload')?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choose File
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground">
                  Or enter an image URL below (max 2MB for uploads)
                </div>
                <Input
                  value={formData.image}
                  onChange={(e) => {
                    setFormData({ ...formData, image: e.target.value });
                    setImagePreview(e.target.value);
                  }}
                  placeholder="/src/assets/team-member.jpg or https://example.com/image.jpg"
                />
                {imagePreview && (
                  <div className="mt-3">
                    <Label>Preview</Label>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg border mt-2"
                    />
                  </div>
                )}
              </div>
            </div>
            <Button onClick={handleSave} className="w-full">Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamManagement;
