
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ArrowUp, ArrowDown, Users, FileText, MessageSquare, Settings, Shield, BarChart3, PlusCircle, Edit, Trash2, Upload } from 'lucide-react';
import ContentManager from '@/components/admin/ContentManager';
import UserManager from '@/components/admin/UserManager';
import MessagesManager from '@/components/admin/MessagesManager';
import SecuritySettings from '@/components/admin/SecuritySettings';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Sample data for charts
  const visitorData = [
    { month: 'Jan', visitors: 4000 },
    { month: 'Feb', visitors: 3000 },
    { month: 'Mar', visitors: 5000 },
    { month: 'Apr', visitors: 4500 },
    { month: 'May', visitors: 6000 },
    { month: 'Jun', visitors: 5500 },
  ];

  const trafficData = [
    { name: 'Direct', value: 40, color: '#1A535C' },
    { name: 'Search', value: 30, color: '#F7B32B' },
    { name: 'Social', value: 20, color: '#FF6F61' },
    { name: 'Email', value: 10, color: '#F4E1D2' },
  ];

  const statsCards = [
    {
      title: 'Total Visitors',
      value: '28,000',
      change: '+12%',
      trend: 'up',
      icon: Users,
    },
    {
      title: 'Articles Published',
      value: '156',
      change: '+8%',
      trend: 'up',
      icon: FileText,
    },
    {
      title: 'Messages',
      value: '48',
      change: '-3%',
      trend: 'down',
      icon: MessageSquare,
    },
    {
      title: 'Active Users',
      value: '2,340',
      change: '+15%',
      trend: 'up',
      icon: Users,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="bg-[#1A535C] text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">AFAK Admin Dashboard</h1>
          <p className="text-teal-100">Gérer le contenu et les paramètres de votre site web</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-white shadow-sm">
            <TabsTrigger value="overview" className="flex items-center gap-2 text-[#1A535C] data-[state=active]:bg-[#1A535C] data-[state=active]:text-white">
              <BarChart3 className="h-4 w-4" />
              Aperçu
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2 text-[#1A535C] data-[state=active]:bg-[#1A535C] data-[state=active]:text-white">
              <FileText className="h-4 w-4" />
              Contenu
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2 text-[#1A535C] data-[state=active]:bg-[#1A535C] data-[state=active]:text-white">
              <Users className="h-4 w-4" />
              Utilisateurs
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-2 text-[#1A535C] data-[state=active]:bg-[#1A535C] data-[state=active]:text-white">
              <MessageSquare className="h-4 w-4" />
              Messages
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2 text-[#1A535C] data-[state=active]:bg-[#1A535C] data-[state=active]:text-white">
              <Settings className="h-4 w-4" />
              Paramètres
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2 text-[#1A535C] data-[state=active]:bg-[#1A535C] data-[state=active]:text-white">
              <Shield className="h-4 w-4" />
              Sécurité
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statsCards.map((stat, index) => (
                <Card key={index} className="bg-white shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-[#1A535C]">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-[#333333]">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className="h-4 w-4 text-[#1A535C]" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-[#1A535C]">{stat.value}</div>
                    <p className={`text-xs flex items-center ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.trend === 'up' ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                      {stat.change} par rapport au mois dernier
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-[#1A535C]">Visiteurs Mensuels</CardTitle>
                  <CardDescription className="text-[#333333]">
                    Évolution du trafic sur les 6 derniers mois
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={visitorData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="month" stroke="#333333" />
                      <YAxis stroke="#333333" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1A535C', 
                          border: 'none', 
                          borderRadius: '8px',
                          color: 'white'
                        }} 
                      />
                      <Bar dataKey="visitors" fill="#F7B32B" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-[#1A535C]">Sources de Trafic</CardTitle>
                  <CardDescription className="text-[#333333]">
                    Répartition des visiteurs par source
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={trafficData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {trafficData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1A535C', 
                          border: 'none', 
                          borderRadius: '8px',
                          color: 'white'
                        }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="content">
            <ContentManager />
          </TabsContent>

          <TabsContent value="users">
            <UserManager />
          </TabsContent>

          <TabsContent value="messages">
            <MessagesManager />
          </TabsContent>

          <TabsContent value="settings">
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-[#1A535C]">Paramètres du Site</CardTitle>
                <CardDescription className="text-[#333333]">
                  Gérer les paramètres généraux de votre site web
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-[#333333]">Configuration des paramètres à venir...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <SecuritySettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
