import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MessageSquare, Search, Mail, Clock, User, Reply, Archive, Trash2, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { api, API_BASE_URL } from '@/lib/api';

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  status: 'new' | 'read' | 'replied' | 'archived';
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
  const [messages, setMessages] = useState<Message[]>([]);  
  const [pendingComments, setPendingComments] = useState<Comment[]>([]);
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const [isLoading, setIsLoading] = useState(false);
// Fetch Contact Messages
useEffect(() => {
  const fetchMessages = async () => {
    setIsLoading(true);

    try {
      const response = await api.get('/admin/contact-messages');

      console.log(response.data);

      setMessages(
        response.data.map((msg: any) => ({
          id: msg.id,

          name: msg.fullName || 'Unknown',
          email: msg.email || 'No email',
          subject: msg.subject || 'No subject',
          message: msg.message || '',

          date: msg.createdAt
            ? new Date(msg.createdAt).toLocaleDateString()
            : '',

          status: 'new',
        }))
      );
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: 'Impossible de récupérer les messages.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  fetchMessages();
}, []);
  // Fetch Pending Comments
useEffect(() => {
  const fetchPendingComments = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/comments/pending'); // use api instance
      setPendingComments(
        response.data.map((comment: any) => ({
          id: comment.id,
          content: comment.content,
          author: comment.author,
          approved: comment.approved,
          createdAt: comment.createdAt.split('T')[0],
        }))
      );
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
      await api.put(`/comments/approve/${commentId}`);
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



  const handleUpdateMessageStatus = (messageId: string, newStatus: 'new' | 'read' | 'replied' | 'archived') => {
    setMessages(messages.map(message =>
      message.id === messageId ? { ...message, status: newStatus } : message
    ));
    toast({
      title: 'Statut mis à jour',
      description: 'Le statut du message a été modifié.',
    });
  };

 const handleDeleteMessage = async (messageId: string) => {
  try {
    await api.delete(`/admin/contact-messages/${messageId}`);

    setMessages(messages.filter(message => message.id !== messageId));

    setSelectedMessage(null);

    toast({
      title: 'Message supprimé',
      description: 'Le message a été supprimé avec succès.',
    });
  } catch (error: any) {
    toast({
      title: 'Erreur',
      description:
        error.response?.data?.message ||
        'Impossible de supprimer le message.',
      variant: 'destructive',
    });
  }
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
  <div className="space-y-8">

    {/* HEADER */}
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h2 className="text-4xl font-bold text-[#1A535C] mb-2">
          Gestion des messages
        </h2>

        <p className="text-gray-500 text-base">
          Gérez les messages de contact et les commentaires
          de la plateforme AFAQ.
        </p>
      </div>

      <div className="hidden md:flex items-center gap-2 bg-[#1A535C]/10 px-4 py-2 rounded-2xl">
        <MessageSquare className="w-5 h-5 text-[#1A535C]" />

        <span className="text-sm font-medium text-[#1A535C]">
          Centre de communication
        </span>
      </div>
    </div>

    {/* STATS */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-5">

      {/* TOTAL */}
      <Card className="border-0 shadow-lg rounded-3xl overflow-hidden">
        <CardContent className="p-6 relative">
          <div className="absolute top-0 right-0 w-28 h-28 bg-[#1A535C]/5 rounded-full blur-2xl" />

          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-sm text-gray-500 mb-2">
                Total
              </p>

              <h3 className="text-4xl font-bold text-[#1A535C]">
                {counts.total}
              </h3>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-[#1A535C]/10 flex items-center justify-center">
              <MessageSquare className="w-7 h-7 text-[#1A535C]" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* NEW */}
      <Card className="border-0 shadow-lg rounded-3xl overflow-hidden">
        <CardContent className="p-6 relative">
          <div className="absolute top-0 right-0 w-28 h-28 bg-[#FF6F61]/10 rounded-full blur-2xl" />

          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-sm text-gray-500 mb-2">
                Nouveaux
              </p>

              <h3 className="text-4xl font-bold text-[#FF6F61]">
                {counts.new}
              </h3>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-[#FF6F61]/10 flex items-center justify-center">
              <Mail className="w-7 h-7 text-[#FF6F61]" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* READ */}
      <Card className="border-0 shadow-lg rounded-3xl overflow-hidden">
        <CardContent className="p-6 relative">
          <div className="absolute top-0 right-0 w-28 h-28 bg-[#F7B32B]/10 rounded-full blur-2xl" />

          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-sm text-gray-500 mb-2">
                Lus
              </p>

              <h3 className="text-4xl font-bold text-[#F7B32B]">
                {counts.read}
              </h3>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-[#F7B32B]/10 flex items-center justify-center">
              <Clock className="w-7 h-7 text-[#F7B32B]" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* REPLIED */}
      <Card className="border-0 shadow-lg rounded-3xl overflow-hidden">
        <CardContent className="p-6 relative">
          <div className="absolute top-0 right-0 w-28 h-28 bg-green-100 rounded-full blur-2xl" />

          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-sm text-gray-500 mb-2">
                Répondus
              </p>

              <h3 className="text-4xl font-bold text-green-600">
                {counts.replied}
              </h3>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center">
              <Reply className="w-7 h-7 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    {/* SEARCH */}
    <Card className="border-0 shadow-lg rounded-3xl">
      <CardContent className="p-5">

        <div className="flex flex-col md:flex-row gap-4">
          
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />

            <Input
              placeholder="Rechercher un message ou commentaire..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              className="h-12 pl-12 rounded-2xl border-gray-200 focus-visible:ring-[#1A535C] focus-visible:ring-2"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={
                filterStatus === 'all'
                  ? 'default'
                  : 'outline'
              }
              onClick={() =>
                setFilterStatus('all')
              }
              className={`rounded-xl ${
                filterStatus === 'all'
                  ? 'bg-[#1A535C] text-white'
                  : ''
              }`}
            >
              Tous
            </Button>

            <Button
              variant={
                filterStatus === 'new'
                  ? 'default'
                  : 'outline'
              }
              onClick={() =>
                setFilterStatus('new')
              }
              className={`rounded-xl ${
                filterStatus === 'new'
                  ? 'bg-[#FF6F61] text-white'
                  : ''
              }`}
            >
              Nouveaux
            </Button>

            <Button
              variant={
                filterStatus === 'read'
                  ? 'default'
                  : 'outline'
              }
              onClick={() =>
                setFilterStatus('read')
              }
              className={`rounded-xl ${
                filterStatus === 'read'
                  ? 'bg-[#F7B32B] text-black'
                  : ''
              }`}
            >
              Lus
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

    {/* ========================= */}
    {/* MESSAGES SECTION */}
    {/* ========================= */}

 {/* ========================= */}
{/* MESSAGES + COMMENTS GRID */}
{/* ========================= */}

<div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch">
  {/* ========================= */}
  {/* MESSAGES SECTION */}
  {/* ========================= */}

<Card className="border-0 shadow-xl rounded-3xl overflow-hidden bg-white h-full flex flex-col">
    <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-[#1A535C]/5 to-transparent">

      <div className="flex items-center justify-between">
        <div>
          <CardTitle className="text-2xl text-[#1A535C] flex items-center gap-3">

            <div className="w-12 h-12 rounded-2xl bg-[#1A535C]/10 flex items-center justify-center">
              <Mail className="w-6 h-6 text-[#1A535C]" />
            </div>

            Messages
          </CardTitle>

          <CardDescription className="text-gray-500 mt-2">
            Messages reçus depuis le formulaire de contact.
          </CardDescription>
        </div>

        <Badge className="bg-[#1A535C] text-white px-4 py-2 rounded-full">
          {filteredMessages.length}
        </Badge>
      </div>
    </CardHeader>

<CardContent className="p-0 flex-1">
      {filteredMessages.length === 0 ? (
        <div className="py-20 text-center">
          <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />

          <p className="text-gray-500">
            Aucun message trouvé.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100 max-h-[850px] overflow-y-auto">

          {filteredMessages.map((message) => (
            <div
              key={message.id}
              className="p-6 hover:bg-[#fafcfc] transition cursor-pointer"
              onClick={() =>
                setSelectedMessage(message)
              }
            >
              <div className="flex items-start justify-between gap-4">

                <div className="flex gap-4 flex-1">

                  <div className="w-14 h-14 rounded-2xl bg-[#1A535C]/10 flex items-center justify-center text-[#1A535C] font-bold text-lg shrink-0">
                    {message.name.charAt(0)}
                  </div>

                  <div className="flex-1">

                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h3 className="font-semibold text-[#1A535C]">
                        {message.name}
                      </h3>

                      <span className="text-gray-400 text-sm">
                        {message.email}
                      </span>
                    </div>

                    <h4 className="font-medium text-gray-800 mb-2">
                      {message.subject}
                    </h4>

                    <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
                      {message.message}
                    </p>

                    <div className="flex items-center gap-2 mt-4 text-sm text-gray-400">
                      <Clock className="w-4 h-4" />
                      {message.date}
                    </div>
                  </div>
                </div>

                <Badge
                  className={`${getStatusBadgeColor(
                    message.status
                  )} rounded-full px-4 py-1`}
                >
                  {message.status === 'new' &&
                    'Nouveau'}
                  {message.status === 'read' &&
                    'Lu'}
                  {message.status === 'replied' &&
                    'Répondu'}
                  {message.status === 'archived' &&
                    'Archivé'}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </CardContent>
  </Card>

  {/* ========================= */}
  {/* COMMENTS SECTION */}
  {/* ========================= */}

<Card className="border-0 shadow-xl rounded-3xl overflow-hidden bg-white h-full flex flex-col">
    <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-[#FF6F61]/5 to-transparent">

      <div className="flex items-center justify-between">
        <div>
          <CardTitle className="text-2xl text-[#1A535C] flex items-center gap-3">

            <div className="w-12 h-12 rounded-2xl bg-[#FF6F61]/10 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-[#FF6F61]" />
            </div>

            Commentaires
          </CardTitle>

          <CardDescription className="text-gray-500 mt-2">
            Commentaires en attente d’approbation.
          </CardDescription>
        </div>

        <Badge className="bg-[#FF6F61] text-white px-4 py-2 rounded-full">
          {filteredComments.length}
        </Badge>
      </div>
    </CardHeader>

<CardContent className="p-0 flex-1">
      {filteredComments.length === 0 ? (
        <div className="py-20 text-center">
          <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />

          <p className="text-gray-500">
            Aucun commentaire en attente.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100 max-h-[850px] overflow-y-auto">

          {filteredComments.map((comment) => (
            <div
              key={comment.id}
              className="p-6 hover:bg-[#fff9f8] transition cursor-pointer"
              onClick={() =>
                setSelectedComment(comment)
              }
            >
              <div className="flex items-start justify-between gap-4">

                <div className="flex gap-4 flex-1">

                  <div className="w-14 h-14 rounded-2xl bg-[#FF6F61]/10 flex items-center justify-center text-[#FF6F61] font-bold text-lg shrink-0">
                    {comment.author.charAt(0)}
                  </div>

                  <div className="flex-1">

                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-[#1A535C]">
                        {comment.author}
                      </h3>

                      <Badge className="bg-[#FF6F61] text-white rounded-full">
                        En attente
                      </Badge>
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                      {comment.content}
                    </p>

                    <div className="flex items-center gap-2 mt-4 text-sm text-gray-400">
                      <Clock className="w-4 h-4" />
                      {comment.createdAt}
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleApproveComment(
                      comment.id
                    );
                  }}
                  className="rounded-xl border-green-200 text-green-700 hover:bg-green-600 hover:text-white"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approuver
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </CardContent>
  </Card>
</div>
  </div>
);
};

export default MessagesManager;