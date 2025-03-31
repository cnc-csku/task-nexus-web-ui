"use client";

import LoadingScreen from "@/components/ui/LoadingScreen";
import useProjectStatusOverview from "@/hooks/api/report/useProjectStatusOverview";
import useProjectPriorityOverview from "@/hooks/api/report/useProjectPriorityOverview";
import useProjectTypeOverview from "@/hooks/api/report/useProjectTypeOverview";
import useProjectEpicTaskOverview from "@/hooks/api/report/useProjectEpicTaskOverview";
import useProjectAssigneeOverviewBySprint from "@/hooks/api/report/useProjectAssigneeOverviewBySprint";
import { useParams } from "next/navigation";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ChartOptions, TooltipItem } from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

// Interfaces for all API responses
interface StatusItem {
  status: string;
  count: number;
  percent: number;
}

interface PriorityItem {
  priority: string;
  count: number;
  percent: number;
}

interface TypeItem {
  type: string;
  count: number;
  percent: number;
}

interface EpicStatus {
  status: string;
  count: number;
  percent: number;
}

interface EpicItem {
  taskID: string;
  taskRef: string;
  title: string;
  statuses: EpicStatus[];
  totalCount: number;
}

interface AssigneeItem {
  userID: string;
  fullName: string;
  displayName: string;
  profileUrl: string;
  taskCount: number;
  pointCount: number;
  taskPercent: number;
  pointPercent: number;
}

interface SprintItem {
  sprintID: string;
  sprintTitle: string;
  assignees: AssigneeItem[];
  totalTask: number;
  totalPoint: number;
}

interface ProjectStatusOverview {
  statuses: StatusItem[];
  totalCount: number;
}

interface ProjectPriorityOverview {
  priorities: PriorityItem[];
  totalCount: number;
}

interface ProjectTypeOverview {
  types: TypeItem[];
  totalCount: number;
}

interface ProjectEpicTaskOverview {
  epics: EpicItem[];
  totalCount: number;
}

interface ProjectAssigneeOverviewBySprint {
  sprints: SprintItem[];
  totalCount: number;
}

export default function ProjectReportPage() {
  const { projectId } = useParams<{ projectId: string }>();

  // Fetch all data
  const { data: projectStatusOverview, isPending: isStatusPending } = useProjectStatusOverview(projectId);
  const { data: projectPriorityOverview, isPending: isPriorityPending } = useProjectPriorityOverview(projectId);
  const { data: projectTypeOverview, isPending: isTypePending } = useProjectTypeOverview(projectId);
  const { data: projectEpicTaskOverview, isPending: isEpicPending } = useProjectEpicTaskOverview(projectId);
  const { data: projectAssigneeOverviewBySprint, isPending: isAssigneePending } = useProjectAssigneeOverviewBySprint(projectId);

  // Loading state
  if (isStatusPending || isPriorityPending || isTypePending || isEpicPending || isAssigneePending) {
    return <LoadingScreen />;
  }
  
  // Type assertions (safeguard against undefined data)
  const statusData = (projectStatusOverview ?? { statuses: [], totalCount: 0 }) as ProjectStatusOverview;
  const priorityData = (projectPriorityOverview ?? { priorities: [], totalCount: 0 }) as ProjectPriorityOverview;
  const typeData = (projectTypeOverview ?? { types: [], totalCount: 0 }) as ProjectTypeOverview;
  const epicData = (projectEpicTaskOverview ?? { epics: [], totalCount: 0 }) as ProjectEpicTaskOverview;
  const assigneeData = (projectAssigneeOverviewBySprint ?? { sprints: [], totalCount: 0 }) as ProjectAssigneeOverviewBySprint;

  // Status Chart (Pie Chart)
  const statusChartData = {
    labels: statusData.statuses.map((s) => s.status),
    datasets: [
      {
        data: statusData.statuses.map((s) => s.count),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40", "#FF6384", "#36A2EB"],
      },
    ],
  };

  const statusOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<'pie'>): string => {
            const value = context.parsed;
            const percentage = statusData.statuses[context.dataIndex].percent;
            return `${context.label}: ${value} (${percentage.toFixed(1)}%)`;
          },
        },
      },
    },
  };

  // Priority Chart (Stacked Horizontal Bar)
  const priorityChartData = {
    labels: ["Priority"],
    datasets: priorityData.priorities.map((p) => ({
      label: p.priority || "NONE",
      data: [p.count],
      backgroundColor: {
        "": "#E5E7EB", // NONE
        LOW: "#3B82F6",
        MEDIUM: "#FBBF24",
        HIGH: "#F97316",
        CRITICAL: "#EF4444",
      }[p.priority] ?? "#6B7280", // Fallback color
    })),
  };

  const priorityOptions: ChartOptions<'bar'> = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { stacked: true, max: priorityData.totalCount },
      y: { stacked: true },
    },
    plugins: {
      legend: { position: "bottom" },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<'bar'>): string => {
            const value = context.raw as number;
            const percentage = priorityData.priorities[context.datasetIndex].percent;
            return `${context.dataset.label}: ${value} (${percentage.toFixed(1)}%)`;
          },
        },
      },
    },
  };

  // Type Chart (Horizontal Bar with Percentages)
  const typeChartData = {
    labels: typeData.types.map((t) => t.type),
    datasets: [
      {
        label: "Count",
        data: typeData.types.map((t) => t.count),
        backgroundColor: ["#10B981", "#8B5CF6", "#60A5FA", "#3B82F6", "#EF4444"],
      },
    ],
  };

  const typeOptions: ChartOptions<'bar'> = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { max: typeData.totalCount },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<'bar'>): string => {
            const value = context.raw as number;
            const percentage = typeData.types[context.dataIndex].percent;
            return `${context.label}: ${value} (${percentage.toFixed(1)}%)`;
          },
        },
      },
    },
  };

  // Function to generate a unique color for each status dynamically
  const generateColor = (index: number, total: number): string => {
    const hue = (index * 360) / total;
    return `hsl(${hue}, 70%, 50%)`;
  };

  // Extract unique statuses from the data
  const allStatuses: string[] = [...new Set(
    epicData.epics.flatMap((e) => e.statuses.map((s) => s.status))
  )].sort();

  console.log("All Statuses:", allStatuses);
  console.log("Epic Data:", epicData.epics);

  // Epic Chart (Stacked Horizontal Bar)
  const epicChartData = {
    labels: epicData.epics.map((e) => e.title),
    datasets: allStatuses.map((status, index) => ({
      label: status,
      data: epicData.epics.map((e) =>
        e.statuses.find((s) => s.status === status)?.count || 0
      ),
      backgroundColor: generateColor(index, allStatuses.length),
    })),
  };

  const epicOptions: ChartOptions<'bar'> = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { stacked: true },
      y: { stacked: true },
    },
    plugins: {
      legend: { position: "bottom" },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<'bar'>): string => {
            const value = context.raw as number;
            const epicIndex = context.dataIndex;
            const statusLabel = context.dataset.label as string;
            const status = epicData.epics[epicIndex].statuses.find(
              (s) => s.status === statusLabel
            );
            const percentage = status ? status.percent : 0;
            return `${statusLabel}: ${value} (${percentage.toFixed(1)}%)`;
          },
        },
      },
    },
  };

  // Assignee Chart (Horizontal Bar for Workload)
  const assigneeWorkload: { [key: string]: { displayName: string; taskCount: number; taskPercent: number } } = {};
  assigneeData.sprints.forEach((sprint) => {
    sprint.assignees.forEach((assignee) => {
      if (!assigneeWorkload[assignee.userID]) {
        assigneeWorkload[assignee.userID] = {
          displayName: assignee.displayName,
          taskCount: 0,
          taskPercent: 0,
        };
      }
      assigneeWorkload[assignee.userID].taskCount += assignee.taskCount;
    });
  });

  const totalTasks = Object.values(assigneeWorkload).reduce((sum, a) => sum + a.taskCount, 0);
  Object.values(assigneeWorkload).forEach((a) => {
    a.taskPercent = totalTasks ? (a.taskCount / totalTasks) * 100 : 0;
  });

  const assigneeChartData = {
    labels: Object.values(assigneeWorkload).map((a) => a.displayName),
    datasets: [
      {
        label: "Tasks",
        data: Object.values(assigneeWorkload).map((a) => a.taskCount),
        backgroundColor: ["#6B7280", "#10B981", "#3B82F6"],
      },
    ],
  };

  const assigneeOptions: ChartOptions<'bar'> = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { max: totalTasks },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<'bar'>): string => {
            const value = context.raw as number;
            const percentage = Object.values(assigneeWorkload)[context.dataIndex].taskPercent;
            return `${context.label}: ${value} (${percentage.toFixed(1)}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-[calc(100vh-10rem)] overflow-x-auto overflow-y-scroll p-3 scrollbar-hide">
        {/* Epic Chart (Stacked Horizontal Bar) */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Epic Progress</h2>
          <p className="text-sm text-gray-600 mb-4">See how your epics are progressing at a glance.</p>
          <div className="h-64">
            <Bar data={epicChartData} options={epicOptions} />
          </div>
        </div>

        {/* Assignee Chart (Horizontal Bar) */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Team Workload</h2>
          <p className="text-sm text-gray-600 mb-4">Monitor the capacity of your team.</p>
          <div className="h-64">
            <Bar data={assigneeChartData} options={assigneeOptions} />
          </div>
        </div>

        {/* Status Chart (Pie) */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Task Status</h2>
          <p className="text-sm text-gray-600 mb-4">See the overall status of tasks in the project.</p>
          <div className="h-64">
            <Pie data={statusChartData} options={statusOptions} />
          </div>
          <p className="mt-2 text-center">Total: {statusData.totalCount}</p>
        </div>

        {/* Priority Chart (Stacked Horizontal Bar) */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Priority Breakdown</h2>
          <p className="text-sm text-gray-600 mb-4">Get a holistic view of how work is being prioritized.</p>
          <div className="h-64">
            <Bar data={priorityChartData} options={priorityOptions} />
          </div>
        </div>

        {/* Type Chart (Horizontal Bar) */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Types of Work</h2>
          <p className="text-sm text-gray-600 mb-4">Get a breakdown of issues by their types.</p>
          <div className="h-64">
            <Bar data={typeChartData} options={typeOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}