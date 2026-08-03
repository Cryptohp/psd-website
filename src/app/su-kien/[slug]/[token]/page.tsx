import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EventLandingPage from "../EventLandingPage";

export default async function GuestInvitePage({ params }: { params: Promise<{ slug: string; token: string }> }) {
  const { slug, token } = await params;
  const guest = await prisma.guest.findFirst({
    where: { publicToken: token, event: { slug }, isActive: true },
    include: {
      event: { include: { schedules: { orderBy: { sortOrder: "asc" } } } },
      rsvp: true,
    },
  });
  if (!guest || guest.event.status === "DRAFT") notFound();
  return <EventLandingPage event={guest.event} guest={guest} />;
}
