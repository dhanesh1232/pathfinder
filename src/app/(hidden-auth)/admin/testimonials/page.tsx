"use client";

import { useState, useEffect } from "react";
import {
  getTestimonials,
  upsertTestimonial,
  deleteTestimonial,
} from "@/app/actions/content";
import {
  Plus,
  Trash2,
  Quote,
  Edit2,
  User,
  Star,
  MessageSquare,
  Search,
  CheckCircle2,
  Users,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AdminPageHeader } from "@/components/admin/page-header";
import { ImageModal } from "@/components/image-modal";

export default function TestimonialsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    author: "",
    role: "",
    text: "",
    imageUrl: "",
    rating: 5,
    order: 0,
  });

  const fetchItems = async () => {
    setLoading(true);
    const data = await getTestimonials();
    setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
    document.title = "Testimonials | Admin | Pathfinder";
  }, []);

  const handleEdit = (item: any) => {
    setEditingId(item._id);
    setFormData({
      author: item.author,
      role: item.role || "",
      text: item.text,
      imageUrl: item.imageUrl || "",
      rating: item.rating || 5,
      order: item.order,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      author: "",
      role: "",
      text: "",
      imageUrl: "",
      rating: 5,
      order: 0,
    });
    setIsSaving(false);
    setIsDialogOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await upsertTestimonial({ id: editingId, ...formData });
      if (res.success) {
        toast.success(editingId ? "Testimonial updated" : "Voice recorded");
        resetForm();
        fetchItems();
      } else {
        toast.error("Failed to save voice");
      }
    } catch (error) {
      toast.error("An error occurred while saving");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    const res = await deleteTestimonial(id);
    if (res.success) {
      toast.success("Voice silent");
      fetchItems();
    }
  };

  const filteredItems = items.filter(
    (i) =>
      i.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.text.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-8 pb-10">
      <AdminPageHeader
        title="Client Registry"
        description="Curate the vocal legacy and social proof of the agency."
        badge="Social Proof"
        badgeClassName="border-amber-500/20 text-amber-500 bg-amber-500/5"
        showSeparator={true}
      >
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingId(null);
                setFormData({
                  author: "",
                  role: "",
                  text: "",
                  imageUrl: "",
                  rating: 5,
                  order: items.length,
                });
              }}
              variant="polygon"
              className="px-8 flex items-center gap-2 h-10 uppercase tracking-widest text-[11px]"
            >
              <Plus className="h-4 w-4" /> Provision Voice
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-950 border-zinc-900 text-white rounded-lg p-8 max-w-lg shadow-none">
            <form onSubmit={handleSubmit}>
              <DialogHeader className="space-y-4">
                <div className="w-12 h-12 rounded-md bg-pathfinder-green/10 flex items-center justify-center">
                  <Quote className="h-6 w-6 text-pathfinder-green" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold uppercase tracking-tight italic">
                    {editingId ? "Refine Endorsement" : "New Client Narrative"}
                  </DialogTitle>
                  <DialogDescription className="text-zinc-500 text-sm font-medium">
                    Capture the cinematic feedback from project stakeholders.
                  </DialogDescription>
                </div>
              </DialogHeader>
              <div className="grid gap-6 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="grid gap-2">
                    <Label
                      htmlFor="author"
                      className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 pl-1"
                    >
                      Stakeholder Identity
                    </Label>
                    <Input
                      id="author"
                      required
                      value={formData.author}
                      onChange={(e) =>
                        setFormData({ ...formData, author: e.target.value })
                      }
                      className="bg-zinc-900/50 border-zinc-800 focus:ring-pathfinder-green/20 rounded-lg h-12"
                      placeholder="e.g. Marcus Thorne"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label
                      htmlFor="role"
                      className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 pl-1"
                    >
                      Operational Title
                    </Label>
                    <Input
                      id="role"
                      required
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value })
                      }
                      className="bg-zinc-900/50 border-zinc-800 focus:ring-pathfinder-green/20 rounded-lg h-12"
                      placeholder="CEO, Tech Vision"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label
                    htmlFor="text"
                    className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 pl-1"
                  >
                    Narrative Content
                  </Label>
                  <Textarea
                    id="text"
                    required
                    value={formData.text}
                    onChange={(e) =>
                      setFormData({ ...formData, text: e.target.value })
                    }
                    className="bg-zinc-900/50 border-zinc-800 focus:ring-pathfinder-green/20 rounded-lg min-h-[120px] resize-none leading-relaxed"
                    placeholder="Their feedback archive..."
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="grid gap-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 pl-1">
                      Visual Ident (Avatar)
                    </Label>
                    <div className="flex items-center gap-4">
                      {formData.imageUrl ? (
                        <div className="relative group w-14 h-14 rounded-full overflow-hidden border border-zinc-800 bg-zinc-950 flex items-center justify-center">
                          <img
                            src={formData.imageUrl}
                            alt="Preview"
                            className="w-full h-full object-cover opacity-60 transition-transform duration-500 group-hover:scale-110"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setFormData({ ...formData, imageUrl: "" })
                            }
                            className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-4 w-4 text-white" />
                          </button>
                        </div>
                      ) : (
                        <div className="w-14 h-14 rounded-full border border-dashed border-zinc-800 flex items-center justify-center text-zinc-800 bg-zinc-900/10">
                          <User className="h-6 w-6" />
                        </div>
                      )}

                      <div className="flex-1">
                        <ImageModal
                          open={isImageModalOpen}
                          setOpen={setIsImageModalOpen}
                          onInsert={(images) => {
                            if (images[0]) {
                              setFormData({
                                ...formData,
                                imageUrl: images[0].url,
                              });
                            }
                          }}
                          folder="testimonials"
                          apiUrl={process.env.NEXT_PUBLIC_ERIX_API_URL}
                          apiKey={process.env.NEXT_PUBLIC_ERIX_API_KEY}
                          clientCode={process.env.NEXT_PUBLIC_ERIX_CLIENT_CODE}
                          trigger
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label
                      htmlFor="rating"
                      className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 pl-1"
                    >
                      Impact Metric (1-5)
                    </Label>
                    <Input
                      id="rating"
                      type="number"
                      min="1"
                      max="5"
                      value={formData.rating}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          rating: parseInt(e.target.value) || 5,
                        })
                      }
                      className="bg-zinc-900/50 border-zinc-800 focus:ring-pathfinder-green/20 rounded-lg h-12"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter className="gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={resetForm}
                  className="rounded-lg text-zinc-600 hover:text-white uppercase tracking-widest text-[10px] font-bold h-12 px-6"
                >
                  Abort
                </Button>
                <Button
                  type="submit"
                  disabled={isSaving}
                  variant="polygon"
                  className="h-12 px-10 uppercase tracking-widest text-xs min-w-[140px]"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    "Deploy Voice"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </AdminPageHeader>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-zinc-900/10 p-4 rounded-lg border border-zinc-800/30">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
          <Input
            placeholder="Audit Feedback Archives..."
            className="bg-zinc-900/30 border-zinc-800 rounded-lg pl-10 h-10 text-sm focus:ring-pathfinder-green/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-6 px-4">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
              Client Records
            </span>
            <span className="text-xl font-black text-white italic tracking-tighter">
              {filteredItems.length}
            </span>
          </div>
          <div className="h-8 w-px bg-zinc-800" />
          <div className="flex items-center gap-2 text-[10px] font-bold text-pathfinder-green uppercase tracking-widest">
            <CheckCircle2 className="h-3 w-3" />
            Verified Sync
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-48 bg-zinc-900/20 border border-zinc-800/50 rounded-lg animate-pulse"
            />
          ))
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-zinc-900/20 border border-zinc-800 rounded-lg p-6 flex flex-col justify-between group hover:border-pathfinder-green/30 transition-all duration-500 shadow-none relative overflow-hidden"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="p-2 rounded-md bg-zinc-900/50 border border-zinc-800">
                      <Quote className="h-4 w-4 text-pathfinder-green opacity-40 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="flex gap-1 bg-zinc-950/50 px-2 py-1 rounded-md border border-zinc-900">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-2.5 w-2.5 ${
                            i < (item.rating || 5)
                              ? "text-pathfinder-green fill-pathfinder-green"
                              : "text-zinc-800"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-zinc-400 text-[13px] leading-relaxed italic font-medium group-hover:text-zinc-300 transition-colors">
                    "{item.text}"
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-zinc-800/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10 border border-zinc-800 rounded-lg">
                        <AvatarImage
                          src={
                            item.imageUrl ||
                            `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.author}`
                          }
                        />
                        <AvatarFallback className="bg-zinc-900 text-[10px] font-bold">
                          {item.author[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-pathfinder-green border-2 border-black rounded-full" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-white text-[11px] uppercase tracking-widest italic truncate">
                        {item.author}
                      </h4>
                      <p className="text-zinc-600 text-[9px] font-bold truncate uppercase tracking-tighter">
                        {item.role || "Visionary Partner"}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleEdit(item)}
                      className="h-8 w-8 rounded-md bg-white/5 hover:bg-white text-zinc-400 hover:text-black border border-white/5 backdrop-blur-md transition-all"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(item._id)}
                      className="h-8 w-8 rounded-md bg-red-500/5 hover:bg-red-500 text-zinc-500 hover:text-white border border-red-500/5 transition-all"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Subtle Ref ID */}
                <span className="absolute top-2 right-2 text-[8px] font-black text-zinc-800/20 group-hover:text-pathfinder-green/20 transition-colors">
                  MEM#{item.order}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {!loading && filteredItems.length === 0 && (
        <div className="py-24 text-center border border-zinc-800/50 bg-zinc-900/5 rounded-lg flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-zinc-900/50 flex items-center justify-center mb-6 border border-zinc-800">
            <Users className="h-8 w-8 text-zinc-700" />
          </div>
          <h3 className="text-white font-bold uppercase tracking-widest text-xs mb-2 italic">
            No Records Found
          </h3>
          <p className="text-zinc-600 text-[10px] font-medium max-w-xs mx-auto mb-8 uppercase tracking-tighter italic">
            the narrative database is currently empty for this specific query.
          </p>
          <Button
            variant="ghost"
            className="text-pathfinder-green hover:text-white hover:bg-pathfinder-green/10 text-[10px] font-bold uppercase tracking-widest h-10 px-6 rounded-md"
            onClick={() => setSearchTerm("")}
          >
            Reset Signal
          </Button>
        </div>
      )}
    </div>
  );
}
