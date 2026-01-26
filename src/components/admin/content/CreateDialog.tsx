import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { handleCreateItem } from '../../../utils/contentUtils';
import { ContentItem, ToastFunction } from '../../../types/types';

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

interface CreateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTab: string;
  setResources: (resources: ContentItem[]) => void;
  setProjects: (projects: ContentItem[]) => void;
  setArticles: (articles: ContentItem[]) => void;
  resources: ContentItem[];
  projects: ContentItem[];
  articles: ContentItem[];
  setIsCreateDialogOpen: (open: boolean) => void;
  toast: ToastFunction;
}

const CreateDialog: React.FC<CreateDialogProps> = ({
  isOpen,
  onClose,
  selectedTab,
  setResources,
  setProjects,
  setArticles,
  resources,
  projects,
  articles,
  setIsCreateDialogOpen,
  toast,
}) => {
 const [formData, setFormData] = useState({
  title: '',
  description: '',
  auteur: '',
  type: 'BLOG',
  contenu: '',
  file: null as File | null,

  category: 'LEGAL', 
  subCategory: '',   
  subSubCategory: '',  
   

  fileType: 'PDF',
  subTitle: '',
  country: '',
  language: 'ENGLISH',
});

   
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleCreateItem(
      formData,
      selectedTab,
      setIsSubmitting,
      setResources,
      setProjects,
      setArticles,
      resources,
      projects,
      articles,
      setIsCreateDialogOpen,
      toast
    );
    setFormData({
      title: '',
      description: '',
      auteur: '',
      type: 'BLOG',
      contenu: '',
      file: null,
      category: 'LEGAL', 
      subCategory:'',
      subSubCategory: '',  

      fileType: 'PDF',
      subTitle: '',
      country: '',
    language: 'ENGLISH', // ✅ default value

    });
    setPreviewImage(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
        setFormData({
          title: '',
          description: '',
          auteur: '',
          type: 'BLOG',
          contenu: '',
          file: null,
          category: 'LEGAL', 
          subCategory:'',
          subSubCategory:'',
          fileType: 'PDF',
          subTitle: '',
          country: '',
        language: 'ENGLISH', // ✅ default value

        });
        setPreviewImage(null);
      }
    }}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#1A535C]">
            Créer un nouveau {selectedTab.slice(0, -1)}
          </DialogTitle>
          <DialogDescription>Remplissez les informations ci-dessous.</DialogDescription>
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
          {selectedTab !== 'projects' && (
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
          {selectedTab === 'articles' && (
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
            </>
          )}
          {selectedTab === 'projects' && (
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
          {selectedTab === 'resources' && (
            <>
              <div>
                <Label>Catégorie</Label>
                <select
                  className="border p-2 rounded w-full"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value, subCategory: '' })}
                  required
                  disabled={isSubmitting}
                >
                 <option value="LEGAL">Juridique</option>
                 <option value="DATA">Données</option>
                 <option value="DIVERSE">Divers</option>
                 <option value="STUDIES">Études</option>

                </select>
              </div>
              {/* Subcategory (depends on category) */}
{['LEGAL', 'DIVERSE'].includes(formData.category) && (
  <div>
    <Label>Sous-catégorie</Label>
    <select
      className="border p-2 rounded w-full"
      value={formData.subCategory}
      onChange={(e) =>
        setFormData({ ...formData, subCategory: e.target.value })
      }
      required
      disabled={isSubmitting}
    >
      <option value="">-- Sélectionner --</option>

      {formData.category === 'LEGAL' && (
        <>
          <option value="NATIONAL">National</option>
          <option value="INTERNATIONAL">International</option>
        </>
      )}

      {formData.category === 'DIVERSE' && (
        <>
          <option value="CASE_LAW">Jurisprudence</option>
          <option value="OPINIONS">Opinions</option>
          <option value="OTHER">Autre</option>
        </>
      )}

      
    </select>
  </div>

  
)}
{/* Sub-subcategory for NATIONAL */}
{formData.subCategory === 'NATIONAL' && (
  <div>
    <Label>Pays</Label>
    <select
      className="border p-2 rounded w-full"
      value={formData.subSubCategory}
      onChange={(e) => setFormData({ ...formData, subSubCategory: e.target.value })}
      required
      disabled={isSubmitting}
    >
      <option value="">-- Sélectionner --</option>
      <option value="EMIRATES">Émirats</option>
      <option value="BAHRAIN">Bahreïn</option>
      <option value="SAUDI_ARABIA">Arabie Saoudite</option>
      <option value="OMAN">Oman</option>
      <option value="QATAR">Qatar</option>
      <option value="KUWAIT">Koweït</option>
    </select>
  </div>
)}

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
  <Label>Langue</Label>
  <select
    className="border p-2 rounded w-full"
    value={formData.language}
    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
    required
    disabled={isSubmitting}
  >
    <option value="ENGLISH">Anglais</option>
    <option value="FRENCH">Français</option>
    <option value="ARABIC">Arabe</option>
  </select>
</div>

          {/* Contenu uniquement pour articles & projets */}
          {selectedTab !== 'resources' && (
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
          )}
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
                accept={selectedTab === 'resources' ? '*' : 'image/*'}
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
                    if (selectedTab !== 'resources') {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setPreviewImage(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }
                }}
                required={selectedTab === 'resources'}
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
                  Création...
                </>
              ) : (
                'Créer'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDialog;
