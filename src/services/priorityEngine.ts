import { PriorityLevel, SeverityLevel, TrafficLevel } from '../types';

/**
 * Calculates the automated repair priority based on pothole severity,
 * traffic intensity, and public complaint density.
 * 
 * Matrix:
 * - SEVERE + HIGH TRAFFIC => CRITICAL
 * - SEVERE + NORMAL/MEDIUM => HIGH
 * - MODERATE + HIGH TRAFFIC => HIGH
 * - MODERATE + NORMAL/LOW => MEDIUM
 * - NORMAL => LOW
 * 
 * Modifiers:
 * - If public complaints >= 3, priority escalates by 1 rank (e.g., HIGH -> CRITICAL).
 */
export function calculatePriority(
  severity: SeverityLevel,
  trafficLevel: TrafficLevel = 'NORMAL',
  complaintCount: number = 0
): PriorityLevel {
  if (severity === 'NORMAL') {
    return 'NONE';
  }

  let basePriority: PriorityLevel = 'MEDIUM';

  if (severity === 'SEVERE') {
    basePriority = trafficLevel === 'HIGH' ? 'CRITICAL' : 'HIGH';
  } else if (severity === 'HIGH') {
    basePriority = 'HIGH';
  } else if (severity === 'MODERATE') {
    basePriority = trafficLevel === 'HIGH' ? 'HIGH' : 'MEDIUM';
  }

  // Escalation if citizen complaints are high
  if (complaintCount >= 3) {
    if (basePriority === 'MEDIUM') basePriority = 'HIGH';
    else if (basePriority === 'HIGH') basePriority = 'CRITICAL';
  }

  return basePriority;
}

export function getRecommendedAction(severity: SeverityLevel, priority: PriorityLevel): string {
  if (severity === 'NORMAL' || priority === 'NONE') {
    return 'Road surface in optimal condition. No repair action required.';
  }
  if (priority === 'CRITICAL' || severity === 'SEVERE') {
    return 'Immediate emergency inspection & road barrier deployment required within 4 hours.';
  }
  if (priority === 'HIGH' || severity === 'HIGH') {
    return 'Schedule cold-mix asphalt patching within 24 hours.';
  }
  if (priority === 'MEDIUM' || severity === 'MODERATE') {
    return 'Add to standard weekly municipality maintenance schedule.';
  }
  return 'Routine road surface monitoring; no urgent repair needed.';
}
