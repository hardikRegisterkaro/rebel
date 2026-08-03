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
