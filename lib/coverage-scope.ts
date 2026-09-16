// Nearby places mentioned in the existing content, without confirmed routine coverage.
export const availabilityDependentLocations = ["La Cruz", "Cachagua", "Zapallar"];

export function isRoutineCoverage(location: string): boolean {
  return !availabilityDependentLocations.includes(location);
}

export function coverageLocationLabel(location: string): string {
  return isRoutineCoverage(location) ? location : `${location} (sujeto a disponibilidad)`;
}
