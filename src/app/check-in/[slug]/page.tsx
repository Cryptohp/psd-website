import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import CheckInScanner from "./CheckInScanner";

export default async function CheckInPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await prisma.event.findUnique({ where: { slug } });
  if (!event) notFound();
  return <CheckInScanner event={{ id: event.id, name: event.name, slug: event.slug }} />;
}
