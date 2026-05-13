import { NextRequest, NextResponse } from 'next/server';
import { getSections } from '@/lib/data';

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'OpenAI API key not configured' },
      { status: 500 }
    );
  }

  const body = await request.json();
  const { sectionId } = body;

  if (!sectionId || typeof sectionId !== 'number') {
    return NextResponse.json(
      { error: 'sectionId (number) is required' },
      { status: 400 }
    );
  }

  const sections = getSections();
  const section = sections.find((s) => s.id === sectionId);

  if (!section) {
    return NextResponse.json({ error: 'Section not found' }, { status: 404 });
  }

  const prompt = `Write a compelling "road story" for Day ${section.id} of the Menalon Trail hike in Greece.

Section: ${section.from} → ${section.to}
Distance: ${section.distance} km
Duration: ${section.duration} hours
Difficulty: ${section.difficulty}/5
Elevation gain: ${section.elevationGain}m, loss: ${section.elevationLoss}m
Highest point: ${section.highestPoint}m
Highlights: ${section.highlights.join(', ')}
Description: ${section.description}

Write in second person ("you"), present tense, travel-blog style. Include:
1. A vivid opening paragraph setting the scene for the day
2. Key moments and highlights along the way
3. What the terrain feels like underfoot
4. Historical or cultural context where relevant
5. Tips for the hiker (water, timing, photo spots)
6. A closing paragraph about arriving at ${section.to}

Keep it around 400-500 words. Make it inspiring but practical.`;

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content:
              'You are a travel writer specializing in hiking and outdoor adventures in Greece. Write vivid, practical trail narratives.',
          },
          { role: 'user', content: prompt },
        ],
        max_tokens: 1000,
        temperature: 0.8,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error?.message || 'OpenAI API error');
    }

    const data = await res.json();
    const story = data.choices[0]?.message?.content || '';

    return NextResponse.json({ story });
  } catch (error) {
    console.error('Story generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate story' },
      { status: 500 }
    );
  }
}
