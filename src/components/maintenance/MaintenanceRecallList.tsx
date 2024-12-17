import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Bell, Calendar, Clock, AlertTriangle } from "lucide-react";
import { format, addDays } from "date-fns";

interface RecallItem {
  id: string;
  equipmentId: string;
  description: string;
  lastDate: Date;
  recallDate: Date;
  dueDate: Date;
  emailReminder: boolean;
}

export const MaintenanceRecallList = () => {
  const [recalls, setRecalls] = useState<RecallItem[]>([
    {
      id: "RC001",
      equipmentId: "EQ-123",
      description: "CNC Machine - Spindle Maintenance",
      lastDate: new Date(2024, 1, 15),
      recallDate: new Date(2024, 3, 8),
      dueDate: new Date(2024, 3, 15),
      emailReminder: false
    },
    {
      id: "RC002",
      equipmentId: "EQ-456",
      description: "Hydraulic Press - Oil Change",
      lastDate: new Date(2024, 2, 1),
      recallDate: new Date(2024, 3, 24),
      dueDate: new Date(2024, 4, 1),
      emailReminder: true
    },
    {
      id: "RC003",
      equipmentId: "EQ-789",
      description: "Conveyor Belt - Belt Tension Check",
      lastDate: new Date(2024, 2, 20),
      recallDate: new Date(2024, 4, 13),
      dueDate: new Date(2024, 4, 20),
      emailReminder: false
    }
  ]);

  const handleEmailReminderChange = (id: string, checked: boolean) => {
    setRecalls(recalls.map(recall => 
      recall.id === id ? { ...recall, emailReminder: checked } : recall
    ));
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    Email Reminder
                  </div>
                </th>
                <th className="text-left p-2">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    Equipment ID
                  </div>
                </th>
                <th className="text-left p-2">Description</th>
                <th className="text-left p-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Last Date
                  </div>
                </th>
                <th className="text-left p-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Recall Date
                  </div>
                </th>
                <th className="text-left p-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Due By
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {recalls.map((recall) => (
                <tr key={recall.id} className="border-b hover:bg-muted/50">
                  <td className="p-2">
                    <Checkbox
                      checked={recall.emailReminder}
                      onCheckedChange={(checked) => 
                        handleEmailReminderChange(recall.id, checked as boolean)
                      }
                    />
                  </td>
                  <td className="p-2">{recall.equipmentId}</td>
                  <td className="p-2">{recall.description}</td>
                  <td className="p-2">{format(recall.lastDate, 'MM/dd/yyyy')}</td>
                  <td className="p-2">{format(recall.recallDate, 'MM/dd/yyyy')}</td>
                  <td className="p-2">{format(recall.dueDate, 'MM/dd/yyyy')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};