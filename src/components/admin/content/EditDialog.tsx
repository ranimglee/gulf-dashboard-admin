import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { ContentItem, ToastFunction } from '../../../types/types';
import { API_BASE_URL } from '@/lib/api';

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'align': [] }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['clean']
  ],
};

const formats = [
  'header', 'bold', 'italic', 'underline',
  'color', 'background', 'align',
  'list', 'bullet'
];

interface EditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  item: ContentItem | null;
  setArticles: (articles: ContentItem[]) => void;
  setProjects: (projects: ContentItem[]) => void;
  setResources: (resources: ContentItem[]) => void;
  articles: ContentItem[];
  projects: ContentItem[];
  resources: ContentItem[];
  toast: ToastFunction;
}

const EditDialog: React.FC<EditDialogProps> = ({
  isOpen,
  onClose,
  item,
  setArticles,
  setProjects,
  setResources,
  articles,
  projects,
  resources,
  toast,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    auteur: '',
    type: 'BLOG',
    contenu: '',
    language: 'ENGLISH', // ✅ added
    file: null as File | null,
    category: 'FINANCE',
    fileType: 'PDF',
    subTitle: '',
    country: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

useEffect(() => {
  if (item) {
    if (item.type === 'article') {
      setFormData({
        title: item.title || '',
        description: item.description || '',
        auteur: item.author || '',
        type:  'BLOG', 
        contenu: item.content || '',      
        language: item.language || 'ENGLISH',
        file: null,
        category: '',
        fileType: '',
        subTitle: '',
        country: '',
      });
    } else if (item.type === 'project') {
      setFormData({
        title: item.title || '',
        description: '',
        auteur: '',
        type: 'BLOG',
        contenu: item.content || '',   // ✅ use correct backend field
        language: 'ENGLISH',
        file: null,
        category: '',
        fileType: '',
        subTitle: item.subTitle || '',
        country: item.country || '',
      });
    } else if (item.type === 'resource') {
      setFormData({
        title: item.title || '',
        description: item.description || '',
        auteur: '',
        type: 'BLOG',
        contenu: '',
        language: 'ENGLISH',
        file: null,
        category: item.category || 'FINANCE',
        fileType: item.fileType || 'PDF',
        subTitle: '',
        country: '',
      });
    }

    setPreviewImage(item.imageUrl || item.image || null);
  }
}, [item]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;

    setIsSubmitting(true);

    try {
      let imageUrl = '';
      if (formData.file) {
        if (formData.file.size > 50 * 1024 * 1024) {
          toast({
            title: 'Fichier trop volumineux',
            description: 'La taille maximale autorisée est de 50 Mo.',
            variant: 'destructive',
          });
          return;
        }
        const imageData = new FormData();
        imageData.append('file', formData.file);

        let uploadEndpoint = '';
        if (item.type === 'article') {
          uploadEndpoint = `${API_BASE_URL}/articles/upload-image`;
        } else if (item.type === 'project') {
          uploadEndpoint = `${API_BASE_URL}/initiatives/upload-image-initiative`;
        } else {
          uploadEndpoint = `${API_BASE_URL}/ressources/upload`;
        }

        const uploadResponse = await axios.post(uploadEndpoint, imageData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        imageUrl = uploadResponse.data.imageUrl || uploadResponse.data.image;
      }

      let updateEndpoint = '';
      let updateData: any = {};

      if (item.type === 'article') {
        updateEndpoint = `${API_BASE_URL}/articles/${item.id}`;
        updateData = {
          title: formData.title,
          description: formData.description,
          auteur: formData.auteur,
          type: formData.type,
          contenu: formData.contenu,
          language: formData.language, // ✅ include language
          imageUrl: imageUrl || item.imageUrl,
        };
      } else if (item.type === 'project') {
        updateEndpoint = `${API_BASE_URL}/initiatives/update-initiative/${item.id}`;
        updateData = {
          title: formData.title,
          subTitle: formData.subTitle,
          content: formData.contenu,
          country: formData.country,
          ...(imageUrl && { imageUrl }),
        };
      } else if (item.type === 'resource') {
        updateEndpoint = `${API_BASE_URL}/ressources/${item.id}`;
        updateData = {
          titre: formData.title,
          description: formData.description,
          category: formData.category,
          fileType: formData.fileType,
          ...(imageUrl && { imageUrl }),
        };
      }

      const response = await axios.put(updateEndpoint, updateData);

      const updatedItem = {
        ...item,
        title: formData.title,
        description: formData.description,
        subTitle: formData.subTitle,
        country: formData.country,
        language: formData.language, // ✅ save in state
        ...(imageUrl && { imageUrl }),
        ...(imageUrl && { image: imageUrl }),
      };

      if (item.type === 'article') {
        setArticles(articles.map(a => a.id === item.id ? updatedItem : a));
      } else if (item.type === 'project') {
        setProjects(projects.map(p => p.id === item.id ? updatedItem : p));
      } else if (item.type === 'resource') {
        setResources(resources.map(r => r.id === item.id ? updatedItem : r));
      }

      toast({ title: 'Mis à jour', description: `"${formData.title}" a été mis à jour.` });
      onClose();
    } catch (err: any) {
      toast({
        title: 'Erreur',
        description: err.response?.data?.message || 'Erreur lors de la mise à jour.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#1A535C]">
            Modifier {item.type === 'article' ? 'l\'article' : item.type === 'project' ? 'l\'initiative' : 'la ressource'}
          </DialogTitle>
          <DialogDescription>Modifiez les informations ci-dessous.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Titre</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              disabled={isSubmitting}
            />
          </div>
          {item.type !== 'project' && (
            <div>
              <Label>Description</Label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                disabled={isSubmitting}
              />
            </div>
          )}
          {item.type === 'article' && (
            <>
              <div>
                <Label>Auteur</Label>
                <Input
                  value={formData.auteur}
                  onChange={(e) => setFormData({ ...formData, auteur: e.target.value })}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <Label>Type</Label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="border p-2 rounded w-full"
                  required
                  disabled={isSubmitting}
                >
                  <option value="BLOG">Blog</option>
                  <option value="NEWS">News</option>
                  <option value="TUTORIAL">Tutorial</option>
                  <option value="OPINION">Opinion</option>
                  <option value="REVIEW">Review</option>
                </select>
              </div>
              <div>
                <Label>Langue</Label>
                <select
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  className="border p-2 rounded w-full"
                  required
                  disabled={isSubmitting}
                >
                  <option value="ENGLISH">Anglais</option>
                  <option value="FRENCH">Français</option>
                  <option value="ARABIC">Arabe</option>
                </select>
              </div>
            </>
          )}
          {item.type === 'project' && (
            <>
              <div>
                <Label>Sous-titre</Label>
                <Input
                  value={formData.subTitle}
                  onChange={(e) => setFormData({ ...formData, subTitle: e.target.value })}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <Label>Pays</Label>
                <Input
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  required
                  disabled={isSubmitting}
                />
              </div>
            </>
          )}
          {item.type === 'resource' && (
            <>
              <div>
                <Label>Catégorie</Label>
                <select
                  className="border p-2 rounded w-full"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                  disabled={isSubmitting}
                >
                  <option value="FINANCE">Finance</option>
                  <option value="JURIDIQUE">Juridique</option>
                  <option value="GOUVERNANCE">Gouvernance</option>
                  <option value="ETUDE_DE_CAS">Étude de cas</option>
                </select>
              </div>
              <div>
                <Label>Type de fichier</Label>
                <select
                  className="border p-2 rounded w-full"
                  value={formData.fileType}
                  onChange={(e) => setFormData({ ...formData, fileType: e.target.value })}
                  required
                  disabled={isSubmitting}
                >
                  <option value="PDF">PDF</option>
                  <option value="VIDEO">Vidéo</option>
                  <option value="EXCEL">Excel</option>
                  <option value="DOC">Document Word</option>
                  <option value="IMAGE">Image</option>
                </select>
              </div>
            </>
          )}
          <div>
            <Label>Contenu</Label>
            <ReactQuill
              theme="snow"
              value={formData.contenu}
              onChange={(value) => setFormData({ ...formData, contenu: value })}
              modules={modules}
              formats={formats}
              readOnly={isSubmitting}
            />
          </div>
          <div>
            <Label>Fichier (optionnel pour articles/projets, requis pour ressources)</Label>
            <div className="space-y-2">
              {previewImage && (
                <div className="relative">
                  <img
                    src={previewImage}
                    alt="Aperçu"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 h-6 w-6 p-0 bg-white/80 hover:bg-white"
                    onClick={() => setPreviewImage(null)}
                  >
                    ×
                  </Button>
                </div>
              )}
              <Input
                type="file"
                accept={item.type === 'resource' ? '*' : 'image/*'}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    if (file.size > 50 * 1024 * 1024) {
                      toast({
                        title: 'Fichier trop volumineux',
                        description: 'La taille maximale autorisée est de 50 Mo.',
                        variant: 'destructive',
                      });
                      e.target.value = '';
                      return;
                    }
                    setFormData({ ...formData, file });
                    if (item.type !== 'resource') {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setPreviewImage(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }
                }}
                required={item.type === 'resource'}
                disabled={isSubmitting}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-[#1A535C] text-white hover:bg-[#1A535C]/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Mise à jour...
                </>
              ) : (
                'Mettre à jour'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditDialog;
