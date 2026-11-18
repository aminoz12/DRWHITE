import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import SectionHeading from "@/app/components/SectionHeading";
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
      title: `${policy.title} | CLINIWHITE`,
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
      <main id="main-content" className="px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[14rem_1fr] lg:gap-16">
          {/* Contents: sticks beside the text on desktop */}
          <nav aria-label="On this page" className="hidden lg:block">
            <div className="sticky top-[calc(var(--header-h,64px)+2rem)] transition-[top] duration-300">
              <p className="type-eyebrow text-gray-500">On this page</p>
              <ol className="mt-4 space-y-2.5 border-l border-gray-200">
                {policy.sections.map((section, i) => (
                  <li key={section.heading}>
                    <a
                      href={`#section-${i + 1}`}
                      className="-ml-px block border-l border-transparent pl-4 text-sm leading-snug text-gray-600 transition-colors hover:border-grape hover:text-grape"
                    >
                      {section.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </nav>

          <article className="max-w-3xl">
            <SectionHeading as="h1" eyebrow="Legal" className="mb-3" title={policy.title} />
            <p className="mb-8 text-sm text-gray-600">Last updated: {POLICY_LAST_UPDATED}</p>

            <p className="mb-10 text-base leading-relaxed text-gray-700 md:text-lg">{policy.intro}</p>

            <div className="space-y-10">
              {policy.sections.map((section, i) => (
                <section key={section.heading} id={`section-${i + 1}`} className="scroll-mt-28 border-t border-gray-200 pt-8">
                  <h2 className="mb-3 font-display font-wide text-lg font-extrabold uppercase tracking-wide text-grape">
                    {section.heading}
                  </h2>
                  <div className="space-y-3">
                    {section.body.map((paragraph, j) => (
                      <p key={j} className="text-base leading-relaxed text-gray-600 md:text-base">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
