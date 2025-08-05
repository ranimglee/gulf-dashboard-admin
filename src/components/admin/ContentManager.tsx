import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogContent } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Edit, Trash2, Upload, FileText, Image, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';

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

interface ContentItem {
  id: string;
  title: string;
  description: string;
  date: string;
  status: 'published' | 'draft';
  type: 'article' | 'project' | 'resource';
  category?: string;
  fileType?: string;
  subTitle?: string; // Added for initiatives
  country?: string; // Added for initiatives
}

const ContentManager = () => {
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState('articles');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [resources, setResources] = useState<ContentItem[]>([]);
  const [articles, setArticles] = useState<ContentItem[]>([]);
  const [projects, setProjects] = useState<ContentItem[]>([]);
  const [articleToDelete, setArticleToDelete] = useState<ContentItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const typeLabels: Record<string, string> = {
    BLOG: 'Blog',
    NEWS: 'Actualité',
    TUTORIAL: 'Tutoriel',
    OPINION: 'Opinion',
    REVIEW: 'Critique',
  };

  // Fetch Articles
  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('https://blog-m2jm.onrender.com/api/articles');
        const fetchedArticles = response.data.map((item: any) => ({
          id: item.id?.toString() || Date.now().toString(),
          title: item.title,
          description: item.description,
          date: item.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0],
          status: item.status || 'draft',
          type: 'article',
        }));
        setArticles(fetchedArticles);
      } catch (error: any) {
        toast({
          title: 'Erreur de chargement',
          description: error.response?.data?.message || 'Impossible de récupérer les articles.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticles();
  }, []);

  // Fetch Resources
  useEffect(() => {
    const fetchResources = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('https://blog-m2jm.onrender.com/api/ressources');
        const data = response.data;
        const mapped = data.map((res: any) => ({
          id: res.id?.toString() || Date.now().toString(),
          title: res.titre,
          description: res.description,
          date: res.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0],
          status: 'published',
          type: 'resource',
          category: res.category,
          fileType: res.fileType,
        }));
        setResources(mapped);
      } catch (error: any) {
        toast({
          title: 'Erreur de chargement',
          description: error.response?.data?.message || 'Impossible de récupérer les ressources.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchResources();
  }, []);

  // Fetch Initiatives (Projects)
  useEffect(() => {
    const fetchInitiatives = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('https://blog-m2jm.onrender.com/api/initiatives/get-all-initiatives');
        const data = response.data;
        const mapped = data.map((res: any) => ({
          id: res.id?.toString() || Date.now().toString(),
          title: res.title,
          description: res.subTitle,
          date: res.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0],
          status: 'published',
          type: 'project',
          subTitle: res.subTitle,
          country: res.country,
        }));
        setProjects(mapped);
      } catch (error: any) {
        toast({
          title: 'Erreur de chargement',
          description: error.response?.data?.message || 'Impossible de récupérer les initiatives.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitiatives();
  }, []);

  const handleCreateItem = async (data: any) => {
    const date = new Date().toISOString().split('T')[0];

    if (selectedTab === 'resources') {
      if (!data.title || !data.description || !data.fileType || !data.category || !data.file) {
        toast({
          title: 'Champs requis',
          description: 'Veuillez remplir tous les champs obligatoires (titre, description, catégorie, type de fichier, fichier).',
          variant: 'destructive',
        });
        return;
      }

      try {
        const formData = new FormData();
        formData.append('file', data.file);
        formData.append('titre', data.title);
        formData.append('description', data.description);
        formData.append('category', data.category);
        formData.append('fileType', data.fileType);

        const response = await axios.post('https://blog-m2jm.onrender.com/api/ressources/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        const created = response.data;
        const newItem: ContentItem = {
          id: created.id?.toString() || Date.now().toString(),
          title: created.titre,
          description: created.description,
          date: created.createdAt?.split('T')[0] || date,
          status: 'published',
          type: 'resource',
          category: created.category,
          fileType: created.fileType,
        };

        setResources([...resources, newItem]);
        toast({ title: 'Ressource ajoutée', description: `"${created.titre}" a été ajoutée.` });
        setIsCreateDialogOpen(false);
      } catch (err: any) {
        toast({
          title: 'Erreur',
          description: err.response?.data?.message || "Erreur lors de l'upload de la ressource.",
          variant: 'destructive',
        });
      }
      return;
    }

    if (selectedTab === 'projects') {
      if (!data.title || !data.subTitle || !data.content || !data.country) {
        toast({
          title: 'Champs requis',
          description: 'Veuillez remplir tous les champs obligatoires (titre, sous-titre, contenu, pays).',
          variant: 'destructive',
        });
        return;
      }

      try {
        let imageUrl = '';
        if (data.file) {
          const imageData = new FormData();
          imageData.append('file', data.file);
          const uploadResponse = await axios.post('https://blog-m2jm.onrender.com/api/initiatives/upload-image-initiative', imageData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          imageUrl = uploadResponse.data.imageUrl;
        }

        const response = await axios.post('https://blog-m2jm.onrender.com/api/initiatives/create-new-initiative', {
          title: data.title,
          subTitle: data.subTitle,
          content: data.content,
          country: data.country,
          imageUrl,
        });

        const created = response.data;
        setProjects([
          ...projects,
          {
            id: created.id?.toString() || Date.now().toString(),
            title: created.title,
            description: created.subTitle,
            date,
            status: 'published',
            type: 'project',
            subTitle: created.subTitle,
            country: created.country,
          },
        ]);

        toast({ title: 'Initiative publiée', description: `"${created.title}" a été publiée.` });
        setIsCreateDialogOpen(false);
      } catch (err: any) {
        toast({
          title: 'Erreur',
          description: err.response?.data?.message || 'Erreur inconnue',
          variant: 'destructive',
        });
      }
      return;
    }

    // Handle Articles
    if (!data.title || !data.description || !data.auteur || !data.type || !data.contenu) {
      toast({
        title: 'Champs requis',
        description: 'Veuillez remplir tous les champs obligatoires (titre, description, auteur, type, contenu).',
        variant: 'destructive',
      });
      return;
    }

    try {
      let imageUrl = '';
      if (data.file) {
        const imageData = new FormData();
        imageData.append('file', data.file);
        const uploadResponse = await axios.post('https://blog-m2jm.onrender.com/api/articles/upload-image', imageData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        imageUrl = uploadResponse.data.imageUrl;
      }

      const response = await axios.post('https://blog-m2jm.onrender.com/api/articles', {
        title: data.title,
        description: data.description,
        auteur: data.auteur,
        type: data.type,
        contenu: data.contenu,
        imageUrl,
      });

      const created = response.data;
      setArticles([
        ...articles,
        {
          id: created.id?.toString() || Date.now().toString(),
          title: created.title,
          description: created.description,
          date,
          status: created.status || 'draft',
          type: 'article',
        },
      ]);

      toast({ title: 'Article publié', description: `"${created.title}" a été publié.` });
      setIsCreateDialogOpen(false);
    } catch (err: any) {
      toast({
        title: 'Erreur',
        description: err.response?.data?.message || 'Erreur inconnue',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteItem = async (item: ContentItem) => {
    try {
      if (item.type === 'article') {
        await axios.delete(`https://blog-m2jm.onrender.com/api/articles/${item.id}`);
        setArticles(articles.filter((a) => a.id !== item.id));
      } else if (item.type === 'resource') {
        await axios.delete(`https://blog-m2jm.onrender.com/api/ressources/${item.id}`);
        setResources(resources.filter((r) => r.id !== item.id));
      } else if (item.type === 'project') {
        await axios.delete(`https://blog-m2jm.onrender.com/api/initiatives/delete-initiative/${item.id}`);
        setProjects(projects.filter((p) => p.id !== item.id));
      }
      toast({ title: 'Supprimé', description: `"${item.title}" a été supprimé.` });
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.response?.data?.message || 'Échec de la suppression.',
        variant: 'destructive',
      });
    }
  };

  const getCurrentItems = () => {
    return selectedTab === 'articles' ? articles : selectedTab === 'projects' ? projects : resources;
  };

  const CreateDialog = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const [formData, setFormData] = useState({
      title: '',
      description: '',
      auteur: '',
      type: 'BLOG',
      contenu: '',
      file: null as File | null,
      category: 'FINANCE',
      fileType: 'PDF',
      subTitle: '',
      country: '',
      content: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      handleCreateItem(formData);
      // Reset form after submission
      setFormData({
        title: '',
        description: '',
        auteur: '',
        type: 'BLOG',
        contenu: '',
        file: null,
        category: 'FINANCE',
        fileType: 'PDF',
        subTitle: '',
        country: '',
        content: '',
      });
    };

    return (
      <Dialog open={isOpen} onOpenChange={(open) => {
        if (!open) {
          onClose();
          // Reset form when dialog closes
          setFormData({
            title: '',
            description: '',
            auteur: '',
            type: 'BLOG',
            contenu: '',
            file: null,
            category: 'FINANCE',
            fileType: 'PDF',
            subTitle: '',
            country: '',
            content: '',
          });
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
              />
            </div>
            {selectedTab !== 'projects' && (
              <div>
                <Label>Description</Label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
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
                  />
                </div>
                <div>
                  <Label>Type</Label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="border p-2 rounded w-full"
                    required
                  >
                    <option value="BLOG">Blog</option>
                    <option value="NEWS">News</option>
                    <option value="TUTORIAL">Tutorial</option>
                    <option value="OPINION">Opinion</option>
                    <option value="REVIEW">Review</option>
                  </select>
                </div>
                <div>
                  <Label>Contenu</Label>
                 <ReactQuill
  theme="snow"
  value={formData.contenu}
  onChange={(value) => setFormData({ ...formData, contenu: value })}
  modules={modules}
  formats={formats}
/>
                </div>
                <div>
                  <Label>Image (optionnel)</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
                  />
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
                  />
                </div>
    

                <div>
                  <Label>Contenu</Label>
                 <ReactQuill
  theme="snow"
  value={formData.contenu}
  onChange={(value) => setFormData({ ...formData, contenu: value })}
  modules={modules}
  formats={formats}
/>

                </div>
                <div>
                  <Label>Pays</Label>
                  <Input
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>Image (optionnel)</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
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
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
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
                  >
                    <option value="PDF">PDF</option>
                    <option value="VIDEO">Vidéo</option>
                    <option value="EXCEL">Excel</option>
                    <option value="DOC">Document Word</option>
                    <option value="IMAGE">Image</option>
                  </select>
                </div>
                <div>
                  <Label>Fichier</Label>
                 <Input
  type="file"
  onChange={(e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) { // 50MB
        toast({
          title: 'Fichier trop volumineux',
          description: 'La taille maximale autorisée est de 50 Mo.',
          variant: 'destructive',
        });
        e.target.value = ''; // Reset file input
        return;
      }
      setFormData({ ...formData, file });
    }
  }}
  required
/>

                </div>
              </>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit" className="bg-[#1A535C] text-white hover:bg-[#1A535C]/90">
                Créer
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#1A535C]">Gestion du Contenu</h2>
          <p>Gérez vos articles, projets et ressources</p>
        </div>
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="bg-[#F7B32B] text-[#333] hover:bg-[#F7B32B]/90"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Ajouter du contenu
        </Button>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid grid-cols-3 bg-[#F4E1D2] w-full">
          <TabsTrigger
            value="articles"
            className="data-[state=active]:bg-[#1A535C] data-[state=active]:text-white"
          >
            <FileText className="w-4 h-4 mr-1" /> Articles
          </TabsTrigger>
          <TabsTrigger
            value="projects"
            className="data-[state=active]:bg-[#1A535C] data-[state=active]:text-white"
          >
            <Image className="w-4 h-4 mr-1" /> Projets
          </TabsTrigger>
          <TabsTrigger
            value="resources"
            className="data-[state=active]:bg-[#1A535C] data-[state=active]:text-white"
          >
            <Upload className="w-4 h-4 mr-1" /> Ressources
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab}>
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-[#1A535C]">Chargement des données...</p>
            </div>
          ) : getCurrentItems().length === 0 ? (
            <Card className="bg-[#F4E1D2] border-2 border-dashed border-[#E5E7EB]">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-[#1A535C] mb-4" />
                <h3 className="text-lg font-semibold text-[#1A535C] mb-2">
                  Aucun contenu disponible
                </h3>
                <p className="text-[#333333] text-center mb-4">
                  Commencez par créer votre premier {selectedTab.slice(0, -1)}.
                </p>
                <Button
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="bg-[#F7B32B] hover:bg-[#F7B32B]/90 text-[#333333]"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Créer maintenant
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {getCurrentItems().map((item) => (
                <Card key={item.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle>{item.title}</CardTitle>
                        <CardDescription>{item.description}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-300 hover:bg-red-100"
                          onClick={() => setArticleToDelete(item)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="text-sm text-gray-700">
                    <div className="flex justify-between">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {item.date}
                        </span>
                        {item.type === 'resource' && (
                          <>
                            <span>Catégorie: {item.category}</span>
                            <span>Type: {item.fileType}</span>
                          </>
                        )}
                        {item.type === 'project' && (
                          <>
                            <span>Pays: {item.country}</span>
                            <span>Sous-titre: {item.subTitle}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <CreateDialog isOpen={isCreateDialogOpen} onClose={() => setIsCreateDialogOpen(false)} />

      <Dialog open={!!articleToDelete} onOpenChange={() => setArticleToDelete(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer "{articleToDelete?.title}" ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setArticleToDelete(null)}>
              Annuler
            </Button>
            <Button
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={() => {
                if (articleToDelete) {
                  handleDeleteItem(articleToDelete);
                  setArticleToDelete(null);
                }
              }}
            >
              Supprimer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContentManager;