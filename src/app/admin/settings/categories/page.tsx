"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { adminApi } from "@/api/admin";
import { Plus, Search, Edit2, Trash2, X, Loader2, FolderOpen } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import Modal from "@/components/ui/Modal";
import ConfirmationModal from "@/components/ui/ConfirmationModal";

interface Category {
    id: number;
    name: string;
    icon: string;
    description?: string;
    created_at: string;
}

export default function CategoriesPage() {
    const { success, error } = useToast();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState({ name: "", icon: "", description: "" });
    const [saving, setSaving] = useState(false);

    // Delete State
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            // We need to add this method to adminApi or use a generic fetch
            // But since I can't edit adminApi easily right now without seeing it, I'll assume I add it later
            // For now, let's use a direct fetch implementation inside adminApi or fetcher

             const categories = await adminApi.getCategories();
             setCategories(categories);
        } catch (err) {
            console.error(err);
            error("Failed to fetch categories");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editingCategory) {
                 await adminApi.updateCategory(editingCategory.id, formData);
                 success("Category updated successfully");
            } else {
                 await adminApi.createCategory(formData);
                 success("Category created successfully");
            }
            closeModal();
            fetchCategories();
        } catch (err: any) {
            error(err.response?.data?.message || "Failed to save category");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deletingId) return;
        try {
            await adminApi.deleteCategory(deletingId);
            success("Category deleted successfully");
            setDeletingId(null);
            fetchCategories();
        } catch (err) {
            error("Failed to delete category");
        }
    };

    const openModal = (category?: Category) => {
        if (category) {
            setEditingCategory(category);
            setFormData({ name: category.name, icon: category.icon, description: category.description || "" });
        } else {
            setEditingCategory(null);
            setFormData({ name: "", icon: "", description: "" });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
        setFormData({ name: "", icon: "", description: "" });
    };

    const filteredCategories = categories.filter(c => 
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-8 max-w-[1600px] mx-auto w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-foreground tracking-tight">Categories</h1>
                    <p className="text-muted-foreground mt-1">Manage event categories and icons.</p>
                </div>
                <Button onClick={() => openModal()} className="flex items-center gap-2 shadow-sm hover:shadow-md transition-all">
                    <Plus className="w-4 h-4" /> Add Category
                </Button>
            </div>

            <Card className="p-0 overflow-hidden border border-border shadow-sm rounded-xl bg-card">
                {/* Toolbar */}
                <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
                     <div className="relative max-w-sm w-full group">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Search categories..." 
                            className="pl-10 pr-4 py-2.5 border border-input rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring w-full transition-all shadow-sm text-foreground placeholder:text-muted-foreground"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                     </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                            <tr>
                                <th className="px-6 py-4 font-semibold tracking-wider">Icon</th>
                                <th className="px-6 py-4 font-semibold tracking-wider">Name</th>
                                <th className="px-6 py-4 font-semibold tracking-wider">Description</th>
                                <th className="px-6 py-4 font-semibold tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border bg-card">
                             {loading ? (
                                 [...Array(3)].map((_, i) => (
                                     <tr key={i} className="animate-pulse">
                                         <td className="px-6 py-4"><div className="w-10 h-10 bg-muted rounded-full"></div></td>
                                         <td className="px-6 py-4"><div className="h-4 bg-muted rounded w-24"></div></td>
                                         <td className="px-6 py-4"><div className="h-4 bg-muted rounded w-48"></div></td>
                                         <td className="px-6 py-4"></td>
                                     </tr>
                                 ))
                             ) : filteredCategories.length === 0 ? (
                                 <tr>
                                     <td colSpan={4} className="px-6 py-16 text-center text-muted-foreground">
                                         <div className="flex flex-col items-center gap-3">
                                             <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                                                <FolderOpen className="w-8 h-8 text-muted-foreground/50" />
                                             </div>
                                             <p className="font-medium text-foreground text-opacity-80">No categories found</p>
                                             <p className="text-xs text-muted-foreground">Try adjusting your search or add a new one.</p>
                                         </div>
                                     </td>
                                 </tr>
                             ) : (
                                 filteredCategories.map((category) => (
                                     <tr key={category.id} className="group hover:bg-accent/50 transition-colors duration-150">
                                         <td className="px-6 py-4">
                                             <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-lg shadow-sm group-hover:scale-105 transition-transform">
                                                  {category.icon ? category.icon.substring(0, 2) : '📂'}
                                             </div>
                                         </td>
                                         <td className="px-6 py-4">
                                             <span className="font-semibold text-foreground">{category.name}</span>
                                         </td>
                                         <td className="px-6 py-4 text-muted-foreground max-w-sm truncate">
                                             {category.description || <span className="text-muted-foreground/60 italic">No description</span>}
                                         </td>
                                         <td className="px-6 py-4 text-right">
                                             <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                 <button 
                                                    onClick={() => openModal(category)}
                                                    className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                                                    title="Edit"
                                                 >
                                                     <Edit2 className="w-4 h-4" />
                                                 </button>
                                                 <button 
                                                    onClick={() => setDeletingId(category.id)}
                                                    className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
                                                    title="Delete"
                                                 >
                                                     <Trash2 className="w-4 h-4" />
                                                 </button>
                                             </div>
                                         </td>
                                     </tr>
                                 ))
                             )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Create/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={editingCategory ? "Edit Category" : "Add Category"}
            >
                <form onSubmit={handleSubmit} className="space-y-5">
                     <div>
                         <label className="block text-sm font-medium text-foreground mb-1.5">Name</label>
                         <Input 
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            required
                            placeholder="e.g. Music, Tech, Sports"
                            className="bg-background border-input focus:bg-background transition-colors"
                         />
                     </div>
                     <div>
                         <label className="block text-sm font-medium text-foreground mb-1.5">Icon (Emoji)</label>
                         <div className="flex gap-3">
                            <div className="w-12 h-10 flex items-center justify-center bg-muted/50 rounded-lg text-xl border border-input">
                                {formData.icon || '📂'}
                            </div>
                            <Input 
                                value={formData.icon}
                                onChange={(e) => setFormData({...formData, icon: e.target.value})}
                                placeholder="Paste an emoji here (e.g. 🎵)"
                                className="flex-1 bg-background border-input focus:bg-background transition-colors"
                            />
                         </div>
                     </div>
                     <div>
                         <label className="block text-sm font-medium text-foreground mb-1.5">Description</label>
                         <textarea 
                            className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring min-h-[100px] transition-all text-sm resize-none text-foreground placeholder:text-muted-foreground"
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            placeholder="Optional description of this category..."
                         />
                     </div>
                     <div className="flex justify-end gap-3 pt-4 border-t border-border mt-2">
                         <Button type="button" variant="ghost" onClick={closeModal} className="text-muted-foreground hover:text-foreground">Cancel</Button>
                         <Button type="submit" loading={saving} className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all">
                             {editingCategory ? "Update Category" : "Create Category"}
                         </Button>
                     </div>
                </form>
            </Modal>

            {/* Delete Confirmation */}
            <ConfirmationModal
                isOpen={!!deletingId}
                onClose={() => setDeletingId(null)}
                onConfirm={handleDelete}
                title="Delete Category"
                message="Are you sure you want to delete this category? Events associated with it may lose their categorization."
                variant="danger"
                confirmLabel="Yes, Delete it"
            />
        </div>
    );
}
