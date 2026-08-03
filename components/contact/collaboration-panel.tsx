import { ContactForm } from "@/components/contact/contact-form";
import { ContactRail } from "@/components/contact/contact-rail";

export function CollaborationPanel() {
  return (
    <section
      id="form"
      aria-label="Start a collaboration"
      className="scroll-mt-24 border-t border-black/[0.08] bg-paper text-light-fg"
    >
      <div className="mx-auto grid grid-cols-1 max-w-(--spacing-shell) items-start gap-[clamp(28px,3vw,40px)] px-6 py-[clamp(64px,10vh,110px)] sm:px-7 lg:grid-cols-[1.18fr_0.82fr]">
        <ContactForm />
        <ContactRail />
      </div>
    </section>
  );
}
