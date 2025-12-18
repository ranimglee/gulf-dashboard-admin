import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MessageSquare, Search, Mail, Clock, User, Reply, Archive, Trash2, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { API_BASE_URL } from '@/lib/api';

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  priority: 'low' | 'medium' | 'high';
}

interface Comment {
  id: string;
  content: string;
  author: string;
  approved: boolean;
  createdAt: string;
}

const MessagesManager = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [messages, setMessages] = useState<Message[]>([
    
  ]);
  const [pendingComments, setPendingComments] = useState<Comment[]>([]);
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch Pending Comments
  useEffect(() => {
    const fetchPendingComments = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/comments/pending`);
        setPendingComments(response.data.map((comment: any) => ({
          id: comment.id,
          content: comment.content,
          author: comment.author,
          approved: comment.approved,
          createdAt: comment.createdAt.split('T')[0], // Format date
        })));
      } catch (error: any) {
        toast({
          title: 'Erreur de chargement',
          description: error.response?.data?.message || 'Impossible de récupérer les commentaires en attente.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchPendingComments();
  }, []);

  // Approve Comment
  const handleApproveComment = async (commentId: string) => {
    try {
      await axios.put(`${API_BASE_URL}/comments/approve/${commentId}`);
      setPendingComments(pendingComments.filter(comment => comment.id !== commentId));
      if (selectedComment?.id === commentId) {
        setSelectedComment(null);
      }
      toast({
        title: 'Commentaire approuvé',
        description: 'Le commentaire a été approuvé avec succès.',
      });
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.response?.data?.message || 'Échec de l\'approbation du commentaire.',
        variant: 'destructive',
      });
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch =
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || message.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const filteredComments = pendingComments.filter(comment =>
    comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comment.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-[#FF6F61] text-white';
      case 'read':
        return 'bg-[#F7B32B] text-[#333333]';
      case 'replied':
        return 'bg-green-100 text-green-800';
      case 'archived':
        return 'bg-[#E5E7EB] text-[#333333]';
      default:
        return 'bg-[#E5E7EB] text-[#333333]';
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleUpdateMessageStatus = (messageId: string, newStatus: 'new' | 'read' | 'replied' | 'archived') => {
    setMessages(messages.map(message =>
      message.id === messageId ? { ...message, status: newStatus } : message
    ));
    toast({
      title: 'Statut mis à jour',
      description: 'Le statut du message a été modifié.',
    });
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter(message => message.id !== messageId));
    setSelectedMessage(null);
    toast({
      title: 'Message supprimé',
      description: 'Le message a été supprimé avec succès.',
    });
  };

  const getStatusCounts = () => {
    return {
      total: messages.length + pendingComments.length,
      new: messages.filter(m => m.status === 'new').length + pendingComments.length,
      read: messages.filter(m => m.status === 'read').length,
      replied: messages.filter(m => m.status === 'replied').length,
    };
  };

  const counts = getStatusCounts();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#1A535C]">Gestion des Messages</h2>
          <p className="text-[#333333]">Gérer les messages et commentaires en attente</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white shadow-sm border-l-4 border-l-[#1A535C]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#333333]">Total Messages</p>
                <p className="text-2xl font-bold text-[#1A535C]">{counts.total}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-[#1A535C]" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm border-l-4 border-l-[#FF6F61]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#333333]">Nouveaux</p>
                <p className="text-2xl font-bold text-[#FF6F61]">{counts.new}</p>
              </div>
              <Mail className="h-8 w-8 text-[#FF6F61]" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm border-l-4 border-l-[#F7B32B]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#333333]">Lus</p>
                <p className="text-2xl font-bold text-[#F7B32B]">{counts.read}</p>
              </div>
              <Clock className="h-8 w-8 text-[#F7B32B]" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#333333]">Répondus</p>
                <p className="text-2xl font-bold text-green-600">{counts.replied}</p>
              </div>
              <Reply className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="bg-white shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#333333] h-4 w-4" />
              <Input
                placeholder="Rechercher par nom, email, sujet ou contenu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-[#E5E7EB] focus:border-[#1A535C]"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('all')}
                className={filterStatus === 'all' ? 'bg-[#1A535C] text-white' : ''}
              >
                Tous
              </Button>
              <Button
                variant={filterStatus === 'new' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('new')}
                className={filterStatus === 'new' ? 'bg-[#FF6F61] text-white' : ''}
              >
                Nouveaux
              </Button>
              <Button
                variant={filterStatus === 'read' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('read')}
                className={filterStatus === 'read' ? 'bg-[#F7B32B] text-[#333333]' : ''}
              >
                Lus
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Messages and Comments List */}
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-[#1A535C]">Messages et Commentaires ({filteredMessages.length + (filterStatus === 'new' || filterStatus === 'all' ? filteredComments.length : 0)})</CardTitle>
          <CardDescription className="text-[#333333]">
            Liste des messages et commentaires en attente
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-[#1A535C]">Chargement des données...</p>
            </div>
          ) : (
            <div className="space-y-2">
              {(filterStatus === 'all' || filterStatus === 'new') && filteredComments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-4 border-b border-[#E5E7EB] hover:bg-[#F4E1D2] cursor-pointer transition-colors"
                  onClick={() => setSelectedComment(comment)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="h-4 w-4 text-[#1A535C]" />
                        <span className="font-medium text-[#1A535C]">{comment.author}</span>
                      </div>
                      <p className="text-sm text-[#333333] line-clamp-2">{comment.content}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Clock className="h-4 w-4 text-[#333333]" />
                        <span className="text-sm text-[#333333]">{comment.createdAt}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      <Badge className="bg-[#FF6F61] text-white">En attente</Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent triggering dialog
                          handleApproveComment(comment.id);
                        }}
                        className="border-[#1A535C] text-[#1A535C] hover:bg-[#1A535C] hover:text-white"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approuver
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {filteredMessages.map((message) => (
                <div
                  key={message.id}
                  className="p-4 border-b border-[#E5E7EB] hover:bg-[#F4E1D2] cursor-pointer transition-colors"
                  onClick={() => setSelectedMessage(message)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="h-4 w-4 text-[#1A535C]" />
                        <span className="font-medium text-[#1A535C]">{message.name}</span>
                        <span className="text-sm text-[#333333]">({message.email})</span>
                      </div>
                      <h4 className="font-medium text-[#333333] mb-1">{message.subject}</h4>
                      <p className="text-sm text-[#333333] line-clamp-2">{message.message}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Clock className="h-4 w-4 text-[#333333]" />
                        <span className="text-sm text-[#333333]">{message.date}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      <Badge className={getStatusBadgeColor(message.status)}>
                        {message.status === 'new' && 'Nouveau'}
                        {message.status === 'read' && 'Lu'}
                        {message.status === 'replied' && 'Répondu'}
                        {message.status === 'archived' && 'Archivé'}
                      </Badge>
                      <Badge className={getPriorityBadgeColor(message.priority)}>
                        {message.priority === 'high' && 'Haute'}
                        {message.priority === 'medium' && 'Moyenne'}
                        {message.priority === 'low' && 'Basse'}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Message Details Dialog */}
      {selectedMessage && (
        <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-[#1A535C]">Détails du Message</DialogTitle>
              <DialogDescription className="text-[#333333]">
                Message de {selectedMessage.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-[#333333]">Nom</label>
                  <p className="text-[#1A535C] font-medium">{selectedMessage.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-[#333333]">Email</label>
                  <p className="text-[#1A535C]">{selectedMessage.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-[#333333]">Date</label>
                  <p className="text-[#333333]">{selectedMessage.date}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-[#333333]">Priorité</label>
                  <Badge className={getPriorityBadgeColor(selectedMessage.priority)}>
                    {selectedMessage.priority === 'high' && 'Haute'}
                    {selectedMessage.priority === 'medium' && 'Moyenne'}
                    {selectedMessage.priority === 'low' && 'Basse'}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-[#333333]">Sujet</label>
                <p className="text-[#1A535C] font-medium">{selectedMessage.subject}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-[#333333]">Message</label>
                <div className="bg-[#F4E1D2] p-4 rounded-lg">
                  <p className="text-[#333333] whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
              </div>
              <div className="flex justify-between pt-4">
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdateMessageStatus(selectedMessage.id, 'read')}
                    className="border-[#E5E7EB] hover:bg-[#F4E1D2]"
                  >
                    Marquer comme lu
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdateMessageStatus(selectedMessage.id, 'replied')}
                    className="border-[#E5E7EB] hover:bg-[#F4E1D2]"
                  >
                    <Reply className="h-4 w-4 mr-1" />
                    Répondre
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdateMessageStatus(selectedMessage.id, 'archived')}
                    className="border-[#E5E7EB] hover:bg-[#F4E1D2]"
                  >
                    <Archive className="h-4 w-4 mr-1" />
                    Archiver
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteMessage(selectedMessage.id)}
                  className="border-[#FF6F61] text-[#FF6F61] hover:bg-[#FF6F61] hover:text-white"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Supprimer
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Comment Details Dialog */}
      {selectedComment && (
        <Dialog open={!!selectedComment} onOpenChange={() => setSelectedComment(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-[#1A535C]">Détails du Commentaire</DialogTitle>
              <DialogDescription className="text-[#333333]">
                Commentaire de {selectedComment.author}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-[#333333]">Auteur</label>
                  <p className="text-[#1A535C] font-medium">{selectedComment.author}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-[#333333]">Date</label>
                  <p className="text-[#333333]">{selectedComment.createdAt}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-[#333333]">Contenu</label>
                <div className="bg-[#F4E1D2] p-4 rounded-lg">
                  <p className="text-[#333333] whitespace-pre-wrap">{selectedComment.content}</p>
                </div>
              </div>
              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleApproveComment(selectedComment.id)}
                  className="border-[#1A535C] text-[#1A535C] hover:bg-[#1A535C] hover:text-white"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Approuver
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setPendingComments(pendingComments.filter(comment => comment.id !== selectedComment.id));
                    setSelectedComment(null);
                    toast({
                      title: 'Commentaire supprimé',
                      description: 'Le commentaire a été supprimé avec succès.',
                    });
                  }}
                  className="border-[#FF6F61] text-[#FF6F61] hover:bg-[#FF6F61] hover:text-white"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Supprimer
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default MessagesManager;