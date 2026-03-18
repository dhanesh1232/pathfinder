"use client";

import { useState, useEffect } from "react";
import {
  getOurWorkItems,
  upsertOurWork,
  deleteOurWork,
} from "@/app/actions/content";
import {
  Plus,
  Trash2,
  Video,
  Edit2,
  PlayCircle,
  Search,
  Clapperboard,
  Film,
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

export default function OurWorkPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    videoUrl: "",
    category: "",
    order: 0,
  });

  const fetchItems = async () => {
    setLoading(true);
    const data = await getOurWorkItems();
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
    document.title = "Our Work | Admin | Pathfinder";
  }, []);

  const handleEdit = (item: any) => {
    setEditingId(item._id);
    setFormData({
      title: item.title,
      videoUrl: item.videoUrl,
      category: item.category || "",
      order: item.order,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ title: "", videoUrl: "", category: "", order: 0 });
    setIsSaving(false);
    setIsDialogOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await upsertOurWork({ id: editingId, ...formData });
      if (res.success) {
        toast.success(editingId === null ? "Production added" : "Reel updated");
        resetForm();
        fetchItems();
      } else {
        toast.error("Failed to save reel");
      }
    } catch (error) {
      toast.error("An error occurred while saving");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    const res = await deleteOurWork(id);
    if (res.success) {
      toast.success("Reel purged from library");
      fetchItems();
    }
  };

  const filteredItems = items.filter(
    (i) =>
      i.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.category?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-8 pb-10">
      <AdminPageHeader
        title="Production Reels"
        description="Curate and manage the cinematic portfolio and showreels."
        badge="Cinema"
        badgeClassName="border-red-500/20 text-red-500 bg-red-500/5"
        showSeparator={true}
      >
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingId(null);
                setFormData({
                  title: "",
                  videoUrl: "",
                  category: "",
                  order: items.length,
                });
              }}
              variant="polygon"
              className="px-8 flex items-center gap-2 h-10 uppercase tracking-widest text-[11px]"
            >
              <Plus className="h-4 w-4" /> Provision Reel
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-950 border-zinc-900 text-white rounded-lg p-8 max-w-lg shadow-none">
            <form onSubmit={handleSubmit}>
              <DialogHeader className="space-y-4">
                <div className="w-12 h-12 rounded-md bg-pathfinder-green/10 flex items-center justify-center">
                  <Video className="h-6 w-6 text-pathfinder-green" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold uppercase tracking-tight italic">
                    {editingId ? "Update Reel Registry" : "Provision New Reel"}
                  </DialogTitle>
                  <DialogDescription className="text-zinc-500 text-sm font-medium">
                    Configure the cinematic parameters for this production
                    asset.
                  </DialogDescription>
                </div>
              </DialogHeader>
              <div className="grid gap-6 py-8">
                <div className="grid gap-2 md:col-span-2">
                  <Label
                    htmlFor="title"
                    className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 pl-1"
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
                    className="bg-zinc-900/50 border-zinc-800 focus:ring-pathfinder-green/20 rounded-lg h-12"
                    placeholder="Project Name"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="grid gap-2">
                    <Label
                      htmlFor="category"
                      className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 pl-1"
                    >
                      Visual Type
                    </Label>
                    <Input
                      id="category"
                      required
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="bg-zinc-900/50 border-zinc-800 focus:ring-pathfinder-green/20 rounded-lg h-12"
                      placeholder="e.g. Commercial"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label
                      htmlFor="order"
                      className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 pl-1"
                    >
                      Priority Index
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
                      className="bg-zinc-900/50 border-zinc-800 focus:ring-pathfinder-green/20 rounded-lg h-12"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 pl-1">
                    Transmission Buffer (Video URL)
                  </Label>
                  <div className="flex items-center gap-6">
                    {formData.videoUrl ? (
                      <div className="relative group w-24 h-40 rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950 flex items-center justify-center">
                        <video
                          src={formData.videoUrl}
                          className="w-full h-full object-cover opacity-60"
                          muted
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, videoUrl: "" })
                          }
                          className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-5 w-5 text-white" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-24 h-40 rounded-lg border border-dashed border-zinc-800 flex items-center justify-center text-zinc-800 bg-zinc-900/10">
                        <Video className="h-8 w-8" />
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
                              videoUrl: images[0].url,
                            });
                          }
                        }}
                        folder="our-work"
                        apiUrl={process.env.NEXT_PUBLIC_ERIX_API_URL}
                        apiKey={process.env.NEXT_PUBLIC_ERIX_API_KEY}
                        clientCode={process.env.NEXT_PUBLIC_ERIX_CLIENT_CODE}
                        trigger
                      />
                      <p className="text-[9px] text-zinc-600 font-medium italic leading-relaxed">
                        Deploy vertical MP4 assets for high-impact cinematic
                        rendering.
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
                    "Commit to Registry"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </AdminPageHeader>

      {/* Search & Stats */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-zinc-900/10 p-4 rounded-lg border border-zinc-800/30">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
          <Input
            placeholder="Search Cinematic Registry..."
            className="bg-zinc-900/30 border-zinc-800 rounded-lg pl-10 h-10 text-sm focus:ring-pathfinder-green/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-6 px-4">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
              Logged Reels
            </span>
            <span className="text-xl font-black text-white italic tracking-tighter">
              {items.length}
            </span>
          </div>
          <div className="h-8 w-px bg-zinc-800" />
          <div className="flex flex-col items-end text-pathfinder-green">
            <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
              Playback Status
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest">
              Optimized
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="aspect-9/16 bg-zinc-900/20 border border-zinc-800/50 rounded-lg animate-pulse"
            />
          ))
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group relative aspect-9/16 bg-zinc-900/20 border border-zinc-800/80 rounded-lg overflow-hidden hover:border-pathfinder-green/30 transition-all duration-500 shadow-none"
              >
                <video
                  src={item.videoUrl}
                  className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700 ease-out"
                  onMouseOver={(e) => {
                    const video = e.currentTarget;
                    video.play().catch(() => {});
                  }}
                  onMouseOut={(e) => e.currentTarget.pause()}
                  muted
                  loop
                  playsInline
                />
                <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-5">
                  <div className="mb-4 opacity-0 group-hover:opacity-100 transition-opacity flex justify-center scale-90 group-hover:scale-100 duration-500">
                    <div className="bg-pathfinder-green/20 backdrop-blur-md h-12 w-12 rounded-full flex items-center justify-center border border-pathfinder-green/30">
                      <PlayCircle className="h-6 w-6 text-pathfinder-green" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Badge
                      variant="secondary"
                      className="bg-zinc-950/80 text-white text-[9px] font-bold px-2 py-0 border-zinc-800 rounded-md uppercase tracking-tighter"
                    >
                      {item.category || "General Reel"}
                    </Badge>
                    <h3 className="font-bold text-sm text-white uppercase tracking-tight italic line-clamp-1 pb-1">
                      {item.title}
                    </h3>

                    <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
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
          <Film className="h-10 w-10 text-zinc-800 mb-4" />
          <p className="text-zinc-600 font-medium text-sm">
            No production reels found.
          </p>
        </div>
      )}
    </div>
  );
}
