import sectionsData from '../../data/sections.json';
import accommodationsData from '../../data/accommodations.json';
import { TrailSection, Accommodation, Village } from '@/types';

export function getSections(): TrailSection[] {
  return sectionsData as TrailSection[];
}

export function getSection(id: number): TrailSection | undefined {
  return getSections().find((s) => s.id === id);
}

export function getAccommodations(): Accommodation[] {
  return accommodationsData as Accommodation[];
}

export function getAccommodationsByVillage(village: string): Accommodation[] {
  return getAccommodations().filter(
    (a) => a.village.toLowerCase() === village.toLowerCase()
  );
}

export function getAccommodationsForSection(sectionId: number): Accommodation[] {
  const section = getSection(sectionId);
  if (!section) return [];
  return getAccommodations().filter(
    (a) =>
      a.village.toLowerCase() === section.from.toLowerCase() ||
      a.village.toLowerCase() === section.to.toLowerCase()
  );
}

export function getVillages(): Village[] {
  const sections = getSections();
  const villageMap = new Map<string, Village>();

  sections.forEach((s) => {
    if (!villageMap.has(s.from)) {
      villageMap.set(s.from, {
        name: s.from,
        coords: s.fromCoords,
        description: '',
        services: [],
      });
    }
    if (!villageMap.has(s.to)) {
      villageMap.set(s.to, {
        name: s.to,
        coords: s.toCoords,
        description: '',
        services: [],
      });
    }
  });

  return Array.from(villageMap.values());
}
