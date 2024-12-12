import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { GraduationCap, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const TrainingMatrix = () => {
  const session = useSession();
  const navigate = useNavigate();

  const { data: trainingLogs, isLoading } = useQuery({
    queryKey: ["training-logs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("training_logs")
        .select(`
          *,
          employee:employees(
            employee_number,
            profile:profiles(
              first_name,
              last_name
            )
          )
        `)
        .order('completion_date', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6 text-center">
          <h2 className="text-lg font-semibold mb-4">Please log in to view the training matrix</h2>
          <Button onClick={() => navigate("/login")}>Go to Login</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <GraduationCap className="h-8 w-8 text-secondary" />
        <h1 className="text-3xl font-bold">Training Matrix</h1>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : !trainingLogs?.length ? (
        <Card className="p-6">
          <p className="text-center text-muted-foreground">No training records found.</p>
        </Card>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Training
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Completion Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Next Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {trainingLogs?.map((log) => (
                  <tr key={log.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {log.employee?.profile?.first_name} {log.employee?.profile?.last_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {log.training_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(log.completion_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {log.next_due_date ? new Date(log.next_due_date).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        log.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingMatrix;