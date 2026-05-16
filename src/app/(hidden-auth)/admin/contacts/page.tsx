"use client";

import { useEffect, useState } from "react";
import {
  getContactSubmissions,
  markAsRead,
  deleteSubmission,
  updateSubmissionStatus,
  updateSubmissionPriority,
  createManualLead,
  bulkDeleteSubmissions,
} from "@/app/actions/contact";
import {
  Trash2,
  Mail,
  Phone,
  Search,
  CheckCircle2,
  Inbox,
  Globe,
  Archive,
  MessageSquare,
  ArrowRight,
  Clock,
  X,
  User,
  ExternalLink,
  ChevronRight,
  Filter,
  MoreVertical,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AdminPageHeader } from "@/components/admin/page-header";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const STATUS_COLORS: Record<string, string> = {
  New: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  "In Progress": "bg-amber-500/10 text-amber-500 border-amber-500/20",
  Closed: "bg-zinc-500/10 text-zinc-500 border-zinc-500/20",
  Junk: "bg-red-500/10 text-red-500 border-red-500/20",
};

const PRIORITY_COLORS: Record<string, string> = {
  High: "bg-red-500 text-white",
  Medium: "bg-amber-500 text-white",
  Low: "bg-blue-500 text-white",
};

export default function ContactsClient({
  initialSubmissions = [],
}: {
  initialSubmissions?: any[];
}) {
  const [submissions, setSubmissions] = useState<any[]>(initialSubmissions);
  const [loading, setLoading] = useState(initialSubmissions.length === 0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    phone: string;
    message: string;
    source: string;
    website: string;
    service: string;
    budget: string;
    status: "New" | "In Progress" | "Closed" | "Junk";
    priority: "Low" | "Medium" | "High";
  }>({
    name: "",
    email: "",
    phone: "",
    message: "",
    source: "Admin Manual",
    website: "",
    service: "Other",
    budget: "Contact for details",
    status: "In Progress",
    priority: "Medium",
  });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const fetchSubmissions = async () => {
    setLoading(true);
    const data = await getContactSubmissions();
    setSubmissions(data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (initialSubmissions.length === 0) {
      fetchSubmissions();
    }
    document.title = "Contacts | Admin | Pathfinder";
  }, []);

  const handleUpdateStatus = async (
    id: string,
    status: "New" | "In Progress" | "Closed" | "Junk",
  ) => {
    const res = await updateSubmissionStatus(id, status);
    if (res.success) {
      toast.success(`Status set to ${status}`);
      fetchSubmissions();
      if (selectedInquiry?._id === id) {
        setSelectedInquiry((prev: any) => ({ ...prev, status }));
      }
    }
  };

  const handleUpdatePriority = async (
    id: string,
    priority: "Low" | "Medium" | "High",
  ) => {
    const res = await updateSubmissionPriority(id, priority);
    if (res.success) {
      toast.success(`Priority set to ${priority}`);
      fetchSubmissions();
      if (selectedInquiry?._id === id) {
        setSelectedInquiry((prev: any) => ({ ...prev, priority }));
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to purge this record?")) return;
    const res = await deleteSubmission(id);
    if (res.success) {
      toast.success("Record purged");
      setSelectedInquiry(null);
      setSelectedIds((prev) => prev.filter((item) => item !== id));
      fetchSubmissions();
    }
  };

  const handleBulkDelete = async () => {
    if (
      !confirm(
        `Are you sure you want to purge ${selectedIds.length} records? This cannot be undone.`,
      )
    )
      return;
    const res = await bulkDeleteSubmissions(selectedIds);
    if (res.success) {
      toast.success(`${selectedIds.length} records purged`);
      setSelectedIds([]);
      if (selectedInquiry && selectedIds.includes(selectedInquiry._id)) {
        setSelectedInquiry(null);
      }
      fetchSubmissions();
    } else {
      toast.error(res.error || "Bulk delete failed");
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredSubmissions.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredSubmissions.map((s) => s._id));
    }
  };

  const toggleSelect = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = await createManualLead(formData);
    setIsSubmitting(false);
    if (res.success) {
      toast.success("New lead provisioned.");
      setIsCreateDialogOpen(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
        source: "Admin Manual",
        website: "",
        service: "Other",
        budget: "Contact for details",
        status: "In Progress",
        priority: "Medium",
      });
      fetchSubmissions();
    } else {
      toast.error(res.error || "Failed to create lead.");
    }
  };

  const filteredSubmissions = submissions.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.message && s.message.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = filterStatus === "All" || s.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex h-[calc(100vh-120px)] overflow-hidden">
      {/* Main List Column */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${selectedInquiry ? "hidden lg:flex" : "flex"}`}
      >
        <AdminPageHeader
          title="Lead Management"
          description="Track and communicate with potential partners."
          badge="CRM"
          badgeClassName="border-emerald-500/20 text-emerald-500 bg-emerald-500/5"
          showSeparator={true}
        >
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button size="sm" variant="polygon" className="px-8 h-9">
                <span className="text-xs uppercase tracking-widest">
                  + New Lead
                </span>
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#0A0A10] border-white/10 text-white max-w-2xl rounded-2xl shadow-2xl p-8">
              <DialogHeader className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-linear-to-r from-[#7C6EFA]/10 to-[#22D3EE]/10 flex items-center justify-center border border-white/5">
                  <Plus className="h-6 w-6 text-[#22D3EE]" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-black uppercase tracking-tighter text-white">
                    Provision New Lead
                  </DialogTitle>
                </div>
              </DialogHeader>
              <form onSubmit={handleCreateLead} className="space-y-5 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-[#64647A]">
                      Contact Name
                    </Label>
                    <Input
                      required
                      placeholder="e.g. David Chen"
                      className="bg-[#060608] border-white/10 focus:border-[#7C6EFA] focus:ring-1 focus:ring-[#7C6EFA]/30 rounded-xl h-11 text-white placeholder:text-[#64647A]"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-[#64647A]">
                      Email Address
                    </Label>
                    <Input
                      required
                      type="email"
                      placeholder="david@pathfinders.com"
                      className="bg-[#060608] border-white/10 focus:border-[#7C6EFA] focus:ring-1 focus:ring-[#7C6EFA]/30 rounded-xl h-11 text-white placeholder:text-[#64647A]"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-[#64647A]">
                      Voice Line (Phone)
                    </Label>
                    <Input
                      required
                      placeholder="+91 99999 99999"
                      className="bg-[#060608] border-white/10 focus:border-[#7C6EFA] focus:ring-1 focus:ring-[#7C6EFA]/30 rounded-xl h-11 text-white placeholder:text-[#64647A]"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-[#64647A]">
                      Company Website
                    </Label>
                    <Input
                      placeholder="https://example.com"
                      className="bg-[#060608] border-white/10 focus:border-[#7C6EFA] focus:ring-1 focus:ring-[#7C6EFA]/30 rounded-xl h-11 text-white placeholder:text-[#64647A]"
                      value={formData.website}
                      onChange={(e) =>
                        setFormData({ ...formData, website: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-[#64647A]">
                      Service Category
                    </Label>
                    <Select
                      value={formData.service}
                      onValueChange={(val) =>
                        setFormData({ ...formData, service: val })
                      }
                    >
                      <SelectTrigger className="bg-[#060608] border-white/10 focus:border-[#7C6EFA] focus:ring-1 focus:ring-[#7C6EFA]/30 rounded-xl h-11 text-white">
                        <SelectValue placeholder="Select Service" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0A0A10] border-white/10 text-white rounded-xl">
                        <SelectItem value="Film Production">
                          Film Production
                        </SelectItem>
                        <SelectItem value="Regional Ad Labs">
                          Regional Ad Labs
                        </SelectItem>
                        <SelectItem value="Strategic Branding">
                          Strategic Branding
                        </SelectItem>
                        <SelectItem value="Production Reels">
                          Production Reels
                        </SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-[#64647A]">
                      Status Protocol
                    </Label>
                    <Select
                      value={formData.status}
                      onValueChange={(val) =>
                        setFormData({
                          ...formData,
                          status: val as
                            | "New"
                            | "In Progress"
                            | "Closed"
                            | "Junk",
                        })
                      }
                    >
                      <SelectTrigger className="bg-[#060608] border-white/10 focus:border-[#7C6EFA] focus:ring-1 focus:ring-[#7C6EFA]/30 rounded-xl h-11 text-white">
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0A0A10] border-white/10 text-white rounded-xl">
                        <SelectItem value="New">New</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Closed">Closed</SelectItem>
                        <SelectItem value="Junk">Junk</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-[#64647A]">
                    Project Description / Message
                  </Label>
                  <Textarea
                    required
                    placeholder="Describe the lead's requirements or initial inquiry..."
                    className="bg-[#060608] border-white/10 focus:border-[#7C6EFA] focus:ring-1 focus:ring-[#7C6EFA]/30 rounded-xl min-h-[100px] text-white placeholder:text-[#64647A]"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                  />
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1 space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-[#64647A]">
                      Priority Level
                    </Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(val) =>
                        setFormData({
                          ...formData,
                          priority: val as "Low" | "Medium" | "High",
                        })
                      }
                    >
                      <SelectTrigger className="bg-[#060608] border-white/10 focus:border-[#7C6EFA] focus:ring-1 focus:ring-[#7C6EFA]/30 rounded-xl h-11 text-white">
                        <SelectValue placeholder="Select Priority" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0A0A10] border-white/10 text-white rounded-xl">
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <DialogFooter className="pt-4 border-t border-white/5 gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsCreateDialogOpen(false)}
                    className="rounded-xl text-[#64647A] hover:text-white uppercase tracking-widest text-[10px] font-bold h-11 px-6 hover:bg-white/5"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-11 px-10 uppercase tracking-widest text-xs min-w-[160px] bg-linear-to-r from-[#7C6EFA] to-[#22D3EE] text-black font-bold rounded-xl hover:shadow-[0_0_40px_rgba(124,110,250,0.35)] transition-all"
                  >
                    {isSubmitting ? "Provisioning..." : "Create Lead"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </AdminPageHeader>

        <div className="py-2 flex items-center justify-between gap-4 bg-zinc-950/20">
          <div className="flex items-center gap-3">
            <div
              onClick={toggleSelectAll}
              className={`w-5 h-5 rounded border flex items-center justify-center cursor-pointer transition-all ${
                selectedIds.length > 0 &&
                selectedIds.length === filteredSubmissions.length
                  ? "bg-pathfinder-green border-pathfinder-green"
                  : selectedIds.length > 0
                    ? "bg-pathfinder-green/20 border-pathfinder-green/50"
                    : "border-zinc-800 hover:border-zinc-700"
              }`}
            >
              {selectedIds.length > 0 &&
                selectedIds.length === filteredSubmissions.length && (
                  <div className="w-1.5 h-1.5 rounded-full bg-black" />
                )}
              {selectedIds.length > 0 &&
                selectedIds.length < filteredSubmissions.length && (
                  <div className="w-2 h-0.5 rounded-full bg-pathfinder-green" />
                )}
            </div>
            <div className="relative flex-1 min-w-[300px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
              <Input
                placeholder="Search by name, email or message..."
                className="bg-zinc-900/30 border-zinc-800 rounded-lg pl-10 h-10 text-sm focus:ring-pathfinder-green/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-zinc-900/50 border-zinc-800 rounded-lg h-10 px-4 flex items-center gap-2"
                >
                  <Filter className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-tight text-zinc-400">
                    Status: {filterStatus}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-zinc-900 border-zinc-800 text-white rounded-lg"
              >
                <DropdownMenuItem onClick={() => setFilterStatus("All")}>
                  All
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("New")}>
                  New
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setFilterStatus("In Progress")}
                >
                  In Progress
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("Closed")}>
                  Closed
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("Junk")}>
                  Junk
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pb-6 custom-scrollbar">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-20 bg-zinc-900/30 border border-zinc-800/50 rounded-lg animate-pulse"
              />
            ))
          ) : filteredSubmissions.length > 0 ? (
            filteredSubmissions.map((sub) => (
              <div
                key={sub._id}
                onClick={() => setSelectedInquiry(sub)}
                className={`group flex items-center gap-4 p-4 rounded-lg border transition-all cursor-pointer ${
                  selectedInquiry?._id === sub._id
                    ? "bg-pathfinder-green/5 border-pathfinder-green/20"
                    : "bg-zinc-900/10 border-zinc-800/30 hover:bg-zinc-800/20 hover:border-zinc-800"
                }`}
              >
                <div
                  onClick={(e) => toggleSelect(e, sub._id)}
                  className={`shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-all ${
                    selectedIds.includes(sub._id)
                      ? "bg-pathfinder-green border-pathfinder-green"
                      : "border-zinc-800 group-hover:border-zinc-700"
                  }`}
                >
                  {selectedIds.includes(sub._id) && (
                    <div className="w-1.5 h-1.5 rounded-full bg-black" />
                  )}
                </div>

                <div className="shrink-0 ml-2">
                  <Avatar className="h-10 w-10 border border-zinc-900">
                    <AvatarFallback className="bg-zinc-900 text-zinc-500 font-bold text-xs uppercase">
                      {sub.name[0]}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h4 className="font-bold text-sm text-white truncate">
                      {sub.name}
                    </h4>
                    {sub.priority === "High" && (
                      <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                    )}
                  </div>
                  <p className="text-[10px] text-zinc-500 font-medium truncate">
                    {sub.email}
                  </p>
                </div>

                {/* Email Status Indicator */}
                <div className="shrink-0 flex items-center justify-center w-8">
                  {sub.emailSent ? (
                    <Mail className="h-3 w-3 text-pathfinder-green" />
                  ) : sub.emailError ? (
                    <AlertTriangle className="h-3 w-3 text-red-500" />
                  ) : (
                    <Mail className="h-3 w-3 text-zinc-800 opacity-20" />
                  )}
                </div>

                <div className="hidden md:flex flex-col items-end gap-1.5">
                  <Badge
                    variant="outline"
                    className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 ${STATUS_COLORS[sub.status || "New"]}`}
                  >
                    {sub.status || "New"}
                  </Badge>
                  <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-tighter">
                    {new Date(sub.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <ChevronRight
                  className={`w-4 h-4 text-zinc-800 group-hover:text-zinc-600 transition-colors ${selectedInquiry?._id === sub._id ? "text-pathfinder-green" : ""}`}
                />
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-zinc-600 border border-dashed border-zinc-800 rounded-2xl">
              <Inbox className="h-10 w-10 mb-4 opacity-20" />
              <p className="text-sm font-medium">
                No inquiries found in this view.
              </p>
            </div>
          )}
        </div>

        {/* Bulk Action Bar */}
        <AnimatePresence>
          {selectedIds.length > 0 && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-zinc-900 border border-zinc-800 rounded-full shadow-2xl flex items-center gap-6"
            >
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-pathfinder-green text-black flex items-center justify-center text-[10px] font-bold">
                  {selectedIds.length}
                </span>
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                  Selected
                </span>
              </div>
              <Separator orientation="vertical" className="h-4 bg-zinc-800" />
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedIds([])}
                  className="h-8 text-[10px] uppercase font-bold tracking-widest text-zinc-500 hover:text-white"
                >
                  Deselect
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBulkDelete}
                  className="h-8 text-[10px] uppercase font-bold tracking-widest text-red-500 hover:bg-red-500/10"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete Selected
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Detail Sidebar */}
      <AnimatePresence>
        {selectedInquiry && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 lg:relative lg:inset-auto w-full lg:w-[450px] bg-black lg:bg-zinc-950 border-l border-zinc-800 flex flex-col shadow-none"
          >
            <div className="p-6 flex items-center justify-between border-b border-zinc-800/50">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  onClick={() => setSelectedInquiry(null)}
                >
                  <X className="w-5 h-5 text-zinc-400" />
                </Button>
                <h3 className="font-bold text-white uppercase tracking-widest text-xs italic">
                  Inquiry Intelligence
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-zinc-900 rounded-md"
                    >
                      <MoreVertical className="w-4 h-4 text-zinc-400" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="bg-zinc-900 border-zinc-800 text-white rounded-lg"
                  >
                    <DropdownMenuItem
                      className="text-red-500 focus:text-red-500"
                      onClick={() => handleDelete(selectedInquiry._id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> Purge Lead
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden lg:flex h-8 w-8 hover:bg-zinc-900 rounded-md"
                  onClick={() => setSelectedInquiry(null)}
                >
                  <X className="w-4 h-4 text-zinc-400" />
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar bg-zinc-950/20">
              {/* Header Info */}
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-20 w-20 border border-zinc-800 mb-4">
                  <AvatarFallback className="bg-zinc-900 text-pathfinder-green font-bold text-2xl uppercase">
                    {selectedInquiry.name[0]}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold text-white mb-1 uppercase tracking-tight italic">
                  {selectedInquiry.name}
                </h2>
                <Badge
                  variant="outline"
                  className={`text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-md ${STATUS_COLORS[selectedInquiry.status || "New"]}`}
                >
                  {selectedInquiry.status || "New"}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-zinc-900/20 border border-zinc-800/50 rounded-lg">
                  <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-pathfinder-green opacity-50" />{" "}
                    Logged
                  </p>
                  <p className="text-xs font-bold text-white">
                    {new Date(selectedInquiry.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="p-4 bg-zinc-900/20 border border-zinc-800/50 rounded-lg">
                  <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-pathfinder-green opacity-50" />{" "}
                    Priority
                  </p>
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-1.5 w-1.5 rounded-full ${PRIORITY_COLORS[selectedInquiry.priority || "Medium"].replace("text-white", "")}`}
                    />
                    <p className="text-xs font-bold text-white uppercase tracking-tighter">
                      {selectedInquiry.priority || "Medium"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Lead Data */}
              <div className="space-y-6">
                <h4 className="text-[10px] font-bold text-zinc-700 uppercase tracking-[0.3em] pl-1">
                  Lead Intel
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-sm group">
                    <div className="w-8 h-8 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600 group-hover:text-pathfinder-green transition-colors">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest">
                        Comm Link
                      </p>
                      <a
                        href={`mailto:${selectedInquiry.email}`}
                        className="text-zinc-300 font-medium hover:text-white transition-colors"
                      >
                        {selectedInquiry.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm group">
                    <div className="w-8 h-8 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600 group-hover:text-pathfinder-green transition-colors">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest">
                        Voice Line
                      </p>
                      <span className="text-zinc-300 font-medium">
                        {selectedInquiry.phone}
                      </span>
                    </div>
                  </div>
                  {(selectedInquiry.website ||
                    selectedInquiry.website === "") && (
                    <div className="flex items-center gap-4 text-sm group">
                      <div className="w-8 h-8 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600 group-hover:text-pathfinder-green transition-colors">
                        <Globe className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest">
                          Digital Hub
                        </p>
                        <a
                          href={
                            selectedInquiry.website.startsWith("http")
                              ? selectedInquiry.website
                              : `https://${selectedInquiry.website}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-zinc-300 font-medium hover:text-white flex items-center gap-1.5 transition-colors"
                        >
                          {selectedInquiry.website || "Undefined"}{" "}
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity" />
                        </a>
                      </div>
                    </div>
                  )}
                  {selectedInquiry.service && (
                    <div className="flex items-center gap-4 text-sm group">
                      <div className="w-8 h-8 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600 group-hover:text-pathfinder-green transition-colors">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest">
                          Core Requirement
                        </p>
                        <span className="text-zinc-300 font-medium">
                          {selectedInquiry.service}
                        </span>
                      </div>
                    </div>
                  )}
                  {selectedInquiry.budget && (
                    <div className="flex items-center gap-4 text-sm group">
                      <div className="w-8 h-8 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600 group-hover:text-pathfinder-green transition-colors">
                        <span className="text-xs font-bold">$</span>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest">
                          Capitalization
                        </p>
                        <span className="text-zinc-300 font-medium">
                          {selectedInquiry.budget}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Separator className="bg-zinc-900" />

              {/* Message */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-pathfinder-green opacity-40" />
                  <h4 className="text-[10px] font-bold text-zinc-700 uppercase tracking-[0.3em]">
                    Transmission Buffer
                  </h4>
                </div>
                <div className="p-6 bg-zinc-900/30 border border-zinc-800/80 rounded-lg relative">
                  <div className="absolute top-0 left-6 -translate-y-1/2 px-2 bg-black text-[8px] font-bold text-zinc-700 uppercase tracking-widest">
                    Source Input
                  </div>
                  <p className="text-sm text-zinc-400 leading-relaxed italic">
                    "{selectedInquiry.message}"
                  </p>
                </div>
              </div>

              {/* Email Protocol Status */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-pathfinder-green opacity-40" />
                  <h4 className="text-[10px] font-bold text-zinc-700 uppercase tracking-[0.3em]">
                    Greeting Protocol
                  </h4>
                </div>
                <div
                  className={`p-4 rounded-lg border flex flex-col gap-2 ${selectedInquiry.emailSent ? "bg-emerald-500/5 border-emerald-500/10" : selectedInquiry.emailError ? "bg-red-500/5 border-red-500/10" : "bg-zinc-900/20 border-zinc-800/50"}`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                      Transmission Status
                    </p>
                    <Badge
                      variant="outline"
                      className={`text-[8px] font-bold uppercase tracking-widest px-2 py-0 ${selectedInquiry.emailSent ? "text-emerald-500 border-emerald-500/20" : selectedInquiry.emailError ? "text-red-500 border-red-500/20" : "text-zinc-500 border-zinc-800"}`}
                    >
                      {selectedInquiry.emailSent
                        ? "Confirmed"
                        : selectedInquiry.emailError
                          ? "Failed"
                          : "Pending / Manual"}
                    </Badge>
                  </div>
                  {selectedInquiry.emailError && (
                    <div className="pt-2 border-t border-red-500/10">
                      <p className="text-[8px] font-bold text-red-500/50 uppercase tracking-widest mb-1">
                        Error Response
                      </p>
                      <p className="text-[10px] text-red-400 font-medium leading-relaxed italic">
                        {selectedInquiry.emailError}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* CRM Actions */}
              <div className="pt-4 space-y-6 pb-4">
                <h4 className="text-[10px] font-bold text-zinc-700 uppercase tracking-[0.3em] pl-1">
                  Protocol Control
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <p className="text-[8px] font-bold text-zinc-700 uppercase tracking-widest pl-1">
                      Set State
                    </p>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full bg-zinc-900/50 border-zinc-800 text-zinc-500 font-bold text-[10px] uppercase h-10 rounded-lg justify-between"
                        >
                          {selectedInquiry.status || "New"}{" "}
                          <ChevronRight className="w-3 h-3 rotate-90 opacity-20" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-zinc-900 border-zinc-800 text-white rounded-lg w-40">
                        {(
                          ["New", "In Progress", "Closed", "Junk"] as const
                        ).map((s) => (
                          <DropdownMenuItem
                            key={s}
                            onClick={() =>
                              handleUpdateStatus(selectedInquiry._id, s)
                            }
                          >
                            {s}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[8px] font-bold text-zinc-700 uppercase tracking-widest pl-1">
                      Set Urgency
                    </p>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full bg-zinc-900/50 border-zinc-800 text-zinc-500 font-bold text-[10px] uppercase h-10 rounded-lg justify-between"
                        >
                          {selectedInquiry.priority || "Medium"}{" "}
                          <ChevronRight className="w-3 h-3 rotate-90 opacity-20" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-zinc-900 border-zinc-800 text-white rounded-lg w-40">
                        {(["Low", "Medium", "High"] as const).map((p) => (
                          <DropdownMenuItem
                            key={p}
                            onClick={() =>
                              handleUpdatePriority(selectedInquiry._id, p)
                            }
                          >
                            {p}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <a
                  href={`mailto:${selectedInquiry.email}`}
                  className="w-full bg-pathfinder-green/10 hover:bg-pathfinder-green text-pathfinder-green hover:text-black border border-pathfinder-green/20 font-bold uppercase tracking-widest text-[11px] h-12 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4" /> Respond to Protocol
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
