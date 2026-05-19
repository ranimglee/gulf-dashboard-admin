import { useEffect, useState } from "react";

import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  BarChart,
  Bar,
} from "recharts";

import {
  Users,
  Activity,
  Eye,
  TrendingUp,
  FileText,
  MessageSquare,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Tabs, TabsContent } from "@/components/ui/tabs";

import {
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

import { AppSidebar } from "@/components/admin/AppSidebar";
import { AdminNavbar } from "@/components/admin/AdminNavbar";

import ContentManager from "@/components/admin/content/ContentManager";
import UserManager from "@/components/admin/UserManager";
import MessagesManager from "@/components/admin/MessagesManager";
import SecuritySettings from "@/components/admin/SecuritySettings";

import {
  getAnalyticsDashboard,
  getTrafficPerDay,
  getTopPages,
  getTopArticles,
  getCommentStats,
  getTotalArticles,
  getTotalInitiatives,
  getTotalResources,
  getDeviceStats,
  getTopProjects,
} from "@/lib/api";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
const COLORS = ["#1A535C", "#F7B32B", "#FF6B6B", "#4ECDC4"];
const [deviceData, setDeviceData] = useState<
  { type: string; count: number }[]
>([]);
type DashboardStats = {
  totalVisitors: number;
  todayVisitors: number;
  thisMonthVisitors: number;
  lastMonthVisitors: number;
  changePercent: number;
  activeSessions: number;
};

const [dashboard, setDashboard] = useState<DashboardStats>({
  totalVisitors: 0,
  todayVisitors: 0,
  thisMonthVisitors: 0,
  lastMonthVisitors: 0,
  changePercent: 0,
  activeSessions: 0,
});
const [trafficData, setTrafficData] = useState<
  { date: string; count: number }[]
>([]);

const [topPages, setTopPages] = useState<
  { path: string; count: number }[]
>([]);

const [topProjects, setTopProjects] = useState<
  { title: string; views: number }[]
>([]);

const [topArticles, setTopArticles] = useState<
  { title: string; views: number }[]
>([]);

  const [contentStats, setContentStats] = useState({
    articles: 0,
    initiatives: 0,
    resources: 0,
    comments: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

const fetchAnalytics = async () => {
  try {
    setLoading(true);

    const [
      dashboardRes,
      trafficRes,
      pagesRes,
      articlesRes,
      projectsRes,
      commentsRes,
      articlesCountRes,
      initiativesRes,
      resourcesRes,
      deviceRes,
    ] = await Promise.all([
      getAnalyticsDashboard(),
      getTrafficPerDay(30),
      getTopPages(),
      getTopArticles(),
      getTopProjects(),
      getCommentStats(),
      getTotalArticles(),
      getTotalInitiatives(),
      getTotalResources(),
      getDeviceStats(),
    ]);

    setDashboard(dashboardRes.data);
    setTrafficData(trafficRes.data);
    setTopPages(pagesRes.data);
    setTopArticles(articlesRes.data);
    setTopProjects(projectsRes.data);
    setDeviceData(deviceRes.data);

    setContentStats({
      articles: articlesCountRes.data,
      initiatives: initiativesRes.data,
      resources: resourcesRes.data,
      comments: commentsRes.data.totalComments || 0,
    });

  } catch (error) {
    console.error("Failed to load analytics", error);
  } finally {
    setLoading(false);
  }
};
const statsCards = [
  {
    title: "Visiteurs totales",
    value: dashboard?.totalVisitors ?? 0,
    icon: Users,
    trend: "up",
  },
  {
    title: "Visites aujourd’hui",
    value: dashboard?.todayVisitors ?? 0,
    icon: Eye,
    trend: "up",
  },
  {
    title: "Sessions actives",
    value: dashboard?.activeSessions ?? 0,
    icon: Activity,
    trend: "up",
  },
  {
    title: "Croissance mensuelle",
    value: `${(dashboard?.changePercent ?? 0).toFixed(1)}%`,
    icon: TrendingUp,
    trend: (dashboard?.changePercent ?? 0) >= 0 ? "up" : "down",
  },
];

  const renderContent = () => {
    switch (activeTab) {
      case "content":
        return <ContentManager />;

      case "users":
        return <UserManager />;

      case "messages":
        return <MessagesManager />;

      case "security":
        return <SecuritySettings />;

      default:
        return (
          <div className="space-y-6">
            {/* TOP STATS */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {statsCards.map((stat, index) => (
                <Card
                  key={index}
                  className="border-l-4 border-l-[#1A535C] shadow-sm"
                >
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm text-muted-foreground">
                      {stat.title}
                    </CardTitle>

                    <stat.icon className="h-5 w-5 text-[#1A535C]" />
                  </CardHeader>

                  <CardContent>
                    <div className="text-3xl font-bold text-[#1A535C]">
                      {stat.value}
                    </div>

                    <div
                      className={`flex items-center text-xs mt-2 ${
                        stat.trend === "up"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {stat.trend === "up" ? (
                        <ArrowUp className="h-3 w-3 mr-1" />
                      ) : (
                        <ArrowDown className="h-3 w-3 mr-1" />
                      )}

                      Par rapport au mois dernier
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* TRAFFIC CHART */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-[#1A535C]">
                    Trafic quotidien

                </CardTitle>

                <CardDescription>
                   Activité des visiteurs des 30 derniers jours

                </CardDescription>
              </CardHeader>

              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={trafficData}>
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="date" />

                    <YAxis />

                    <Tooltip />

                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="#1A535C"
                      fill="#1A535C"
                      fillOpacity={0.2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* TOP PAGES + ARTICLES */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* TOP PAGES */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-[#1A535C]">
                    Les pages les plus consultées
                  </CardTitle>

                  <CardDescription>
                    Pages les plus vues
                  </CardDescription>
                </CardHeader>

                <CardContent>
<div className="space-y-3">
  {topPages.map((page, i) => (
    <div key={i} className="flex justify-between border-b pb-2">
      <span className="truncate max-w-[70%]">{page.path}</span>
      <span className="font-bold">{page.count}</span>
    </div>
  ))}
</div>

                </CardContent>
              </Card>
<Card className="shadow-sm">
  <CardHeader>
    <CardTitle className="text-[#1A535C]">
        Les appareils les plus utilisés

    </CardTitle>
    <CardDescription>
        Répartition des appareils

    </CardDescription>
  </CardHeader>

  <CardContent className="space-y-6">




    {/* Device Pie Chart */}
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={deviceData}
          dataKey="count"
          nameKey="type"
          outerRadius={100}
        >
          {deviceData.map((_, index) => (
            <Cell
              key={index}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>

  </CardContent>
</Card>
              {/* TOP ARTICLES */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-[#1A535C]">
                     Les articles les plus consultés
                  </CardTitle>

                  <CardDescription>
                      Articles les plus vus

                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {topArticles.map((article, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between border-b pb-3"
                      >
                        <div className="truncate text-sm">
                            {article.title}
                        </div>

                        <div className="font-semibold text-[#1A535C]">
                          {article.views} vues
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>


                  {/* TOP Projects */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-[#1A535C]">
                     Les initiatives les plus consultées

                  </CardTitle>

                  <CardDescription>
                      Initiatives les plus vues

                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {topProjects.map((project, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between border-b pb-3"
                      >
                        <div className="truncate text-sm">
                            {project.title}
                        </div>

                        <div className="font-semibold text-[#1A535C]">
                          {project.views} vues
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* CONTENT STATS */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                                 <p className="text-sm text-muted-foreground">
  Articles
</p>

                    <h2 className="text-2xl font-bold">
                      {contentStats.articles}
                    </h2>
                  </div>

                  <FileText className="h-6 w-6 text-[#1A535C]" />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
   

<p className="text-sm text-muted-foreground">
  Initiatives
</p>

                    <h2 className="text-2xl font-bold">
                      {contentStats.initiatives}
                    </h2>
                  </div>

                  <Activity className="h-6 w-6 text-[#1A535C]" />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                   

<p className="text-sm text-muted-foreground">
  Ressources
</p>


                    <h2 className="text-2xl font-bold">
                      {contentStats.resources}
                    </h2>
                  </div>

                  <FileText className="h-6 w-6 text-[#1A535C]" />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Commentaires
                    </p>

                    <h2 className="text-2xl font-bold">
                      {contentStats.comments}
                    </h2>
                  </div>

                  <MessageSquare className="h-6 w-6 text-[#1A535C]" />
                </CardContent>
              </Card>
            </div>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading analytics...
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <SidebarInset className="flex-1">
          <AdminNavbar />

          <main className="p-6">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsContent
                value={activeTab}
                className="mt-0"
              >
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