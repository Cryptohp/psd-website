import HeroSection from "@/components/home/HeroSection";
import IntroSection from "@/components/home/IntroSection";
import SectorsSection from "@/components/home/SectorsSection";
import EcosystemSection from "@/components/home/EcosystemSection";
import ProjectsSection from "@/components/home/ProjectsSection";
import StatsSection from "@/components/home/StatsSection";
import SustainabilitySection from "@/components/home/SustainabilitySection";
import NewsSection from "@/components/home/NewsSection";
import PartnersSection from "@/components/home/PartnersSection";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

export default async function HomePage() {
  const companies = await prisma.company.findMany({
    where: { isFeatured: true, isActive: true },
    include: { sector: true },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });

  const featuredCompanies = companies.map(c => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    shortDesc: c.shortDesc,
    logo: c.logo,
    sectorName: c.sector?.name ?? "",
  }));

  return (
    <>
      <HeroSection />
      <IntroSection />
      <SectorsSection />
      <EcosystemSection initialCompanies={featuredCompanies} />
      <ProjectsSection />
      <StatsSection />
      <SustainabilitySection />
      <PartnersSection />
      <NewsSection />
    </>
  );
}
