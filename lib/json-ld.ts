import { SITE } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

/**
 * Serialize a JSON-LD object for injection into a <script> tag.
 *
 * `JSON.stringify` alone is not safe here: a `<` in any string value — most
 * plausibly a literal `</script>` inside FAQ copy — closes the tag early and
 * turns the remainder of the payload into live markup. Escaping `<` as its
 * unicode form keeps the JSON semantically identical while making that
 * impossible. `&` is escaped too so the output can't be re-interpreted as an
 * HTML entity.
 */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

/**
 * Site-wide identity. Lets search engines tie the domain, the logo, the
 * contact address and the LinkedIn profile to one entity rather than guessing.
 */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE.name,
    url: SITE_URL,
    logo: `${SITE_URL}/brand/logo.svg`,
    description: SITE.tagline,
    email: SITE.email,
    telephone: SITE.phone,
    sameAs: [SITE.linkedinHref],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: SITE.email,
      telephone: SITE.phone,
      url: `${SITE_URL}/contact`,
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE.name,
    url: SITE_URL,
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

/**
 * Breadcrumb trail for a sub-page. Pass the same crumbs the page shows
 * visually — search results render this as the path under the title.
 */
export function breadcrumbJsonLd(crumbs: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${SITE_URL}${crumb.path}`,
    })),
  };
}

type Faq = { question: string; answer: string };

/** Shared FAQPage builder — every page's FAQ block has the same shape. */
export function faqPageJsonLd(faqs: readonly Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}
