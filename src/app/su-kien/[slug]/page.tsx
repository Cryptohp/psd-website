import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EventLandingPage from "./EventLandingPage";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await prisma.event.findUnique({ where: { slug, status: "PUBLISHED" } });
  if (!event) return {};
  return {
    title: event.name + " | PSD Group",
    description: event.description ?? event.name,
    openGraph: { title: event.name, images: event.coverImage ? [event.coverImage] : [] },
  };
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await prisma.event.findUnique({
    where: { slug, status: "PUBLISHED" },
    include: { schedules: { orderBy: { sortOrder: "asc" } } },
  });
  if (!event) notFound();
  return <EventLandingPage event={event} guest={null} />;
}
