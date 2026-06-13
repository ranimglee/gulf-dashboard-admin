import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

import {
  FileText,
  Loader2,
  PlusCircle,
  Search,
  Image,
  Upload,
  Layers,
} from 'lucide-react';

import { useToast } from '@/hooks/use-toast';

import CreateDialog from './CreateDialog';
import EditDialog from './EditDialog';
import ItemCard from './ItemCard';
import { ContentItem } from '../../../types/types';
import { handleDeleteItem } from '../../../utils/contentUtils';
import { api } from '@/lib/api';

const ContentManager: React.FC = () => {
  const { toast } = useToast();

  const [selectedTab, setSelectedTab] = useState('articles');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);

  const [resources, setResources] = useState<ContentItem[]>([]);
  const [articles, setArticles] = useState<ContentItem[]>([]);
  const [projects, setProjects] = useState<ContentItem[]>([]);
  const [articleToDelete, setArticleToDelete] = useState<ContentItem | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('ALL');

  const normalizeLanguage = (lang?: string) => {
    if (!lang) return 'ENGLISH';
    const l = lang.toLowerCase();
    if (l.startsWith('fr')) return 'FRENCH';
    if (l.startsWith('ar')) return 'ARABIC';
    return 'ENGLISH';
  };

  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`/articles`);

        const fetched = response.data.map((item: any) => ({
          id: item.id?.toString() || Date.now().toString(),
          title: item.title,
          description: item.description,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          status: item.status || 'draft',
          type: 'article',
          imageUrl: item.imageUrl || item.image || null,
          language: normalizeLanguage(item.language),
        }));

        setArticles(
          fetched.sort(
            (a, b) =>
              new Date(b.updatedAt ?? b.createdAt).getTime() -
              new Date(a.updatedAt ?? a.createdAt).getTime()
          )
        );
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
  }, [toast]);

  useEffect(() => {
    const fetchRes = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`/ressources`);

        const fetched = response.data.map((res: any) => ({
          id: res.id?.toString() || Date.now().toString(),
          title: res.titre,
          description: res.description,
          createdAt: res.createdAt,
          updatedAt: res.updatedAt,
          status: 'published',
          type: 'resource',
          category: res.category,
          subCategory: res.subCategory,
          subSubCategory: res.subSubCategory,
          fileType: res.fileType,
          language: normalizeLanguage(res.language),
        }));

        setResources(
          fetched.sort(
            (a, b) =>
              new Date(b.updatedAt ?? b.createdAt).getTime() -
              new Date(a.updatedAt ?? a.createdAt).getTime()
          )
        );
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

    fetchRes();
  }, [toast]);

  useEffect(() => {
    const fetchInitiatives = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`/initiatives/get-all-initiatives`);

        const fetched = response.data.map((res: any) => ({
          id: res.id?.toString() || Date.now().toString(),
          title: res.title,
          description: '',
          createdAt: res.createdAt,
          updatedAt: res.updatedAt,
          status: 'published',
          type: 'project',
          subTitle: res.subTitle,
          content: res.content,
          country: res.country,
          imageUrl: res.imageUrl || res.image || null,
          language: normalizeLanguage(res.language),
        }));

        setProjects(
          fetched.sort(
            (a, b) =>
              new Date(b.updatedAt ?? b.createdAt).getTime() -
              new Date(a.updatedAt ?? a.createdAt).getTime()
          )
        );
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
  }, [toast]);

  const getCurrentItems = () => {
    let items =
      selectedTab === 'articles'
        ? articles
        : selectedTab === 'projects'
        ? projects
        : resources;

    if (selectedLanguage !== 'ALL') {
      items = items.filter((item) => item.language === selectedLanguage);
    }

    if (searchTerm) {
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return items;
  };

  const currentItems = getCurrentItems();

  const stats = {
    articles: articles.length,
    projects: projects.length,
    resources: resources.length,
  };

  return (
    <div className="space-y-8">

      {/* HEADER (UserManager style) */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <h2 className="text-4xl font-bold text-[#1A535C] mb-2">
            Gestion du contenu
          </h2>

          <p className="text-gray-500">
            Articles, initiatives et ressources
          </p>
        </div>

        <div className="hidden md:flex items-center gap-2 bg-[#1A535C]/10 px-4 py-2 rounded-2xl">
          <Layers className="w-5 h-5 text-[#1A535C]" />
          <span className="text-sm font-medium text-[#1A535C]">
            Content Dashboard
          </span>
        </div>
      </div>

      {/* STATS (UserManager style upgrade) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        <Card className="border-0 shadow-lg rounded-3xl overflow-hidden">
          <CardContent className="p-6 relative">
            <div className="absolute top-0 right-0 w-28 h-28 bg-[#1A535C]/5 rounded-full blur-2xl" />
            <div className="flex justify-between relative z-10">
              <div>
                <p className="text-sm text-gray-500">Articles</p>
                <h3 className="text-4xl font-bold text-[#1A535C]">
                  {stats.articles}
                </h3>
              </div>
              <FileText className="w-10 h-10 text-[#1A535C]/70" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg rounded-3xl overflow-hidden">
          <CardContent className="p-6 relative">
            <div className="absolute top-0 right-0 w-28 h-28 bg-green-100 rounded-full blur-2xl" />
            <div className="flex justify-between relative z-10">
              <div>
                <p className="text-sm text-gray-500">Initiatives</p>
                <h3 className="text-4xl font-bold text-green-600">
                  {stats.projects}
                </h3>
              </div>
              <Image className="w-10 h-10 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg rounded-3xl overflow-hidden">
          <CardContent className="p-6 relative">
            <div className="absolute top-0 right-0 w-28 h-28 bg-yellow-100 rounded-full blur-2xl" />
            <div className="flex justify-between relative z-10">
              <div>
                <p className="text-sm text-gray-500">Ressources</p>
                <h3 className="text-4xl font-bold text-yellow-600">
                  {stats.resources}
                </h3>
              </div>
              <Upload className="w-10 h-10 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SEARCH BAR (UserManager style card) */}
      <Card className="border-0 shadow-lg rounded-3xl">
        <CardContent className="p-5 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">

          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Rechercher du contenu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11 rounded-2xl"
            />
          </div>

          <select
            className="border rounded-2xl px-3 py-2 text-sm"
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
          >
            <option value="ALL">Toutes les langues</option>
            <option value="ENGLISH">Anglais</option>
            <option value="FRENCH">Français</option>
            <option value="ARABIC">Arabe</option>
          </select>

          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-[#F7B32B] text-black rounded-2xl"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Ajouter
          </Button>

        </CardContent>
      </Card>

      {/* TABS */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>

        <TabsList className="grid grid-cols-3 bg-white shadow-lg rounded-3xl p-1">

          <TabsTrigger value="articles">Articles</TabsTrigger>
          <TabsTrigger value="projects">Initiatives</TabsTrigger>
          <TabsTrigger value="resources">Ressources</TabsTrigger>

        </TabsList>

        <TabsContent value={selectedTab} className="mt-6">

          {isLoading ? (
            <div className="flex flex-col items-center py-16">
              <Loader2 className="w-10 h-10 animate-spin text-[#1A535C]" />
              <p className="text-gray-500 mt-3">Chargement...</p>
            </div>
          ) : currentItems.length === 0 ? (
            <Card className="border-dashed border-2 rounded-3xl">
              <CardContent className="py-14 text-center">
                <FileText className="w-12 h-12 mx-auto text-[#1A535C]" />
                <p className="mt-3 text-gray-500">Aucun contenu trouvé</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              {currentItems.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  setArticleToDelete={setArticleToDelete}
                  setEditingItem={setEditingItem}
                  setIsEditDialogOpen={setIsEditDialogOpen}
                />
              ))}
            </div>
          )}

        </TabsContent>
      </Tabs>

      {/* DIALOGS (unchanged logic) */}
      <CreateDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        selectedTab={selectedTab}
        setResources={setResources}
        setProjects={setProjects}
        setArticles={setArticles}
        resources={resources}
        projects={projects}
        articles={articles}
        setIsCreateDialogOpen={setIsCreateDialogOpen}
        toast={toast}
      />

      <EditDialog
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setEditingItem(null);
        }}
        itemId={editingItem?.id || null}
        type={
          selectedTab === 'articles'
            ? 'article'
            : selectedTab === 'projects'
            ? 'project'
            : 'resource'
        }
        setArticles={setArticles}
        setProjects={setProjects}
        setResources={setResources}
        articles={articles}
        projects={projects}
        resources={resources}
        toast={toast}
      />

      <Dialog open={!!articleToDelete} onOpenChange={() => setArticleToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Supprimer "{articleToDelete?.title}" ?
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setArticleToDelete(null)}>
              Annuler
            </Button>
            <Button
              className="bg-red-600 text-white"
              onClick={() => {
                if (articleToDelete) {
                  handleDeleteItem(
                    articleToDelete,
                    setArticles,
                    setResources,
                    setProjects,
                    articles,
                    resources,
                    projects,
                    toast
                  );
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