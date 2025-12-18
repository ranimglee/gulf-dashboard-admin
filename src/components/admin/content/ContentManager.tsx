import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { FileText, Loader2, PlusCircle, Search, Image, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import CreateDialog from './CreateDialog';
import EditDialog from './EditDialog';
import ItemCard from './ItemCard';
import { ContentItem } from '../../../types/types';
import { handleDeleteItem } from '../../../utils/contentUtils';
import { API_BASE_URL } from '@/lib/api';

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

  // 🔹 Normalize language (fallback ENGLISH)
  const normalizeLanguage = (lang: string | undefined): string => {
    if (!lang) return 'ENGLISH';
    const l = lang.toLowerCase();
    if (l.startsWith('fr')) return 'FRENCH';
    if (l.startsWith('ar')) return 'ARABIC';
    return 'ENGLISH';
  };

  // Fetch Articles
  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/articles`);
        const fetchedArticles = response.data.map((item: any) => ({
          id: item.id?.toString() || Date.now().toString(),
          title: item.title,
          description: item.description,
          date: item.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0],
          status: item.status || 'draft',
          type: 'article',
          imageUrl: item.imageUrl || item.image || null,
          language: normalizeLanguage(item.language),
        }));
        setArticles(fetchedArticles.sort((a, b) => b.date.localeCompare(a.date)));
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

  // Fetch Resources
  useEffect(() => {
    const fetchRes = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/ressources`);
        const fetchedResources = response.data.map((res: any) => ({
          id: res.id?.toString() || Date.now().toString(),
          title: res.titre,
          description: res.description,
          date: res.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0],
          status: 'published',
          type: 'resource',
          category: res.category,
          fileType: res.fileType,
          language: normalizeLanguage(res.language),
        }));
        setResources(fetchedResources.sort((a, b) => b.date.localeCompare(a.date)));
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

  // Fetch Initiatives
  useEffect(() => {
    const fetchInitiatives = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/initiatives/get-all-initiatives`);
        const fetchedInitiatives = response.data.map((res: any) => ({
          id: res.id?.toString() || Date.now().toString(),
          title: res.title,
          description: res.subTitle,
          date: res.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0],
          status: 'published',
          type: 'project',
          subTitle: res.subTitle,
          country: res.country,
          imageUrl: res.imageUrl || res.image || null,
          language: normalizeLanguage(res.language),
        }));
        setProjects(fetchedInitiatives.sort((a, b) => b.date.localeCompare(a.date)));
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

  // Current items with filters
  const getCurrentItems = () => {
    let items = selectedTab === 'articles' ? articles : selectedTab === 'projects' ? projects : resources;

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1A535C]">Gestion du Contenu</h2>
          <p className="text-gray-600">Gérez vos articles, initiatives et ressources</p>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-64"
            />
          </div>

          {/* Language Filter */}
          <select
            className="border rounded-lg px-3 py-2 text-sm"
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
          >
            <option value="ALL">Toutes les langues</option>
            <option value="ENGLISH">Anglais</option>
            <option value="FRENCH">Français</option>
            <option value="ARABIC">Arabe</option>
          </select>

          {/* Add button */}
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-[#F7B32B] text-[#333] hover:bg-[#F7B32B]/90 whitespace-nowrap"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Ajouter
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid grid-cols-3 bg-[#F4E1D2] w-full">
          <TabsTrigger value="articles" className="data-[state=active]:bg-[#1A535C] data-[state=active]:text-white">
            <FileText className="w-4 h-4 mr-1" /> Articles
          </TabsTrigger>
          <TabsTrigger value="projects" className="data-[state=active]:bg-[#1A535C] data-[state=active]:text-white">
            <Image className="w-4 h-4 mr-1" /> Initiatives
          </TabsTrigger>
          <TabsTrigger value="resources" className="data-[state=active]:bg-[#1A535C] data-[state=active]:text-white">
            <Upload className="w-4 h-4 mr-1" /> Ressources
          </TabsTrigger>
        </TabsList>

        {/* Tab content */}
        <TabsContent value={selectedTab}>
          {isLoading ? (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#1A535C] mx-auto" />
              <p className="text-[#1A535C] mt-2">Chargement des données...</p>
            </div>
          ) : getCurrentItems().length === 0 ? (
            <Card className="bg-[#F4E1D2] border-2 border-dashed border-[#E5E7EB]">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-[#1A535C] mb-4" />
                <h3 className="text-lg font-semibold text-[#1A535C] mb-2">Aucun contenu disponible</h3>
                <p className="text-[#333333] text-center mb-4">
                  {searchTerm
                    ? `Aucun résultat pour "${searchTerm}"`
                    : `Commencez par créer votre premier ${selectedTab.slice(0, -1)}.`}
                </p>
                {!searchTerm && (
                  <Button
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="bg-[#F7B32B] hover:bg-[#F7B32B]/90 text-[#333333] transition"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Créer maintenant
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {getCurrentItems().map((item) => (
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

      {/* Dialogs */}
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
        item={editingItem}
        setArticles={setArticles}
        setProjects={setProjects}
        setResources={setResources}
        articles={articles}
        projects={projects}
        resources={resources}
        toast={toast}
      />

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
