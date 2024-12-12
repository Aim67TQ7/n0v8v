import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, Clock } from "lucide-react";

interface MaintenanceSchedule {
  id: string;
  frequency: string;
  task_description: string;
  estimated_time: string | null;
  is_critical: boolean;
  skill_level: string;
}

interface MaintenanceScheduleListProps {
  schedules: MaintenanceSchedule[];
}

export const MaintenanceScheduleList = ({ schedules }: MaintenanceScheduleListProps) => {
  return (
    <div className="space-y-3">
      <h4 className="font-medium">Maintenance Tasks</h4>
      {schedules?.map((schedule) => (
        <div key={schedule.id} className="flex items-start gap-2 p-3 bg-accent/50 rounded-lg">
          {schedule.is_critical ? (
            <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
          ) : (
            <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <p className="text-sm">{schedule.task_description}</p>
            <div className="flex gap-2 mt-2">
              <Badge variant="secondary" className="text-xs">
                <Clock className="h-3 w-3 mr-1" />
                {schedule.frequency}
              </Badge>
              {schedule.estimated_time && (
                <Badge variant="secondary" className="text-xs">
                  {schedule.estimated_time}
                </Badge>
              )}
              <Badge variant="secondary" className="text-xs">
                {schedule.skill_level}
              </Badge>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};