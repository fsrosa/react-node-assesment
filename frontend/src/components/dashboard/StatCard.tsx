import { Users, CheckSquare, Clock, AlertTriangle } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  icon: string;
  color: string;
}

const iconMap = {
  Users,
  CheckSquare,
  Clock,
  AlertTriangle,
};

export default function StatCard({ title, value, icon, color }: StatCardProps) {
  const Icon = iconMap[icon as keyof typeof iconMap];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
} 