"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Phone,
  Mail,
  Linkedin,
} from "lucide-react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import dynamic from 'next/dynamic';
import InteractiveMap from './InteractiveMap';

// Dynamically import the Spirograph component with no SSR
const Spirograph = dynamic(() => import('./Spirograph'), {
  ssr: false
});

export default function LawFirmHomepage() {
  const servicesRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [currentClientIndex, setCurrentClientIndex] = useState(0);
  const [activeSection, setActiveSection] = useState("");
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const images = [
    "/images/legal-consultation.jpg",
    "/images/contract-review.jpg",
    "/images/court-representation.jpg",
    "/images/corporate-law.jpg",
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (servicesRef.current && stickyRef.current) {
        const servicesRect = servicesRef.current.getBoundingClientRect();
        const stickyRect = stickyRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        const scrollProgress =
          (window.scrollY - servicesRect.top) /
          (servicesRect.height - windowHeight);
        const clampedProgress = Math.max(0, Math.min(1, scrollProgress));

        const imageIndex = Math.floor(clampedProgress * images.length);
        setCurrentImageIndex(Math.min(imageIndex, images.length - 1));
      }

      const sections = ["home", "services", "countries", "clients", "contact"];
      let current = "";
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && window.scrollY >= element.offsetTop - 100) {
          current = section;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, [images.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentClientIndex(
        (prevIndex) => (prevIndex + 1) % (clients.length - 2)
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const teamMembers = [
    {
      name: "Marián Čuprík",
      role: "Advokát",
      description:
        "Marián Čuprík, v advokátskej kancelárii SKALLARS®, sa špecializuje na korporátne, technologické právo a ochranu duševného vlastníctva, s dôrazom na nové technológie.",
      phone: "+421 949 110 446",
      email: "cuprik@skallars.sk",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Maria%CC%81n%20C%CC%8Cupri%CC%81k-9zF7Dkbxqk0u4RVyBSMfbZZaXf4fXk.jpg",
    },
    {
      name: "Martin Žák",
      role: "Advokát",
      description:
        "Martin Žák je skúsený advokát v SKALLARS®, špecializujúci sa na obchodné právo a medzinárodné transakcie.",
      phone: "+421 123 456 789",
      email: "zak@skallars.sk",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Martin%20Z%CC%8Ca%CC%81k-wuaynP4mw11iW5cYwB5nKEaJvFwBlh.jpg",
    },
    {
      name: "Juraj Hudák",
      role: "Advokát",
      description:
        "Juraj Hudák je v advokátskej kancelárii SKALLARS® zameraním na litigácie, zmluvné právo a pracovné právo.",
      phone: "+421 917 580 442",
      email: "hudak@skallars.sk",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/JH_dark-USHq2kdwHiMPCT2em1Zj2DZer2raMo.jpg",
    },
    {
      name: "Dominic Ye",
      role: "Partnerský advokát SKALLARS® pre Čínu",
      description:
        "Dominic Ye, partnerský advokát SKALLARS® pre Čínu, ponúka poradenstvo v oblasti cezhraničných obchodných transakcií a riešenia sporov. Disponuje hlbokými znalosťami v oblasti čínskeho práva a poskytuje právnu podporu pri medzinárodných investičných projektoch v Ázii.",
      phone: "0905 444 444",
      email: "ye@skallars.sk",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/img-dy-2-KgydSWygusjb6XI7tw5yi7Oif17dz1.png",
    },
  ];

  const officeInfo = {
    Slovakia: {
      city: "Bratislava",
      address: "Staré Grunty 18, 841 04 Bratislava",
      phone: "+421 2 123 456 789",
    },
    "Czech Republic": {
      city: "Prague",
      address: "Václavské náměstí 1, 110 00 Prague",
      phone: "+420 2 987 654 321",
    },
    Austria: {
      city: "Vienna",
      address: "Stephansplatz 1, 1010 Vienna",
      phone: "+43 1 234 567 890",
    },
  };

  const legalServices = [
    {
      title: "Obchodné právo a obchodné spoločnosti",
      description:
        "Riešenie komplexných otázok obchodného práva a obchodných spoločností si vyžaduje odbornosť a precíznosť. Poskytujeme poradenstvo v oblasti zakladania spoločností, korporátneho riadenia, zmlúv, fúzií a akvizícií, ako aj pri dodržiavaní regulačných požiadaviek, aby vaše podnikanie prosperovalo v dynamickom prostredí.",
    },
    {
      title: "Zmluvné právo",
      description:
        "Zmluvy sú základom úspešných obchodných vzťahov. Pripravujeme, posudzujeme a vyjednávame zmluvy prispôsobené vašim potrebám, aby sme chránili vaše záujmy a minimalizovali riziká.",
    },
    {
      title: "Súdne spory",
      description:
        "Pri vzniku sporov sme vašimi spoľahlivými obhajcami. Naši skúsení právnici zastupujú vaše záujmy pred súdmi a poskytujú strategické poradenstvo a pevnú reprezentáciu s cieľom dosiahnuť čo najlepší výsledok.",
    },
    {
      title: "Pracovné právo",
      description:
        "Orientácia v oblasti pracovného práva si vyžaduje hlboké znalosti predpisov a osvedčených postupov. Radíme v otázkach pracovných zmlúv, vzťahov so zamestnancami, ukončenia pracovného pomeru a dodržiavania právnych predpisov, aby sme chránili vaše podnikanie a podporili pozitívne pracovné prostredie.",
    },
    {
      title: "IT a ochrana osobných údajov",
      description:
        "V digitálnej dobe je ochrana osobných údajov kľúčová. Poskytujeme odborné poradenstvo v oblasti ochrany údajov, kybernetickej bezpečnosti, IT zmlúv a riešenia incidentov s narušením údajov, aby sme zaistili, že vaše podnikanie spĺňa všetky právne požiadavky a chráni citlivé informácie.",
    },
    {
      title: "Duševné vlastníctvo",
      description:
        "Duševné vlastníctvo je cenným aktívom každej spoločnosti. Pomáhame chrániť vaše ochranné známky, patenty, autorské práva a obchodné tajomstvá prostredníctvom registrácie, licencovania a presadzovania, aby sme maximalizovali hodnotu vašich inovatívnych riešení a tvorivých diel.",
    },
    {
      title: "Umelá inteligencia",
      description:
        "Nárast umelej inteligencie prináša jedinečné právne výzvy a príležitosti. Poskytujeme poradenstvo v oblasti regulácie AI, etických aspektov, ochrany údajov a duševného vlastníctva, aby sme vám pomohli orientovať sa v tomto vznikajúcom odvetví a zodpovedne využívať jeho potenciál.",
    },
    {
      title: "Nehnuteľnosti",
      description:
        "Transakcie s nehnuteľnosťami si vyžadujú precízne plánovanie a právnu odbornosť. Poskytujeme komplexné právne služby pri nadobúdaní, vývoji, financovaní, prenájme a predaji nehnuteľností, aby sme zaistili ochranu vašich investícií a hladký priebeh transakcií.",
    },
  ];

  const clients = [
    {
      name: "Atwix",
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/atwix-logo-1-nqwscZvYv6GmXUsvK2dgCvdAF9TZWU.svg",
    },
    {
      name: "SCP Papier",
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/scp_papier_prezent-hH9Q8APq9ofBmMLUggYlZ7YFmExQea.png",
    },
    {
      name: "Slovensko Digital",
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/slovensko-digital-CLp8NvlmCCBIjIN559Yq7IVQ665rYq.jpg",
    },
    {
      name: "Charlie Works",
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images-64s2FvF4TbdI8frlhKRtGOeBGePf96.png",
    },
    {
      name: "HDTS",
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hdts_logo-Jbgson7Wd0Wme5cPDwsS40BRI3Botr.jpg",
    },
    {
      name: "Austin Powder",
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo_vertical_preview-Lt8kOqgk0t7CDzHYIcKKUKxTFZWvHo.jpg",
    },
    {
      name: "ORKA Systems",
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/364754313_599272232380150_8261527438069510069_n-Ucos6zlKH62k6i9jEMOJxpioyidPRv.jpg",
    },
    {
      name: "Inovačné centrum Košického kraja",
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ICKK-Logo_NEW_yellow-and-black-3-2-pRYmi5u2fYkl6EWp3ZsYxHprDDT63e.png",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Spirograph />
      <header className="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-dark-G5tVbs8tg8buqtWwaFJjCCudUb9tJa.svg"
            alt="SKALLARS Logo"
            className="h-10"
          />
          <nav>
            <ul className="flex space-x-6">
              <li>
                <button
                  onClick={() => scrollToSection("home")}
                  className={`text-[#210059] hover:text-[#210059]/80 font-bold ${
                    activeSection === "home"
                      ? "border-b-2 border-[#210059]"
                      : ""
                  }`}
                >
                  Skallars
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("services")}
                  className={`text-[#210059] hover:text-[#210059]/80 font-bold ${
                    activeSection === "services"
                      ? "border-b-2 border-[#210059]"
                      : ""
                  }`}
                >
                  Služby
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("countries")}
                  className={`text-[#210059] hover:text-[#210059]/80 font-bold ${
                    activeSection === "countries"
                      ? "border-b-2 border-[#210059]"
                      : ""
                  }`}
                >
                  Pôsobenie
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("clients")}
                  className={`text-[#210059] hover:text-[#210059]/80 font-bold ${
                    activeSection === "clients"
                      ? "border-b-2 border-[#210059]"
                      : ""
                  }`}
                >
                  Referencie
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("contact")}
                  className={`text-[#210059] hover:text-[#210059]/80 font-bold  ${
                    activeSection === "contact"
                      ? "border-b-2 border-[#210059]"
                      : ""
                  }`}
                >
                  Kontakt
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main>
        <section
          id="home"
          className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20"
        >
          <div className="container mx-auto px-4 py-20 relative z-10">
            <h1 className="text-7xl font-bold mb-6 text-[#210059]">
              Komplexná právna podpora
              <br />
              <span className="text-6xl font-normal">pre Vaše podnikanie.</span>
            </h1>
            <p className="text-2xl text-gray-600 max-w-3xl">
              V Skallars veríme, že právna pomoc by mala byť{" "}
              <span className="font-semibold">
                transparentná, efektívna a prispôsobená potrebám každého klienta
              </span>
              .
            </p>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-b from-white to-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold mb-10 text-center text-[#210059]">
              Náš tím
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-lg flex flex-col transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2 hover:scale-105"
                >
                  <div className="w-full h-64 mb-4 overflow-hidden rounded">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <h4 className="text-xl font-semibold mb-2 text-[#210059]">
                    {member.name}
                  </h4>
                  <p className="text-gray-600 mb-4">{member.role}</p>
                  <p className="text-sm text-gray-500 mb-4 flex-grow">
                    {member.description}
                  </p>
                  <div className="mt-auto">
                    <div className="flex items-center mb-2">
                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                      <a
                        href={`tel:${member.phone}`}
                        className="text-[#210059] hover:underline"
                      >
                        {member.phone}
                      </a>
                    </div>
                    <div className="flex items-center mb-2">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      <a
                        href={`mailto:${member.email}`}
                        className="text-[#210059] hover:underline"
                      >
                        {member.email}
                      </a>
                    </div>
                    <a href="#" className="text-[#210059] hover:underline">
                      Vizitka
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="services"
          ref={servicesRef}
          className="py-20 bg-gradient-to-b from-gray-100 to-white relative"
        >
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row">
              <div
                ref={stickyRef}
                className="lg:w-1/3 pr-8 lg:sticky lg:top-24 lg:self-start"
                style={{ height: "fit-content" }}
              >
                <h2 className="text-4xl font-bold mb-6 text-[#210059]">
                  Komplexné právne poradenstvo v kľúčových právnych oblastiach
                </h2>
                <p className="text-xl text-gray-600 mb-6">
                  Našim klientom poskytujeme právne poradenstvo vo všetkých
                  kľúčových právnych oblastiach. Cieľom našich právnych služieb
                  je minimalizovať právne riziká na strane klientov a odbremeniť
                  ich od právnych problémov v čo najväčšej miere, aby sa mohli
                  naplno sústrediť na svoje podnikanie.
                </p>
                <div className="relative h-64 rounded-lg overflow-hidden">
                  {images.map((src, index) => (
                    <img
                      key={src}
                      src={src}
                      alt={`Legal service image ${index + 1}`}
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                        index === currentImageIndex
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="lg:w-2/3 mt-8 lg:mt-0">
                <div className="grid grid-cols-1 gap-8">
                  {legalServices.map((service, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-4 bg-white p-6 rounded-lg shadow"
                    >
                      <Check className="text-[#210059] flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="text-xl font-semibold mb-2 text-[#210059]">
                          {service.title}
                        </h3>
                        <p className="text-gray-600">{service.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="countries"
          className="py-20 bg-gradient-to-b from-white to-[#210059] text-white"
        >
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold mb-10 text-center text-[#210059]">
              Krajiny pôsobnosti
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Naši advokáti sú členmi Slovenskej advokátskej komory a Českej
              advokátskej komory. Majú dlhoročné skúsenosti s poskytovaním
              právnych služieb na Slovensku aj v Českej republike.
              Prostredníctvom spolupracujúcej rakúskej advokátskej kancelárie
              podporujeme našich klientov pri riešení právnych záležitostí aj v
              Rakúsku.
            </p>
            <InteractiveMap />
          </div>
        </section>

        <section id="clients" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-1/2 mb-10 md:mb-0">
                <h3 className="text-sm font-medium text-green-400 mb-2">
                  Klienti
                </h3>
                <h2 className="text-4xl md:text-5xl font-bold text-[#210059] mb-4">
                  Sme hrdí na dôveru,
                  <span className="block text-2xl md:text-3xl font-normal mt-2">
                    ktorú nám prejavujú naši klienti z rôznych odvetví
                  </span>
                </h2>
              </div>
              <div className="md:w-1/2 relative h-32 overflow-hidden">
                <div
                  className="absolute inset-0 flex items-center justify-between transition-transform duration-500 ease-in-out"
                  style={{
                    transform: `translateX(-${currentClientIndex * 33.33}%)`,
                  }}
                >
                  {clients.map((client, index) => (
                    <div key={index} className="w-1/3 px-4 flex-shrink-0">
                      <img
                        src={client.logo}
                        alt={`${client.name} logo`}
                        className="max-w-full h-auto"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-b from-[#210059] to-gray-900 text-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold mb-10 text-center">Novinky</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title:
                    "NAŠI KLIENTI MÔŽU VYUŽIŤ PEČIATKU CHZ NA FAKTÚRY PROTI NEPLATIČOM",
                  excerpt:
                    'Tento rozhovor sa bude odohrávať v obklopení dizajnu, množstva „koní" a skvelej kávy. Majiteľovi pd drive clubu sa podarilo vytvoriť miesto, ktoré si zamilujú všetci milovníci áut a',
                  image:
                    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop",
                },
                {
                  title:
                    "STRAVOVANIE ZAMESTNANCOV Z POHĽADU ZÁKONA O DANI Z PRÍJMOV",
                  excerpt:
                    'Tento rozhovor sa bude odohrávať v obklopení dizajnu, množstva „koní" a skvelej kávy. Majiteľovi pd drive clubu sa podarilo vytvoriť miesto, ktoré si zamilujú všetci milovníci áut a',
                  image:
                    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop",
                },
                {
                  title: "Zdanenie osobného dôchodkového produktu",
                  excerpt:
                    'Tento rozhovor sa bude odohrávať v obklopení dizajnu, množstva „koní" a skvelej kávy. Majiteľovi pd drive clubu sa podarilo vytvoriť miesto, ktoré si zamilujú všetci milovníci áut a',
                  image:
                    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop",
                },
              ].map((post, index) => (
                <div
                  key={index}
                  className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2 hover:scale-105"
                >
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-4">{post.title}</h3>
                    <p className="text-gray-300 mb-4">{post.excerpt}</p>
                    <a href="#" className="text-[#210059] hover:underline">
                      Čítať viac
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer id="contact" className="bg-gray-900 text-white py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo_white-oudH0EnuPhJanLlxguzBXMippVasLU.svg"
              alt="SKALLARS Logo"
              className="h-10 mb-4 md:mb-0"
            />
            <div className="flex space-x-4">
              <a href="#" className="hover:text-gray-300">
                <Linkedin />
              </a>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Kontakt</h3>
              <p>Staré Grunty 18</p>
              <p>841 04 Bratislava</p>
              <a href="mailto:skallars@skallars.sk" className="hover:underline">
                skallars@skallars.sk
              </a>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Služby</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:underline">
                    Obchodné právo
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Zmluvné právo
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Súdne spory
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Pracovné právo
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Riešenia</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:underline">
                    IT a ochrana osobných údajov
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Duševné vlastníctvo
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Umelá inteligencia
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Nehnuteľnosti
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Novinky</h3>
              <form className="flex flex-col space-y-2">
                <input
                  type="email"
                  placeholder="Váš email"
                  className="px-4 py-2 bg-gray-800 rounded"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#210059] text-white rounded hover:bg-[#210059]/80"
                >
                  Odoberať
                </button>
              </form>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center">
            <p>
              &copy; 2023 Advokátska kancelária SKALLARS®. Všetky práva
              vyhradené.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
