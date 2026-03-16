import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle, XCircle, Trash2, Edit, Star } from "lucide-react";
import { toast } from "sonner";
import { useData } from "@/contexts/DataContext";
import { Testimonial } from "@/types/admin";

const StarDisplay = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[1,2,3,4,5].map(n => (
      <Star key={n} className={`w-4 h-4 ${n <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))}
  </div>
);

const statusColor = (s: Testimonial["status"]) =>
  s === "approved" ? "bg-green-500" : s === "rejected" ? "bg-red-500" : "bg-yellow-500";

const TestimonialsManagement = () => {
  const { testimonials, updateTestimonials } = useData();
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [editText, setEditText] = useState("");
  const [filter, setFilter] = useState<"all" | Testimonial["status"]>("all");

  const filtered = filter === "all" ? testimonials : testimonials.filter(t => t.status === filter);

  const approve = (id: string) => {
    updateTestimonials(testimonials.map(t => t.id === id ? { ...t, status: "approved" as const } : t));
    toast.success("Testimonial approved and published.");
  };

  const reject = (id: string) => {
    updateTestimonials(testimonials.map(t => t.id === id ? { ...t, status: "rejected" as const } : t));
    toast.success("Testimonial rejected.");
  };

  const remove = (id: string) => {
    updateTestimonials(testimonials.filter(t => t.id !== id));
    toast.success("Testimonial deleted.");
  };

  const openEdit = (t: Testimonial) => { setEditing(t); setEditText(t.text); };

  const saveEdit = () => {
    if (!editing) return;
    updateTestimonials(testimonials.map(t => t.id === editing.id ? { ...t, text: editText } : t));
    toast.success("Testimonial updated.");
    setEditing(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg p-6 text-white shadow-lg">
        <h2 className="text-3xl font-bold">Testimonials</h2>
        <p className="text-yellow-100 mt-1">Review, approve, edit and manage client testimonials</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {(["all", "pending", "approved", "rejected"] as const).map(f => (
          <Button key={f} variant={filter === f ? "default" : "outline"}
            className={filter === f ? "bg-purple-600 text-white" : ""}
            onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
            <span className="ml-2 text-xs bg-white/20 px-1.5 py-0.5 rounded-full">
              {f === "all" ? testimonials.length : testimonials.filter(t => t.status === f).length}
            </span>
          </Button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card><CardContent className="py-16 text-center text-muted-foreground">No testimonials found.</CardContent></Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map(t => (
            <Card key={t.id} className="shadow-md">
              <CardContent className="pt-5 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{t.userName}</p>
                    <p className="text-xs text-muted-foreground">{t.userEmail}</p>
                    <p className="text-xs text-gold uppercase tracking-wider mt-0.5">{t.event}</p>
                  </div>
                  <Badge className={statusColor(t.status)}>{t.status}</Badge>
                </div>
                <StarDisplay rating={t.rating} />
                <p className="text-sm text-gray-700 dark:text-gray-300 italic leading-relaxed">"{t.text}"</p>
                <p className="text-xs text-muted-foreground">{new Date(t.createdAt).toLocaleDateString()}</p>
                <div className="flex gap-2 pt-1 flex-wrap">
                  {t.status !== "approved" && (
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => approve(t.id)}>
                      <CheckCircle className="h-3.5 w-3.5 mr-1" /> Approve
                    </Button>
                  )}
                  {t.status !== "rejected" && (
                    <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50" onClick={() => reject(t.id)}>
                      <XCircle className="h-3.5 w-3.5 mr-1" /> Reject
                    </Button>
                  )}
                  <Button size="sm" variant="outline" onClick={() => openEdit(t)}>
                    <Edit className="h-3.5 w-3.5 mr-1" /> Edit
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50" onClick={() => remove(t.id)}>
                    <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!editing} onOpenChange={() => setEditing(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Testimonial</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Editing review by <span className="font-medium">{editing?.userName}</span></p>
            <Textarea rows={5} value={editText} onChange={e => setEditText(e.target.value)} />
            <div className="flex gap-3">
              <Button onClick={saveEdit} className="flex-1 bg-purple-600 hover:bg-purple-700">Save Changes</Button>
              <Button variant="outline" onClick={() => setEditing(null)} className="flex-1">Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TestimonialsManagement;
