import type { WorkloadLevel } from '../types/dashboard'

export function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

export function getWorkloadLevel(workload: number): WorkloadLevel {
  if (workload < 50) return 'low'
  if (workload < 80) return 'normal'
  return 'high'
}

export const workloadLabels: Record<WorkloadLevel, string> = {
  low: '低負載',
  normal: '正常',
  high: '高負載',
}
