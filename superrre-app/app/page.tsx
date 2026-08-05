import { Header } from "@/components/app/Header";
import { Hero } from "@/components/app/Hero";
import { Problema } from "@/components/app/Problema";
import { Agitacion } from "@/components/app/Agitacion";
import { Solucion } from "@/components/app/Solucion";
import { AppPorDentro } from "@/components/app/AppPorDentro";
import { Oferta } from "@/components/app/Oferta";
import { Garantia } from "@/components/app/Garantia";
import { Faq } from "@/components/app/Faq";
import { CtaFinal } from "@/components/app/CtaFinal";
import { Footer } from "@/components/app/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Problema />
        <Agitacion />
        <Solucion />
        <AppPorDentro />
        <Oferta />
        <Garantia />
        <Faq />
        <CtaFinal />
      </main>
      <Footer />
    </>
  );
}
