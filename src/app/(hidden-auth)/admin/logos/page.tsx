"use client";

import { useState, useEffect } from "react";
import { getLogos, upsertLogo, deleteLogo } from "@/app/actions/content";
import {
  Plus,
  Trash2,
  Image as ImageIcon,
  Edit2,
  Building2,
  Search,
  ArrowUpDown,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AdminPageHeader } from "@/components/admin/page-header";
import { ImageModal } from "@/components/image-modal";

export default function LogosPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    imageUrl: "",
    order: 0,
  });
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchItems = async () => {
    setLoading(true);
    const data = await getLogos();
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
    document.title = "Partners & Logos | Admin | Pathfinder";
  }, []);

  const handleEdit = (item: any) => {
    setEditingId(item._id);
    setFormData({
      name: item.name,
      imageUrl: item.imageUrl,
      order: item.order,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ name: "", imageUrl: "", order: 0 });
    setIsSaving(false);
    setIsDialogOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await upsertLogo({ id: editingId, ...formData });
      if (res.success) {
        toast.success(
          editingId === null ? "Added to our network" : "Logo updated",
        );
        resetForm();
        fetchItems();
      } else {
        toast.error("Failed to save logo");
      }
    } catch (error) {
      toast.error("An error occurred while saving");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    const res = await deleteLogo(id);
    if (res.success) {
      toast.success("Identity purged");
      fetchItems();
    }
  };

  const filteredItems = items.filter((l) =>
    l.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-4 lg:space-y-6 pb-6 lg:pb-8">
      <AdminPageHeader
        title="Company Logos"
        description="Manage the brand identities of partners."
        badge="Partnerships"
        badgeClassName="border-blue-500/20 text-blue-500 bg-blue-500/5"
      >
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingId(null);
                setFormData({
                  name: "",
                  imageUrl: "",
                  order: items.length,
                });
              }}
              variant="polygon"
              className="px-8 h-10"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Logo
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-950 border-zinc-900 text-white rounded-2xl max-w-lg">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold tracking-tight">
                  {editingId ? "Edit Brand" : "New Affiliate"}
                </DialogTitle>
                <DialogDescription className="text-zinc-500">
                  Update the visual representation for this partner.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-5 py-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="grid gap-1.5 md:col-span-3">
                    <Label
                      htmlFor="title"
                      className="text-[10px] font-bold uppercase tracking-wider text-zinc-500"
                    >
                      Company Name
                    </Label>
                    <Input
                      id="title"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="bg-zinc-900 border-zinc-800 focus:ring-pathfinder-green rounded-lg h-11"
                      placeholder="e.g. Acme Corporation"
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label
                      htmlFor="order"
                      className="text-[10px] font-bold uppercase tracking-wider text-zinc-500"
                    >
                      Rank
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
                      className="bg-zinc-900 border-zinc-800 focus:ring-pathfinder-green rounded-lg h-11"
                    />
                  </div>
                </div>
                <div className="grid gap-1.5">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                    Partner Logo Asset
                  </Label>
                  <div className="flex items-center gap-4">
                    {formData.imageUrl ? (
                      <div className="relative group w-24 h-24 rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900 flex items-center justify-center p-2">
                        <img
                          src={formData.imageUrl}
                          alt="Preview"
                          className="max-w-full max-h-full object-contain filter grayscale invert opacity-60"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, imageUrl: "" })
                          }
                          className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-4 w-4 text-white" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-lg border-2 border-dashed border-zinc-800 flex items-center justify-center text-zinc-700">
                        <ImageIcon className="h-6 w-6" />
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
                        folder="logos"
                        apiUrl={process.env.NEXT_PUBLIC_ERIX_API_URL}
                        apiKey={process.env.NEXT_PUBLIC_ERIX_API_KEY}
                        clientCode={process.env.NEXT_PUBLIC_ERIX_CLIENT_CODE}
                        trigger
                      />
                      <p className="text-[10px] text-zinc-500 mt-2">
                        Upload or select a PNG/SVG logo. Minimal styling
                        preferred.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={resetForm}
                  className="rounded-lg text-zinc-500"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSaving}
                  variant="polygon"
                  className="px-10"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </AdminPageHeader>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-600" />
          <Input
            placeholder="Search partners..."
            className="bg-zinc-900/50 border-zinc-800 rounded-xl pl-10 h-10 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest bg-zinc-900/30 px-3 py-1.5 rounded-lg border border-zinc-800/50">
          <ArrowUpDown className="h-3 w-3 text-pathfinder-green" />
          Sorted by Order
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {loading ? (
          Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square bg-zinc-900/50 animate-pulse rounded-xl border border-zinc-800"
            />
          ))
        ) : (
          <AnimatePresence>
            {filteredItems.map((logo) => (
              <motion.div
                key={logo._id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group relative aspect-square bg-zinc-900/40 border border-zinc-800 rounded-md overflow-hidden hover:border-zinc-700 transition-colors p-0"
              >
                <div className="absolute inset-1 flex items-center justify-center">
                  <img
                    src={logo.imageUrl}
                    alt={logo.name}
                    className="max-w-full max-h-full object-contain filter grayscale invert group-hover:grayscale-0 group-hover:invert-0 group-hover:scale-105 transition-all duration-300"
                  />
                </div>

                <div className="absolute bottom-2 left-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Badge
                    variant="secondary"
                    className="bg-zinc-900/80 text-white text-[9px] font-bold py-0 border-zinc-800"
                  >
                    #{logo.order}
                  </Badge>
                </div>

                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="icon"
                    className="h-7 w-7 bg-zinc-900/80 hover:bg-zinc-100 hover:text-black text-white border border-zinc-800 rounded-lg"
                    onClick={() => handleEdit(logo)}
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                  <Button
                    size="icon"
                    className="h-7 w-7 bg-zinc-900/80 hover:bg-red-500 text-white border border-zinc-800 rounded-lg"
                    onClick={() => handleDelete(logo._id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {!loading && filteredItems.length === 0 && (
        <div className="py-20 text-center border border-dashed border-zinc-800 rounded-2xl flex flex-col items-center">
          <Building2 className="h-10 w-10 text-zinc-800 mx-auto mb-4" />
          <p className="text-zinc-600 font-medium text-sm">
            No partners found.
          </p>
        </div>
      )}
    </div>
  );
}
