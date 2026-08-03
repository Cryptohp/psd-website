import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import SuccessPage from "./SuccessPage";

export default async function ThankYouPage({ params }: { params: Promise<{ slug: string; token: string }> }) {
  const { slug, token } = await params;
  const guest = await prisma.guest.findFirst({
    where: { publicToken: token, event: { slug }, isActive: true },
    include: { event: true, rsvp: true },
  });
  if (!guest || !guest.rsvp) notFound();
  return <SuccessPage guest={guest} event={guest.event} rsvp={guest.rsvp} />;
}
