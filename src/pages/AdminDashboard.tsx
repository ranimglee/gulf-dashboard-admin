
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ArrowUp, ArrowDown, Users, FileText, MessageSquare } from 'lucide-react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/admin/AppSidebar';
import { AdminNavbar } from '@/components/admin/AdminNavbar';
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
      title: 'Total Visiteurs',
      value: '28,000',
      change: '+12%',
      trend: 'up',
      icon: Users,
    },
    {
      title: 'Articles Publiés',
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
      title: 'Utilisateurs Actifs',
      value: '2,340',
      change: '+15%',
      trend: 'up',
      icon: Users,
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'content':
        return <ContentManager />;
      case 'users':
        return <UserManager />;
      case 'messages':
        return <MessagesManager />;
      case 'settings':
        return (
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
        );
      case 'security':
        return <SecuritySettings />;
      default:
        return (
          <div className="space-y-6">
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
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-[#1A535C]">Visiteurs Mensuels</CardTitle>
                  <CardDescription className="text-[#333333]">
                    Évolution du trafic sur les 6 derniers mois
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={450}>
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

       
            </div>
          </div>
        );
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-50 to-white">
        <AppSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        
        <SidebarInset className="flex-1">
          <AdminNavbar />
          
          <main className="flex-1 p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsContent value={activeTab} className="mt-0">
                {renderContent()}
              </TabsContent>
            </Tabs>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
