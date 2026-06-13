import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Globe, Loader2 } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { handleCreateItem } from '../../../utils/contentUtils';
import { ContentItem, ToastFunction } from '../../../types/types';

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    [{ font: [] }], // NEW: font family
    [{ size: ['small', false, 'large', 'huge'] }],

    ['bold', 'italic', 'underline', 'strike'],

    [{ color: [] }, { background: [] }],

    [{ script: 'sub' }, { script: 'super' }], // NEW: sub/sup

    [{ align: [] }],

    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ indent: '-1' }, { indent: '+1' }], // NEW: indentation

    ['blockquote', 'code-block'], // NEW: richer writing tools

    ['link', 'image'], // NEW: media support

    ['clean'],
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
      subCategory: '',
      subSubCategory: '',
      fileType: 'PDF',
      subTitle: '',
      country: '',
      language: 'ENGLISH',
    });

    setPreviewImage(null);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
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
            subCategory: '',
            subSubCategory: '',
            fileType: 'PDF',
            subTitle: '',
            country: '',
            language: 'ENGLISH',
          });
          setPreviewImage(null);
        }
      }}
    >
      <DialogContent className="sm:max-w-[850px] max-h-[90vh] overflow-y-auto rounded-2xl">
        
        {/* HEADER */}
        <DialogHeader className="space-y-2 pb-4 border-b">
          <DialogTitle className="text-[#1A535C] text-xl font-semibold">
            Créer un nouveau {selectedTab.slice(0, -1)}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Remplissez les informations ci-dessous pour ajouter un nouveau contenu.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">

          {/* BASIC INFO */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Informations générales
            </h3>

            <div>
              <Label>Titre</Label>
              <Input
                className="mt-1"
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
                  className="mt-1"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  disabled={isSubmitting}
                />
              </div>
            )}
          </div>

          {/* ARTICLES */}
          {selectedTab === 'articles' && (
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-sm font-semibold text-gray-700 uppercase">
                Article
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Auteur</Label>
                  <Input
                    className="mt-1"
                    value={formData.auteur}
                    onChange={(e) => setFormData({ ...formData, auteur: e.target.value })}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <Label>Type</Label>
                  <select
                    className="mt-1 border p-2 rounded-lg w-full focus:ring-2 focus:ring-[#1A535C]/30"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
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
              </div>
            </div>
          )}

          {/* PROJECTS */}
          {selectedTab === 'projects' && (
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-sm font-semibold text-gray-700 uppercase">
                Projet
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Sous-titre</Label>
                  <Input
                    className="mt-1"
                    value={formData.subTitle}
                    onChange={(e) => setFormData({ ...formData, subTitle: e.target.value })}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <Label>Pays</Label>
                  <Input
                    className="mt-1"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>
          )}

          {/* RESOURCES */}
          {selectedTab === 'resources' && (
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-sm font-semibold text-gray-700 uppercase">
                Ressources
              </h3>

              <div className="grid md:grid-cols-2 gap-4">

                {/* CATEGORY */}
                <div>
                  <Label>Catégorie</Label>
                  <select
                    className="mt-1 border p-2 rounded-lg w-full"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value, subCategory: '' })
                    }
                    required
                    disabled={isSubmitting}
                  >
                    <option value="LEGAL">Juridique</option>
                    <option value="DATA">Données</option>
                    <option value="DIVERSE">Divers</option>
                    <option value="STUDIES">Études</option>
                  </select>
                </div>

                {/* FILE TYPE */}
                <div>
                  <Label>Type de fichier</Label>
                  <select
                    className="mt-1 border p-2 rounded-lg w-full"
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
              </div>

              {/* SUBCATEGORY */}
              {['LEGAL', 'DIVERSE'].includes(formData.category) && (
                <div>
                  <Label>Sous-catégorie</Label>
                  <select
                    className="mt-1 border p-2 rounded-lg w-full"
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

              {/* COUNTRY SUBCATEGORY */}
              {formData.subCategory === 'NATIONAL' && (
                <div>
                  <Label>Pays</Label>
                  <select
                    className="mt-1 border p-2 rounded-lg w-full"
                    value={formData.subSubCategory}
                    onChange={(e) =>
                      setFormData({ ...formData, subSubCategory: e.target.value })
                    }
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
            </div>
          )}

  {/* LANGUAGE */}
<div className="space-y-2">
  <Label className="text-sm font-medium text-gray-700">
    Langue
  </Label>

  <div className="relative">
    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />

    <select
      className="
        w-full
        appearance-none
        border border-gray-200
        bg-white
        pl-10 pr-10
        py-2.5
        rounded-xl
        text-sm
        text-gray-700
        shadow-sm
        transition
        focus:outline-none
        focus:ring-2
        focus:ring-[#1A535C]
        focus:border-[#1A535C]
        disabled:opacity-60
        disabled:cursor-not-allowed
      "
      value={formData.language}
      onChange={(e) =>
        setFormData({ ...formData, language: e.target.value })
      }
      required
      disabled={isSubmitting}
    >
      <option value="ENGLISH">🇬🇧 Anglais</option>
      <option value="FRENCH">🇫🇷 Français</option>
      <option value="ARABIC">🇸🇦 Arabe</option>
    </select>

    {/* dropdown arrow */}
    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
      <svg
        className="w-4 h-4 text-gray-400"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </div>
  </div>

  <p className="text-xs text-gray-400">
    Choisissez la langue du contenu
  </p>
</div>

{/* CONTENT - PRO EDITOR */}
<div className="space-y-3">

  {/* Header */}
  <div className="flex items-center justify-between">
    <Label className="text-sm font-semibold text-gray-700">
      Contenu
    </Label>

    <div className="text-xs text-gray-400 flex gap-2">
      <span>Ctrl+B</span>
      <span>•</span>
      <span>Ctrl+I</span>
      <span>•</span>
      <span>Ctrl+K link</span>
    </div>
  </div>

  {/* Editor Card */}
  <div
    className="
      rounded-2xl border bg-white shadow-sm
      transition-all duration-200
      focus-within:ring-2 focus-within:ring-[#1A535C]/30
      focus-within:border-[#1A535C]
    "
    onClick={() => {
      // force focus into editor
      const el = document.querySelector('.ql-editor') as HTMLElement;
      el?.focus();
    }}
  >

    {/* Top bar */}
    <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b text-xs text-gray-500">
      <span>📝 Éditeur avancé</span>
      <span>
        {formData.contenu?.replace(/<[^>]*>/g, '').length || 0} chars
      </span>
    </div>

    {/* IMPORTANT FIX WRAPPER */}
    <div className="quill-wrapper min-h-[260px]">
      <ReactQuill
        theme="snow"
        value={formData.contenu}
        onChange={(value) =>
          setFormData({ ...formData, contenu: value })
        }
        modules={modules}
        formats={[
          'header', 'font', 'size',
          'bold', 'italic', 'underline', 'strike',
          'color', 'background',
          'script',
          'align',
          'list', 'bullet', 'indent',
          'blockquote', 'code-block',
          'link', 'image'
        ]}
        readOnly={isSubmitting}
      />
    </div>
  </div>

  {/* Footer */}
  <div className="flex justify-between text-xs text-gray-400">
    <span>Éditeur riche moderne</span>
    <span>Auto-format enabled</span>
  </div>
</div>

        {/* FILE UPLOAD - MODERN UI */}
<div className="space-y-3">
  <Label>
    Fichier {selectedTab === 'resources' ? '(obligatoire)' : '(optionnel)'}
  </Label>

  {/* Preview */}
  {previewImage && (
    <div className="relative group">
      <div className="rounded-2xl overflow-hidden border bg-gray-50 shadow-sm">
        <img
          src={previewImage}
          className="w-full h-48 object-cover transition-transform group-hover:scale-[1.02]"
        />
      </div>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="absolute top-3 right-3 bg-white/90 backdrop-blur rounded-full shadow hover:bg-white"
        onClick={() => setPreviewImage(null)}
      >
        ✕
      </Button>
    </div>
  )}

  {/* Upload zone */}
  <div className="relative">
    <label
      className={`
        flex flex-col items-center justify-center gap-2
        border-2 border-dashed rounded-2xl p-6
        cursor-pointer transition-all duration-200
        bg-gradient-to-b from-gray-50 to-white
        hover:border-[#1A535C] hover:shadow-md
        ${isSubmitting ? 'opacity-50 pointer-events-none' : ''}
      `}
    >
      <input
        type="file"
        accept={selectedTab === 'resources' ? '*' : 'image/*'}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;

          if (file.size > 50 * 1024 * 1024) {
            toast({
              title: 'Fichier trop volumineux',
              description: 'Max 50 Mo',
              variant: 'destructive',
            });
            return;
          }

          setFormData({ ...formData, file });

          if (selectedTab !== 'resources') {
            const reader = new FileReader();
            reader.onloadend = () =>
              setPreviewImage(reader.result as string);
            reader.readAsDataURL(file);
          }
        }}
        required={selectedTab === 'resources'}
        disabled={isSubmitting}
      />

      {/* Icon */}
      <div className="w-12 h-12 rounded-full bg-[#1A535C]/10 flex items-center justify-center">
        📁
      </div>

      {/* Text */}
      <div className="text-center">
        <p className="text-sm font-medium text-gray-700">
          Glissez-déposez ou cliquez pour importer
        </p>
        <p className="text-xs text-gray-400 mt-1">
          PNG, JPG, PDF, DOCX jusqu’à 50MB
        </p>
      </div>
    </label>
  </div>
</div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Annuler
            </Button>

            <Button
              type="submit"
              className="bg-[#1A535C] hover:bg-[#14424a] text-white min-w-[120px]"
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