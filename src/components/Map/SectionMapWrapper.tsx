'use client';

import dynamic from 'next/dynamic';
import { TrailSection, Accommodation } from '@/types';

const SectionMap = dynamic(() => import('@/components/Map/SectionMap'), { ssr: false });

interface SectionMapWrapperProps {
  section: TrailSection;
  accommodations?: Accommodation[];
}

export default function SectionMapWrapper(props: SectionMapWrapperProps) {
  return <SectionMap {...props} />;
}
