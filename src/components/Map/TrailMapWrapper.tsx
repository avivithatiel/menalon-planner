'use client';

import dynamic from 'next/dynamic';
import { TrailSection, Village } from '@/types';

const TrailMap = dynamic(() => import('@/components/Map/TrailMap'), { ssr: false });

interface TrailMapWrapperProps {
  sections: TrailSection[];
  villages: Village[];
  selectedSection?: number;
}

export default function TrailMapWrapper(props: TrailMapWrapperProps) {
  return <TrailMap {...props} />;
}
