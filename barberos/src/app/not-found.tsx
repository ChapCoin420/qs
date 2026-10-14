import { ButtonLink } from "@/ui/button-link";
import { Container } from "@/ui/container";

export default function NotFound() {
  return (
    <section className="surface-dark grain py-32">
      <Container className="flex flex-col items-start gap-8">
        <p className="eyebrow text-brass">404</p>
        <h1 className="font-display text-5xl font-medium sm:text-6xl">הדף הזה לא נמצא.</h1>
        <p className="text-lg text-linen/85">ייתכן שהקישור שגוי או שהדף הוסר.</p>
        <ButtonLink href="/">חזרה לדף הבית</ButtonLink>
      </Container>
    </section>
  );
}
