import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { POLICIES, getPolicy, POLICY_LAST_UPDATED } from "@/lib/legalContent";
import { SITE_URL } from "@/lib/siteConfig";

export function generateStaticParams() {
  return POLICIES.map((p) => ({ slug: p.slug }));
}

interface PolicyPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PolicyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const policy = getPolicy(slug);
  if (!policy) return { title: "Not Found" };
  const canonical = `${SITE_URL}/policies/${policy.slug}`;
  return {
    title: policy.title,
    description: policy.description,
    alternates: { canonical },
    openGraph: {
      title: `${policy.title} | CLINI WHITE`,
      description: policy.description,
      url: canonical,
    },
  };
}

export default async function PolicyPage({ params }: PolicyPageProps) {
  const { slug } = await params;
  const policy = getPolicy(slug);
  if (!policy) notFound();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="py-16 md:py-24 px-4">
        <article className="max-w-3xl mx-auto">
          <p className="text-[#231b50] text-xs font-black tracking-[0.3em] uppercase mb-4">
            Legal
          </p>
          <h1 className="font-display text-3xl md:text-4xl font-extrabold text-black tracking-tight mb-3">
            {policy.title}
          </h1>
          <p className="text-xs text-gray-400 mb-8">Last updated: {POLICY_LAST_UPDATED}</p>

          <p className="text-base text-gray-700 leading-relaxed mb-10">{policy.intro}</p>

          <div className="space-y-10">
            {policy.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="font-display text-lg font-extrabold text-[#231b50] uppercase tracking-wide mb-3">
                  {section.heading}
                </h2>
                <div className="space-y-3">
                  {section.body.map((paragraph, i) => (
                    <p key={i} className="text-sm md:text-base text-gray-600 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
