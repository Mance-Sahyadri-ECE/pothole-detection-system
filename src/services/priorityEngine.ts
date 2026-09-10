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
  let basePriority: PriorityLevel = 'LOW';

  if (severity === 'SEVERE') {
    if (trafficLevel === 'HIGH') {
      basePriority = 'CRITICAL';
    } else {
      basePriority = 'HIGH';
    }
  } else if (severity === 'MODERATE') {
    if (trafficLevel === 'HIGH') {
      basePriority = 'HIGH';
    } else {
      basePriority = 'MEDIUM';
    }
  } else {
    // NORMAL
    basePriority = 'LOW';
  }

  // Escalation if citizen complaints are high
  if (complaintCount >= 3) {
    if (basePriority === 'LOW') basePriority = 'MEDIUM';
    else if (basePriority === 'MEDIUM') basePriority = 'HIGH';
    else if (basePriority === 'HIGH') basePriority = 'CRITICAL';
  }

  return basePriority;
}

export function getRecommendedAction(severity: SeverityLevel, priority: PriorityLevel): string {
  if (priority === 'CRITICAL' || severity === 'SEVERE') {
    return 'Immediate emergency inspection & road barrier deployment required within 4 hours.';
  }
  if (priority === 'HIGH') {
    return 'Schedule cold-mix asphalt patching within 24-48 hours.';
  }
  if (priority === 'MEDIUM') {
    return 'Add to standard weekly municipality maintenance schedule.';
  }
  return 'Routine road surface monitoring; no urgent repair needed.';
}
