
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Search, FileText, Calendar, Link, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

const Patients = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const patients = [
    {
      id: "PT-123",
      name: "John Doe",
      age: 45,
      gender: "Male",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
      lastVisit: "2023-05-01",
      status: "active"
    },
    {
      id: "PT-124",
      name: "Jane Smith",
      age: 32,
      gender: "Female",
      email: "jane.smith@example.com",
      phone: "+1 (555) 234-5678",
      lastVisit: "2023-04-22",
      status: "active"
    },
    {
      id: "PT-125",
      name: "Michael Johnson",
      age: 58,
      gender: "Male",
      email: "michael.johnson@example.com",
      phone: "+1 (555) 345-6789",
      lastVisit: "2023-04-15",
      status: "active"
    },
    {
      id: "PT-126",
      name: "Emily Brown",
      age: 29,
      gender: "Female",
      email: "emily.brown@example.com",
      phone: "+1 (555) 456-7890",
      lastVisit: "2023-04-10",
      status: "inactive"
    },
    {
      id: "PT-127",
      name: "Robert Williams",
      age: 52,
      gender: "Male",
      email: "robert.williams@example.com",
      phone: "+1 (555) 567-8901",
      lastVisit: "2023-03-28",
      status: "active"
    }
  ];

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendLink = (type: string) => {
    toast.success(`${type} link copied to clipboard!`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#062D46]">Patients</h1>
        <p className="text-slate-500">Manage your patient records</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search patients..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button>
          <Users className="mr-2 h-4 w-4" />
          Add New Patient
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Patient Records</span>
            <span className="text-sm font-normal">
              Total: {filteredPatients.length} patients
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="pb-3 text-left font-medium">Patient</th>
                  <th className="pb-3 text-left font-medium">Contact</th>
                  <th className="pb-3 text-left font-medium">Last Visit</th>
                  <th className="pb-3 text-left font-medium">Status</th>
                  <th className="pb-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => (
                  <tr key={patient.id} className="border-b">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {patient.name.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{patient.name}</div>
                          <div className="text-sm text-slate-500">
                            {patient.age} yrs, {patient.gender}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <div>
                        <div className="text-sm">{patient.email}</div>
                        <div className="text-sm text-slate-500">{patient.phone}</div>
                      </div>
                    </td>
                    <td className="py-4">
                      <div>{patient.lastVisit}</div>
                    </td>
                    <td className="py-4">
                      <Badge
                        variant="outline"
                        className={
                          patient.status === "active"
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : "bg-slate-100 text-slate-800 hover:bg-slate-100"
                        }
                      >
                        {patient.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSendLink("Report")}
                        >
                          <FileText className="h-3.5 w-3.5 mr-1" />
                          Request Report
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSendLink("Consultation")}
                        >
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          Schedule
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Patients;
