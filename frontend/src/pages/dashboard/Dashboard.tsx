
import React, { useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, MessageSquare, Calendar, Users, Loader } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardData } from "@/redux/actions/DashboardAction";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { data, isLoading } = useSelector((state: any) => state.dashboard);

  useEffect(() => {
    fetchDashboardData({ toast, dispatch });
  }, [dispatch]);

  const stats = [
    {
      title: "Total Reports",
      value: data?.totalReports || 0,
      icon: FileText,
      color: "bg-blue-100 text-blue-700"
    },
    {
      title: "Pending Consultations",
      value: data?.pendingConsultations || 0,
      icon: Calendar,
      color: "bg-green-100 text-green-700"
    },
    {
      title: "New Messages",
      value: data?.newMessages || 0,
      icon: MessageSquare,
      color: "bg-amber-100 text-amber-700"
    },
    {
      title: "Active Patients",
      value: data?.activePatients || 0,
      icon: Users,
      color: "bg-purple-100 text-purple-700"
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading dashboard data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#062D46]">Dashboard</h1>
        <p className="text-slate-500">Welcome back, Dr. Sarah Reed</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
          </CardHeader>
          <CardContent>
            {data?.recentReports && data.recentReports.length > 0 ? (
              <div className="space-y-4">
                {data.recentReports.map((report: any, i: number) => (
                  <div key={report.id} className="flex items-center justify-between border-b pb-4">
                    <div>
                      <p className="font-medium">{report.fullName}</p>
                      <p className="text-sm text-slate-500">{report.reportEmail}</p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/dashboard/reports?id=${report.id}`}>View</Link>
                    </Button>
                  </div>
                ))}
                <Button variant="ghost" className="w-full" asChild>
                  <Link to="/dashboard/reports">View All Reports</Link>
                </Button>
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">No reports found</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Consultations</CardTitle>
          </CardHeader>
          <CardContent>
            {data?.upcomingConsultations && data.upcomingConsultations.length > 0 ? (
              <div className="space-y-4">
                {data.upcomingConsultations.map((consultation: any) => (
                  <div key={consultation.uri} className="flex items-center justify-between border-b pb-4">
                    <div>
                      <p className="font-medium">
                        {new Date(consultation.start_time).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-slate-500">
                        {`${new Date(consultation.start_time).toLocaleTimeString()} - ${consultation.event_memberships[0]?.user_name || 'Patient'}`}
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(consultation.location.join_url, '_blank')}
                    >
                      Join
                    </Button>
                  </div>
                ))}
                <Button variant="ghost" className="w-full" asChild>
                  <Link to="/dashboard/consultations">View Schedule</Link>
                </Button>
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">No upcoming consultations</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
