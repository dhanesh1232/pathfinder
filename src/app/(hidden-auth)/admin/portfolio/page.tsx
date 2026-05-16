"use client";

import { useState, useEffect } from "react";
import {
  getPortfolioItems,
  upsertPortfolio,
  deletePortfolio,
} from "@/app/actions/content";
import {
  Plus,
  Trash2,
  ImageIcon,
  Edit2,
  Layers,
  Search,
  LayoutGrid,
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
import { AdminPageHeader } from "@/components/admin/page-header";
import { ImageModal } from "@/components/image-modal";

export default function PortfolioPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    imageUrl: "",
    category: "",
    order: 0,
  });

  const fetchItems = async () => {
    setLoading(true);
    const data = await getPortfolioItems();
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
    document.title = "Portfolio | Admin | Pathfinder";
  }, []);

  const handleEdit = (item: any) => {
    setEditingId(item._id);
    setFormData({
      title: item.title,
      imageUrl: item.imageUrl,
      category: item.category || "",
      order: item.order,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ title: "", imageUrl: "", category: "", order: 0 });
    setIsSaving(false);
    setIsDialogOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await upsertPortfolio({ id: editingId, ...formData });
      if (res.success) {
        toast.success(
          editingId === null ? "Added to portfolio" : "Portfolio item updated",
        );
        resetForm();
        fetchItems();
      } else {
        toast.error("Failed to save item");
      }
    } catch (error) {
      toast.error("An error occurred while saving");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    const res = await deletePortfolio(id);
    if (res.success) {
      toast.success("Item removed");
      fetchItems();
    }
  };

  const filteredItems = items.filter(
    (i) =>
      i.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.category?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-4 pb-10">
      <AdminPageHeader
        title="Portfolio Showcase"
        description="Manage the visual narrative of your agency's success."
        badge="Curation"
        badgeClassName="border-blue-500/20 text-blue-500 bg-blue-500/5"
        showSeparator={true}
      >
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingId(null);
                setFormData({
                  title: "",
                  imageUrl: "",
                  category: "",
                  order: items.length,
                });
              }}
              variant="polygon"
              className="px-8 flex items-center gap-2 h-10 uppercase tracking-widest text-[11px]"
            >
              <Plus className="h-4 w-4" /> Provision Project
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#0A0A10] border-white/10 text-white rounded-2xl p-8 max-w-lg shadow-2xl">
            <form onSubmit={handleSubmit}>
              <DialogHeader className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-linear-to-r from-[#7C6EFA]/10 to-[#22D3EE]/10 flex items-center justify-center border border-white/5">
                  <LayoutGrid className="h-6 w-6 text-[#22D3EE]" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-black uppercase tracking-tighter text-white">
                    {editingId
                      ? "Update Project Registry"
                      : "Provision New Vision"}
                  </DialogTitle>
                  <DialogDescription className="text-[#64647A] text-sm font-medium mt-1">
                    Document the cinematic and technical parameters for this
                    masterpiece.
                  </DialogDescription>
                </div>
              </DialogHeader>
              <div className="grid gap-6 py-8">
                <div className="grid gap-2 md:col-span-2">
                  <Label
                    htmlFor="title"
                    className="text-[10px] font-bold uppercase tracking-widest text-[#64647A] pl-1"
                  >
                    Project Identity
                  </Label>
                  <Input
                    id="title"
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="bg-[#060608] border-white/10 focus:border-[#7C6EFA] focus:ring-1 focus:ring-[#7C6EFA]/30 rounded-xl h-12 text-white placeholder:text-[#64647A]"
                    placeholder="Project Title"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="grid gap-2">
                    <Label
                      htmlFor="category"
                      className="text-[10px] font-bold uppercase tracking-widest text-[#64647A] pl-1"
                    >
                      Industry/Sector
                    </Label>
                    <Input
                      id="category"
                      required
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="bg-[#060608] border-white/10 focus:border-[#7C6EFA] focus:ring-1 focus:ring-[#7C6EFA]/30 rounded-xl h-12 text-white placeholder:text-[#64647A]"
                      placeholder="e.g. UI/UX Design"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label
                      htmlFor="order"
                      className="text-[10px] font-bold uppercase tracking-widest text-[#64647A] pl-1"
                    >
                      Priority Weight
                    </Label>
                    <Input
                      id="order"
                      type="number"
                      value={formData.order}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          order: parseInt(e.target.value) || 0,
                        })
                      }
                      className="bg-[#060608] border-white/10 focus:border-[#7C6EFA] focus:ring-1 focus:ring-[#7C6EFA]/30 rounded-xl h-12 text-white placeholder:text-[#64647A]"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-[#64647A] pl-1">
                    Visual Matrix (Hero Asset)
                  </Label>
                  <div className="flex items-center gap-6">
                    {formData.imageUrl ? (
                      <div className="relative group w-24 h-32 rounded-xl overflow-hidden border border-white/10 bg-[#060608] flex items-center justify-center">
                        {formData.imageUrl.match(/\.(mp4|webm|ogg|mov)$/) ? (
                          <video
                            src={formData.imageUrl}
                            className="w-full h-full object-cover opacity-80"
                          />
                        ) : (
                          <img
                            src={formData.imageUrl}
                            alt="Preview"
                            className="w-full h-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-110"
                          />
                        )}
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, imageUrl: "" })
                          }
                          className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-5 w-5 text-white" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-24 h-32 rounded-xl border border-dashed border-white/20 flex items-center justify-center text-[#64647A] bg-[#060608]">
                        <ImageIcon className="h-8 w-8" />
                      </div>
                    )}

                    <div className="flex-1 space-y-3">
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
                        folder="portfolio"
                        apiUrl={process.env.NEXT_PUBLIC_ERIX_API_URL}
                        apiKey={process.env.NEXT_PUBLIC_ERIX_API_KEY}
                        clientCode={process.env.NEXT_PUBLIC_ERIX_CLIENT_CODE}
                        trigger
                      />
                      <p className="text-[9px] text-[#64647A] font-medium italic leading-relaxed">
                        Deploy high-resolution visual assets for the showcase
                        terminal.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter className="gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={resetForm}
                  className="rounded-xl text-[#64647A] hover:text-white uppercase tracking-widest text-[10px] font-bold h-12 px-6 hover:bg-white/5"
                >
                  Abort
                </Button>
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="h-12 px-10 uppercase tracking-widest text-xs min-w-[140px] bg-linear-to-r from-[#7C6EFA] to-[#22D3EE] text-black font-bold rounded-xl hover:shadow-[0_0_40px_rgba(124,110,250,0.35)] transition-all"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    "Commit Changes"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </AdminPageHeader>

      {/* Search & Action Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-zinc-900/10 p-4 rounded-lg border border-zinc-800/30">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
          <Input
            placeholder="Filter Creative Assets..."
            className="bg-zinc-900/30 border-zinc-800 rounded-lg pl-10 h-10 text-sm focus:ring-pathfinder-green/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-6 px-4">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
              Active Projects
            </span>
            <span className="text-xl font-black text-white italic tracking-tighter">
              {items.length}
            </span>
          </div>
          <div className="h-8 w-px bg-zinc-800" />
          <div className="flex items-center gap-2 text-[10px] font-bold text-pathfinder-green uppercase tracking-widest">
            <LayoutGrid className="h-3 w-3" />
            Grid Master
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[3/4] bg-zinc-900/20 border border-zinc-800/50 rounded-lg animate-pulse"
            />
          ))
        ) : (
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group relative aspect-[3/4] bg-zinc-900/20 border border-zinc-800 rounded-lg overflow-hidden hover:border-pathfinder-green/30 transition-all duration-500 shadow-none"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
                />

                <div className="absolute inset-x-0 bottom-0 p-5 bg-linear-to-t from-black via-black/40 to-transparent flex flex-col justify-end">
                  <div className="space-y-3">
                    <Badge
                      variant="secondary"
                      className="bg-zinc-950/80 text-white text-[9px] font-bold px-2 py-0 border-zinc-800 rounded-md uppercase tracking-tighter"
                    >
                      {item.category || "General Work"}
                    </Badge>
                    <h3 className="font-bold text-sm text-white uppercase tracking-tight italic line-clamp-1 pb-1">
                      {item.title}
                    </h3>

                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleEdit(item)}
                        className="h-8 flex-1 rounded-md bg-white/5 hover:bg-white text-white hover:text-black border border-white/10 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest transition-all"
                      >
                        <Edit2 className="h-3 w-3 mr-1.5" /> Configure
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => handleDelete(item._id)}
                        className="h-8 w-8 rounded-md bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/10 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="absolute top-3 left-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Badge className="bg-zinc-950/80 text-white font-bold text-[9px] py-px border-zinc-800 rounded-md tracking-tighter">
                    REF#{item.order}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {!loading && filteredItems.length === 0 && (
        <div className="py-20 text-center border border-dashed border-zinc-800 rounded-2xl flex flex-col items-center">
          <Layers className="h-10 w-10 text-zinc-800 mx-auto mb-4" />
          <p className="text-zinc-600 font-medium text-sm">No works found.</p>
        </div>
      )}
    </div>
  );
}
