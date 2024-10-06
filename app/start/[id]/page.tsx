import { kv } from '@vercel/kv';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Body from '@/components/Body';

interface ResumeData {
  feedback: string;
  audioUrl?: string;
  jobRole?: string;
  jobLevel?: string;
}

async function getResumeData(id: string): Promise<ResumeData | null> {
  const data = await kv.hgetall<ResumeData>(id);
  return data ? data : null; // Return null if no data found
}

export async function generateMetadata({
  params,
}: {
  params: {
    id: string;
  };
}): Promise<Metadata | undefined> {
  const data = await getResumeData(params.id);
  if (!data) {
    return;
  }

  const title = `Resume Feedback: ${data.jobRole}`;
  const description = `Feedback for the role of ${data.jobRole} at the ${data.jobLevel} level.`;
  const image = data.audioUrl || 'https://example.com/default-image.png'; // Replace with your default image

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: '@your_twitter_handle', // Update with your Twitter handle
    },
  };
}

export default async function Results({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const data = await getResumeData(params.id);
  if (!data) {
    notFound();
  }

  return (
    <Body
      feedback={data.feedback}
      audioUrl={data.audioUrl}
      jobRole={data.jobRole}
      jobLevel={data.jobLevel}
      id={params.id}
    />
  );
}
