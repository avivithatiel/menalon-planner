'use client';

import dynamic from 'next/dynamic';

const WeatherWidget = dynamic(() => import('@/components/Weather/WeatherWidget'), { ssr: false });

interface WeatherWidgetWrapperProps {
  lat: number;
  lon: number;
  villageName: string;
}

export default function WeatherWidgetWrapper(props: WeatherWidgetWrapperProps) {
  return <WeatherWidget {...props} />;
}
