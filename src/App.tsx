import { useRef, useEffect, useState } from "react";
import { MapPin, Drone, Database, BarChart3, MessageSquareMore } from "lucide-react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

// Geography JSON URL (works in canvas + browsers)
const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json" as const;

// Small helper for fancy gradient text
function GradientText({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 bg-clip-text text-transparent">
      {children}
    </span>
  );
}

function StickyHero() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const maxScroll = window.innerHeight * 2.6; // Adjust based on hero height
      const progress = Math.min(scrolled / maxScroll, 1);
      setScrollProgress(progress);
      
      // Determine which slide to show
      if (progress < 0.33) setCurrentSlide(0);
      else if (progress < 0.66) setCurrentSlide(1);
      else setCurrentSlide(2);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const slides = [
    {
      title: "วางแผนอย่างมั่นใจด้วยระบบที่ทันสมัย",
      subtitle: "GIS • แผนที่ภาษี • สำรวจภาคสนาม",
      icon: MapPin,
    },
    {
      title: "Drone Survey ระดับมืออาชีพ",
      subtitle: "ทำแผนที่ • ประเมินพื้นที่ • วางผัง",
      icon: Drone,
    },
    {
      title: "Digital, e‑Service & Analytics",
      subtitle: "ระบบสารสนเทศ • ระบบจัดเก็บรายได้ • รายงานสถิติ",
      icon: Database,
    },
  ];

  const currentSlideData = slides[currentSlide];
  const Icon = currentSlideData.icon;

  // Calculate transform values based on scroll
  const rotateY = -40 + (scrollProgress * 360);
  const rotateX = 12 - (scrollProgress * 22);
  const scale = 1.3 - (scrollProgress * 0.15);
  const mapOpacity = 0.8 + (scrollProgress * 0.2);

  return (
    <section className="relative h-[360vh] bg-black">
      {/* STICKY STAGE */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Background aura */}
        <div 
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_50%,rgba(40,160,255,0.25),rgba(0,0,0,0.9))]"
          style={{ opacity: 0.2 + (scrollProgress * 0.4) }}
        />

        {/* Grid background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:80px_80px]" />
        </div>

        {/* Background map - Centered and behind content */}
        <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: '1600px' }}>
          <div
            className="w-[min(90vw,1000px)] h-[min(50vh,500px)] transition-transform duration-75 ease-out"
            style={{
              transform: `rotateY(${rotateY}deg) rotateX(${rotateX}deg) scale(${scale})`,
            }}
          >
            <div 
              className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 blur-3xl"
              style={{ opacity: 0.25 + (scrollProgress * 0.65) }}
            />
            <div className="relative h-full w-full overflow-hidden rounded-2xl border border-white/5 bg-slate-900/30 backdrop-blur-sm">
              <ComposableMap
                projection="geoMercator"
                projectionConfig={{
                  scale: 120,
                  center: [0, 30],
                }}
                className="h-full w-full"
                style={{ opacity: mapOpacity }}
              >
                <Geographies geography={GEO_URL}>
                  {({ geographies }) =>
                    geographies.map((geo) => (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill="rgba(255,255,255,0.12)"
                        stroke="rgba(255,255,255,0.25)"
                        strokeWidth={0.5}
                        style={{
                          default: { outline: "none" },
                          hover: { outline: "none", fill: "rgba(0,200,255,0.25)" },
                          pressed: { outline: "none" },
                        }}
                      />
                    ))
                  }
                </Geographies>
              </ComposableMap>
            </div>
          </div>
        </div>

        {/* Content overlay - Now in front of map */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center z-10">
          <div className="w-full max-w-4xl px-6 text-center transition-all duration-500 ease-out">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/20 px-4 py-2 backdrop-blur-md">
              <Icon className="h-4 w-4 text-white" />
              <span className="text-xs tracking-wide text-white/90">AGIS MAP</span>
            </div>
            <h1 className="mt-4 text-[clamp(32px,5vw,72px)] font-semibold leading-[1.1] drop-shadow-2xl transition-all duration-500 ease-out">
              <GradientText>{currentSlideData.title}</GradientText>
            </h1>
            <p className="mt-3 text-base text-white/90 md:text-lg drop-shadow-lg transition-all duration-500 ease-out">
              {currentSlideData.subtitle}
            </p>
          </div>
        </div>

        {/* Scroll tip */}
        <div className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 pointer-events-none">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60 animate-bounce">
            เลื่อนลงเพื่อดูรายละเอียด
          </div>
        </div>

        {/* Top nav overlay */}
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between px-6 py-5 md:px-10">
          <div className="pointer-events-auto select-none text-sm font-medium tracking-wide text-white/80">
            บริษัท เอจิส แม็พ จำกัด <span className="mx-2 text-white/30">•</span> AGIS MAP CO., LTD.
          </div>
          <div className="pointer-events-auto hidden gap-3 md:flex">
            <a href="#services" className="rounded-full bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20">บริการ</a>
            <a href="#contact" className="rounded-full bg-cyan-500 px-4 py-2 text-sm font-medium text-black hover:bg-cyan-400">ติดต่อเรา</a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Services() {
  const items = [
    {
      icon: MapPin,
      title: "ระบบสารสนเทศภูมิศาสตร์ (GIS) & แผนที่ภาษี",
      th: `รับจัดทำระบบสารสนเทศภูมิศาสตร์ แผนที่ภาษี และงานสำรวจภาคสนาม เพื่อสนับสนุนการบริหารจัดการทรัพย์สินและทรัพยากรของหน่วยงานราชการ องค์กรปกครองส่วนท้องถิ่น และภาคเอกชน` ,
      en: `GIS platforms, cadastral/tax maps, and field surveys for asset/resource management across government and private sectors.`,
    },
    {
      icon: Drone,
      title: "Drone Survey",
      th: `สำรวจและจัดทำข้อมูลด้วยอากาศยานไร้คนขับ (Drone Survey) เพื่อการทำแผนที่ ประเมินพื้นที่ การวางผัง และการบริหารจัดการทรัพย์สินของหน่วยงานและธุรกิจเอกชน`,
      en: `Professional UAV mapping for planning, area assessment, and asset management.`,
    },
    {
      icon: Database,
      title: "ดิจิทัลแพลตฟอร์ม & e‑Service",
      th: `พัฒนาระบบดิจิทัลและงานคอมพิวเตอร์ เช่น เอกสารอิเล็กทรอนิกส์ โปรแกรมประยุกต์ ระบบ e‑Service และเครื่องมืออัตโนมัติสำหรับการจัดการข้อมูล`,
      en: `Digital systems: e‑documents, applications, e‑Services, and automation tools for data operations.`,
    },
    {
      icon: BarChart3,
      title: "ซอฟต์แวร์สำเร็จรูปเพื่อองค์กร",
      th: `พัฒนาซอฟต์แวร์สำเร็จรูป เช่น โปรแกรมจัดเก็บค่าน้ำประปา ค่าขยะมูลฝอย ระบบจัดเก็บรายได้ และงานบริการสาธารณะ/เชิงพาณิชย์อื่น ๆ`,
      en: `Ready‑made enterprise apps: utilities billing, revenue collection, and public service suites.`,
    },
    {
      icon: MessageSquareMore,
      title: "ดิจิทัลคอมมูนิเคชัน & LINE OA",
      th: `พัฒนาและให้บริการระบบสื่อสารดิจิทัล เช่น LINE Official Account (LINE OA) แพลตฟอร์มออนไลน์ และระบบแจ้งเตือนอัตโนมัติ เพื่อสนับสนุนงานบริการประชาชน/องค์กร/ธุรกิจ`,
      en: `Digital communications: LINE OA, online platforms, and automated notifications for citizen and business services.`,
    },
    {
      icon: BarChart3,
      title: "ข้อมูล • วิเคราะห์ • สถิติ",
      th: `ด้านนวัตกรรมข้อมูลและซอฟต์แวร์ เพื่อการวิเคราะห์ ประเมินค่า และออกรายงานเชิงสถิติ รองรับทั้งงานท้องถิ่น งานสาธารณะ และภาคเอกชน` ,
      en: `Data innovation & analytics: valuation, dashboards, and statistical reporting.`,
    },
  ];

  return (
    <section id="services" className="relative bg-gradient-to-b from-black to-slate-950 py-24 text-white">
      <div className="mx-auto w-[92%] max-w-6xl">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="text-3xl font-semibold md:text-5xl">
            <GradientText>บริการของเรา</GradientText>
          </h2>
          <p className="mt-4 text-white/70">
            เราพัฒนาระบบสารสนเทศและโซลูชันด้านภูมิสารสนเทศแบบครบวงจร — ตั้งแต่สำรวจพื้นที่ด้วยโดรนจนถึงระบบ e‑Service และรายงานสถิติระดับองค์กร
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((it, idx) => {
            const Icon = it.icon as any;
            return (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:scale-[1.01] hover:bg-white/10"
              >
                <div className="mb-4 inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/10 p-3">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold md:text-xl">{it.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/80">{it.th}</p>
                <p className="mt-2 text-xs text-white/50">{it.en}</p>
                <div className="pointer-events-none absolute -bottom-24 right-0 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl transition-all duration-500 group-hover:bottom-0" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section id="contact" className="relative bg-black py-24 text-white">
      <div className="mx-auto w-[92%] max-w-5xl text-center">
        <h2 className="text-3xl font-semibold md:text-5xl">
          ยกระดับ <GradientText>ข้อมูลของคุณ</GradientText> ให้ไปได้ไกลกว่าเดิม
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-white/70">
          เราช่วยออกแบบ ตั้งค่า และดูแลระบบ GIS • Drone Survey • e‑Service • Analytics ครบวงจร
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <a
            href="mailto:contact@agismap.co.th"
            className="rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-black hover:bg-cyan-400"
          >
            ติดต่อเรา
          </a>
          <a
            href="#services"
            className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white/90 hover:bg-white/10"
          >
            ดูบริการ
          </a>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black font-sans text-white">
      <StickyHero />
      <Services />
      <CTA />
      <footer className="border-t border-white/10 bg-black/80 py-10 text-center text-sm text-white/50">
        บริษัท เอจิส แม็พ จำกัด · AGIS MAP CO., LTD. — © {new Date().getFullYear()}
      </footer>
    </main>
  );
}