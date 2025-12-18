import axios from 'axios';
import { ContentItem, ToastFunction } from '../types/types';
import { API_BASE_URL } from '../lib/api';

interface CreateItemData {
  title: string;
  description: string;
  auteur: string;
  type: string;
  contenu: string;
  file: File | null;
  category: string;
  fileType: string;
  subTitle: string;
  country: string;
  language: string; // ✅ added missing field
}

export const handleCreateItem = async (
  data: CreateItemData,
  selectedTab: string,
  setIsSubmitting: (value: boolean) => void,
  setResources: (resources: ContentItem[]) => void,
  setProjects: (projects: ContentItem[]) => void,
  setArticles: (articles: ContentItem[]) => void,
  resources: ContentItem[],
  projects: ContentItem[],
  articles: ContentItem[],
  setIsCreateDialogOpen: (open: boolean) => void,
  toast: ToastFunction
) => {
  const date = new Date().toISOString().split('T')[0];
  setIsSubmitting(true);

  try {
    if (data.file && data.file.size > 150 * 1024 * 1024) {
      toast({
        title: 'Fichier trop volumineux',
        description: 'La taille maximale autorisée est de 150 Mo.',
        variant: 'destructive',
      });
      return;
    }

    if (selectedTab === 'resources') {
      if (!data.title || !data.description || !data.fileType || !data.category || !data.file) {
        toast({
          title: 'Champs requis',
          description: 'Veuillez remplir tous les champs obligatoires (titre, description, catégorie, type de fichier, fichier).',
          variant: 'destructive',
        });
        return;
      }

      const formData = new FormData();
      formData.append('file', data.file);
      formData.append('titre', data.title);
      formData.append('description', data.description);
      formData.append('category', data.category);
      formData.append('fileType', data.fileType);
      formData.append('language', data.language); // ✅ include language

      const response = await axios.post(`${API_BASE_URL}/ressources/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const created = response.data;
      const newItem: ContentItem = {
        id: created.id?.toString() || Date.now().toString(),
        title: created.titre,
        description: created.description,
        date: created.createdAt?.split('T')[0] || date,
        type: 'resource',
        category: created.category,
        fileType: created.fileType,
        language: created.language || data.language, // ✅ added
      };

      setResources([newItem, ...resources]);
      toast({ title: 'Ressource ajoutée', description: `"${created.titre}" a été ajoutée.` });
      setIsCreateDialogOpen(false);
    } else if (selectedTab === 'projects') {
      if (!data.title || !data.subTitle || !data.contenu || !data.country) {
        toast({
          title: 'Champs requis',
          description: 'Veuillez remplir tous les champs obligatoires (titre, sous-titre, contenu, pays).',
          variant: 'destructive',
        });
        return;
      }

      let imageUrl = '';
      if (data.file) {
        const imageData = new FormData();
        imageData.append('file', data.file);
        const uploadResponse = await axios.post(`${API_BASE_URL}/initiatives/upload-image-initiative`, imageData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        imageUrl = uploadResponse.data.imageUrl;
      }

      const response = await axios.post(`${API_BASE_URL}/initiatives/create-new-initiative`, {
        title: data.title,
        subTitle: data.subTitle,
        content: data.contenu,
        country: data.country,
        imageUrl,
        language: data.language, // ✅ send to API
      });

      const created = response.data;
      setProjects([
        {
          id: created.id?.toString() || Date.now().toString(),
          title: created.title,
          description: created.subTitle,
          date,
          type: 'project',
          subTitle: created.subTitle,
          country: created.country,
          imageUrl: created.imageUrl || imageUrl,
          language: created.language || data.language, // ✅ added
        },
        ...projects,
      ]);

      toast({ title: 'Initiative publiée', description: `"${created.title}" a été publiée.` });
      setIsCreateDialogOpen(false);
    } else {
      if (!data.title || !data.description || !data.auteur || !data.type || !data.contenu) {
        toast({
          title: 'Champs requis',
          description: 'Veuillez remplir tous les champs obligatoires (titre, description, auteur, type, contenu).',
          variant: 'destructive',
        });
        return;
      }

      let imageUrl = '';
      if (data.file) {
        const imageData = new FormData();
        imageData.append('file', data.file);
        const documentResponse = await axios.post(`${API_BASE_URL}/articles/upload-image`, imageData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        imageUrl = documentResponse.data.imageUrl;
      }

      const response = await axios.post(`${API_BASE_URL}/articles`, {
        title: data.title,
        description: data.description,
        auteur: data.auteur,
        type: data.type,
        contenu: data.contenu,
        imageUrl,
        language: data.language, // ✅ send to API
      });

      const created = response.data;
      setArticles([
        {
          id: created.id?.toString() || Date.now().toString(),
          title: created.title,
          description: created.description,
          date,
          type: 'article',
          imageUrl: created.imageUrl || imageUrl,
          language: created.language || data.language, // ✅ added
        },
        ...articles,
      ]);

      toast({ title: 'Article publié', description: `"${created.title}" a été publié.` });
      setIsCreateDialogOpen(false);
    }
  } catch (err: any) {
    toast({
      title: 'Erreur',
      description: err.response?.data?.message || 'Erreur inconnue',
      variant: 'destructive',
    });
  } finally {
    setIsSubmitting(false);
  }
};

export const handleDeleteItem = async (
  item: ContentItem,
  setArticles: (articles: ContentItem[]) => void,
  setResources: (resources: ContentItem[]) => void,
  setProjects: (projects: ContentItem[]) => void,
  articles: ContentItem[],
  resources: ContentItem[],
  projects: ContentItem[],
  toast: ToastFunction
) => {
  try {
    if (item.type === 'article') {
      await axios.delete(`${API_BASE_URL}/articles/${item.id}`);
      setArticles(articles.filter((a) => a.id !== item.id));
    } else if (item.type === 'resource') {
      await axios.delete(`${API_BASE_URL}/ressources/${item.id}`);
      setResources(resources.filter((r) => r.id !== item.id));
    } else if (item.type === 'project') {
      await axios.delete(`${API_BASE_URL}/initiatives/delete-initiative/${item.id}`);
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
