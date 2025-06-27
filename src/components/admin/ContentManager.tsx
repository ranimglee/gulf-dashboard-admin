
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { PlusCircle, Edit, Trash2, Upload, FileText, Image, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ContentItem {
  id: string;
  title: string;
  description: string;
  date: string;
  status: 'published' | 'draft';
  type: 'article' | 'project' | 'resource';
}

const ContentManager = () => {
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState('articles');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);

  // Sample data
  const [articles, setArticles] = useState<ContentItem[]>([
    {
      id: '1',
      title: 'Innovation technologique au Koweït',
      description: 'Article sur les dernières innovations technologiques dans la région du Golfe.',
      date: '2024-03-15',
      status: 'published',
      type: 'article'
    },
    {
      id: '2',
      title: 'Développement durable au Moyen-Orient',
      description: 'Analyse des initiatives de développement durable dans la région.',
      date: '2024-03-10',
      status: 'draft',
      type: 'article'
    }
  ]);

  const [projects, setProjects] = useState<ContentItem[]>([
    {
      id: '3',
      title: 'Centre de recherche AFAK',
      description: 'Projet de création d\'un centre de recherche multidisciplinaire.',
      date: '2024-03-12',
      status: 'published',
      type: 'project'
    }
  ]);

  const [resources, setResources] = useState<ContentItem[]>([
    {
      id: '4',
      title: 'Guide des technologies émergentes',
      description: 'Document PDF complet sur les technologies émergentes.',
      date: '2024-03-08',
      status: 'published',
      type: 'resource'
    }
  ]);

  const handleCreateItem = (formData: any) => {
    const newItem: ContentItem = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      date: new Date().toISOString().split('T')[0],
      status: 'draft',
      type: selectedTab.slice(0, -1) as 'article' | 'project' | 'resource'
    };

    if (selectedTab === 'articles') {
      setArticles([...articles, newItem]);
    } else if (selectedTab === 'projects') {
      setProjects([...projects, newItem]);
    } else if (selectedTab === 'resources') {
      setResources([...resources, newItem]);
    }

    setIsCreateDialogOpen(false);
    toast({
      title: "Contenu créé",
      description: `${newItem.type} "${newItem.title}" a été créé avec succès.`,
    });
  };

  const handleDeleteItem = (id: string) => {
    if (selectedTab === 'articles') {
      setArticles(articles.filter(item => item.id !== id));
    } else if (selectedTab === 'projects') {
      setProjects(projects.filter(item => item.id !== id));
    } else if (selectedTab === 'resources') {
      setResources(resources.filter(item => item.id !== id));
    }

    toast({
      title: "Contenu supprimé",
      description: "Le contenu a été supprimé avec succès.",
    });
  };

  const getCurrentItems = () => {
    if (selectedTab === 'articles') return articles;
    if (selectedTab === 'projects') return projects;
    if (selectedTab === 'resources') return resources;
    return [];
  };

  const CreateDialog = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const [formData, setFormData] = useState({ title: '', description: '', file: null });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      handleCreateItem(formData);
      setFormData({ title: '', description: '', file: null });
    };

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-[#1A535C]">
              Créer un nouveau {selectedTab.slice(0, -1)}
            </DialogTitle>
            <DialogDescription className="text-[#333333]">
              Ajoutez un nouveau contenu à votre site web.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-[#333333]">Titre</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Entrez le titre..."
                required
                className="border-[#E5E7EB] focus:border-[#1A535C]"
              />
            </div>
            <div>
              <Label htmlFor="description" className="text-[#333333]">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Entrez la description..."
                rows={4}
                required
                className="border-[#E5E7EB] focus:border-[#1A535C]"
              />
            </div>
            {selectedTab === 'resources' && (
              <div>
                <Label htmlFor="file" className="text-[#333333]">Fichier PDF</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
                  className="border-[#E5E7EB] focus:border-[#1A535C]"
                />
              </div>
            )}
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button 
                type="submit" 
                className="bg-[#1A535C] hover:bg-[#1A535C]/90 text-white"
              >
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
          <p className="text-[#333333]">Gérer vos articles, projets et ressources</p>
        </div>
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="bg-[#F7B32B] hover:bg-[#F7B32B]/90 text-[#333333]"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Ajouter du contenu
        </Button>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3 bg-[#F4E1D2]">
          <TabsTrigger 
            value="articles" 
            className="data-[state=active]:bg-[#1A535C] data-[state=active]:text-white"
          >
            <FileText className="h-4 w-4 mr-2" />
            Articles
          </TabsTrigger>
          <TabsTrigger 
            value="projects"
            className="data-[state=active]:bg-[#1A535C] data-[state=active]:text-white"
          >
            <Image className="h-4 w-4 mr-2" />
            Projets
          </TabsTrigger>
          <TabsTrigger 
            value="resources"
            className="data-[state=active]:bg-[#1A535C] data-[state=active]:text-white"
          >
            <Upload className="h-4 w-4 mr-2" />
            Ressources
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-4">
          <div className="grid gap-4">
            {getCurrentItems().map((item) => (
              <Card key={item.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-[#1A535C] text-lg">{item.title}</CardTitle>
                      <CardDescription className="text-[#333333] mt-1">
                        {item.description}
                      </CardDescription>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingItem(item)}
                        className="border-[#E5E7EB] hover:bg-[#F4E1D2]"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteItem(item.id)}
                        className="border-[#FF6F61] text-[#FF6F61] hover:bg-[#FF6F61] hover:text-white"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-[#333333]">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {item.date}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        item.status === 'published' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.status === 'published' ? 'Publié' : 'Brouillon'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {getCurrentItems().length === 0 && (
            <Card className="bg-[#F4E1D2] border-dashed border-2 border-[#E5E7EB]">
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
          )}
        </TabsContent>
      </Tabs>

      <CreateDialog isOpen={isCreateDialogOpen} onClose={() => setIsCreateDialogOpen(false)} />
    </div>
  );
};

export default ContentManager;
