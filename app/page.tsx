"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect, useCallback } from "react";

type SafeImageProps = {
  src: string;
  alt: string;
  fallbackLabel?: string;
  className?: string;
  sizes?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
};

function SafeImage({
  src,
  alt,
  fallbackLabel = "Gorsel yuklenemedi",
  className,
  sizes,
  fill = false,
  width,
  height,
  priority,
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#30513f] to-[#1d3729] text-center text-sm text-white/80 p-4">
        {fallbackLabel}
      </div>
    );
  }

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className={className}
        priority={priority}
        onError={() => setHasError(true)}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width ?? 600}
      height={height ?? 400}
      sizes={sizes}
      className={className}
      priority={priority}
      onError={() => setHasError(true)}
    />
  );
}

/** Ana sayfa hero arka planı — sıra: havuz/peyzaj, çim/şehir, gece teras */
const HERO_ARKA_PLAN = [
  "/site-fotolar/hero-ana-1.png",
  "/site-fotolar/hero-ana-2.png",
  "/site-fotolar/hero-ana-3.png",
] as const;

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [menuAcik, setMenuAcik] = useState(false);
  const [heroSlide, setHeroSlide] = useState(0);
  const [navSolid, setNavSolid] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoScrollPosRef = useRef(0);
  const pauseAutoScrollUntilRef = useRef(0);
  const [seciliFotograf, setSeciliFotograf] = useState<string | null>(null);
  const [teklifFormAcik, setTeklifFormAcik] = useState(false);
  const [teklifForm, setTeklifForm] = useState({
    adSoyad: "",
    telefon: "",
    alanTipi: "",
    detay: "",
  });
  const medyaVideoMu = (dosyaAdi: string) => dosyaAdi.toLowerCase().endsWith(".mp4");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (teklifFormAcik) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [teklifFormAcik]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setMenuAcik(false);
  };

  // Otomatik kaydırma; oklar / kullanıcı kaydırması ile konum her karede senkron (scrollLeft üzerine yazılmaz)
  useEffect(() => {
    let animationId: number;
    let isHovered = false;

    const tick = () => {
      const el = carouselRef.current;
      if (el) {
        const pausedByControl = Date.now() < pauseAutoScrollUntilRef.current;
        if (!isHovered && !pausedByControl) {
          const max = el.scrollWidth - el.clientWidth;
          if (max > 0) {
            let next = autoScrollPosRef.current + 0.8;
            if (next >= max - 0.5) next = 0;
            autoScrollPosRef.current = next;
            el.scrollLeft = next;
          }
        } else {
          autoScrollPosRef.current = el.scrollLeft;
        }
      }
      animationId = requestAnimationFrame(tick);
    };

    animationId = requestAnimationFrame(tick);

    const el = carouselRef.current;
    if (!el) {
      return () => cancelAnimationFrame(animationId);
    }

    const handleEnter = () => {
      isHovered = true;
    };
    const handleLeave = () => {
      isHovered = false;
    };

    el.addEventListener("mouseenter", handleEnter);
    el.addEventListener("mouseleave", handleLeave);
    el.addEventListener("touchstart", handleEnter, { passive: true });
    el.addEventListener("touchend", handleLeave);

    return () => {
      cancelAnimationFrame(animationId);
      el.removeEventListener("mouseenter", handleEnter);
      el.removeEventListener("mouseleave", handleLeave);
      el.removeEventListener("touchstart", handleEnter);
      el.removeEventListener("touchend", handleLeave);
    };
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setHeroSlide((i) => (i + 1) % HERO_ARKA_PLAN.length);
    }, 6000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const onScroll = () => setNavSolid(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!seciliFotograf) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSeciliFotograf(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [seciliFotograf]);

  const slide = useCallback((dir: "left" | "right") => {
    const el = carouselRef.current;
    if (!el) return;
    pauseAutoScrollUntilRef.current = Date.now() + 2200;
    const step = Math.max(280, Math.round(el.clientWidth * 0.85));
    el.scrollBy({ left: dir === "left" ? -step : step, behavior: "smooth" });
    autoScrollPosRef.current = el.scrollLeft;
  }, []);

  const oneCikacakNumaralar = [82, 88, 79, 76, 74, 61, 64, 60, 53, 54, 50, 51, 44, 43, 31, 25, 28, 11, 7];
  const tumFotograflar = Array.from({ length: 100 }, (_, i) => `livnipeyzaj_${i + 1}.jpg`);

  // Verilen görseller ilk 19 sırayla birebir yer değiştirir.
  oneCikacakNumaralar.forEach((numara, index) => {
    const hedefIndex = index;
    const kaynakIndex = tumFotograflar.indexOf(`livnipeyzaj_${numara}.jpg`);
    if (kaynakIndex !== -1) {
      [tumFotograflar[hedefIndex], tumFotograflar[kaynakIndex]] = [
        tumFotograflar[kaynakIndex],
        tumFotograflar[hedefIndex],
      ];
    }
  });

  const ekSwapCiftleri: Array<[number, number]> = [
    [1, 54],
    [3, 23],
    [7, 19],
    [8, 55],
    [12, 86],
  ];
  ekSwapCiftleri.forEach(([a, b]) => {
    // Bu aşama pozisyon bazlıdır (1-index): 1. sıradaki ile 54. sıradaki gibi.
    const aIndex = a - 1;
    const bIndex = b - 1;
    if (aIndex >= 0 && bIndex >= 0 && aIndex < tumFotograflar.length && bIndex < tumFotograflar.length) {
      [tumFotograflar[aIndex], tumFotograflar[bIndex]] = [tumFotograflar[bIndex], tumFotograflar[aIndex]];
    }
  });

  const onuncuFotograf = tumFotograflar[9];
  tumFotograflar[9] = "livnipeyzaj_10_video.mp4";
  tumFotograflar.push(onuncuFotograf, "livnipeyzaj_101.png");

  // İstenen ek değişim: 102. sıradaki medya ile 19. sıradaki medyayı yer değiştir.
  [tumFotograflar[18], tumFotograflar[101]] = [tumFotograflar[101], tumFotograflar[18]];

  const sliderPhotos = tumFotograflar.slice(0, 15);

  const linkClass = navSolid
    ? "text-gray-600 hover:text-green-700 transition"
    : "text-white hover:text-white/90 transition drop-shadow-sm";

  const teklifFormGonder = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const mesaj = [
      "Merhaba, teklif formunu doldurdum.",
      `Ad Soyad: ${teklifForm.adSoyad || "-"}`,
      `Telefon: ${teklifForm.telefon || "-"}`,
      `Alan Tipi: ${teklifForm.alanTipi || "-"}`,
      teklifForm.detay ? `Detay: ${teklifForm.detay}` : "",
    ].filter(Boolean).join("\n");
    const url = `https://wa.me/905322251185?text=${encodeURIComponent(mesaj)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setTeklifFormAcik(false);
    setTeklifForm({ adSoyad: "", telefon: "", alanTipi: "", detay: "" });
  };

  const teklifMailGonder = () => {
    const mesaj = [
      "Merhaba, teklif formunu doldurdum.",
      `Ad Soyad: ${teklifForm.adSoyad || "-"}`,
      `Telefon: ${teklifForm.telefon || "-"}`,
      `Alan Tipi: ${teklifForm.alanTipi || "-"}`,
      teklifForm.detay ? `Detay: ${teklifForm.detay}` : "",
    ].filter(Boolean).join("\n");
    const mailto = `mailto:info@livnipeyzaj.com?subject=${encodeURIComponent("Teklif Talebi")}&body=${encodeURIComponent(mesaj)}`;
    window.location.href = mailto;
    setTeklifFormAcik(false);
    setTeklifForm({ adSoyad: "", telefon: "", alanTipi: "", detay: "" });
  };

  return (
      <main className="min-h-screen font-sans">

        {/* NAVBAR — hero ile birleşik: üstte şeffaf, kaydırınca beyaz panel */}
        <nav
          className={`fixed top-0 left-0 right-0 z-50 flex min-h-[80px] items-center justify-between gap-4 px-4 sm:px-6 py-2 transition-all duration-300 ${
            navSolid
              ? "bg-white border-b border-gray-200 shadow-sm"
              : "bg-transparent border-b border-transparent"
          }`}
        >
          <button
            type="button"
            onClick={scrollToTop}
            className={`shrink-0 rounded-full overflow-hidden shadow-lg ring-2 transition flex items-center justify-center p-1.5 sm:p-2 hover:scale-[1.03] active:scale-[0.98] focus:outline-none focus-visible:ring-4 focus-visible:ring-green-500/40 ${
              navSolid ? "ring-gray-200 bg-white" : "ring-white/80 bg-white/95"
            } h-14 w-14 sm:h-[4.5rem] sm:w-[4.5rem]`}
            aria-label="Ana sayfanın en üstüne git"
          >
            <SafeImage
              src="/logo.jpeg"
              alt=""
              width={160}
              height={160}
              className="h-full w-full object-contain"
              fallbackLabel="Livni"
            />
          </button>

          <div className="hidden md:flex flex-wrap items-center justify-end gap-x-6 gap-y-2 text-sm font-medium">
            <button type="button" onClick={scrollToTop} className={linkClass}>
              Ana Sayfa
            </button>
            <a href="#hakkimizda" className={linkClass}>Hakkımızda</a>
            <a href="#hizmetler" className={linkClass}>Hizmetlerimiz</a>
            <Link href="/calismalarimiz" className={linkClass}>Çalışmalarımız</Link>
            <Link href="/referanslar" className={linkClass}>Referanslar</Link>
            <a href="#iletisim" className={linkClass}>İletişim</a>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); setTeklifFormAcik(true); }}
              className={
                navSolid
                  ? "bg-[#183325] text-white px-5 py-2.5 rounded-full hover:bg-[#1d3729] transition shadow-sm whitespace-nowrap"
                  : "bg-white/15 backdrop-blur-md border border-white/35 text-white px-5 py-2.5 rounded-full hover:bg-white/25 transition whitespace-nowrap drop-shadow-sm"
              }
            >
              Teklif İste
            </a>
          </div>

          <button
            type="button"
            className={`lg:hidden text-2xl outline-none p-2 -mr-2 ${navSolid ? "text-gray-700" : "text-white drop-shadow-md"}`}
            onClick={() => setMenuAcik(!menuAcik)}
            aria-expanded={menuAcik}
            aria-label={menuAcik ? "Menüyü kapat" : "Menüyü aç"}
          >
            {menuAcik ? "✕" : "☰"}
          </button>
        </nav>

        {mounted && menuAcik && (
          <div className="fixed top-[80px] left-0 right-0 z-40 bg-white border-b border-gray-100 flex flex-col items-center gap-5 py-6 md:hidden text-gray-700 font-medium shadow-lg">
            <button type="button" onClick={scrollToTop} className="hover:text-green-700 transition">
              Ana Sayfa
            </button>
            <a href="#hakkimizda" onClick={() => setMenuAcik(false)}>Hakkımızda</a>
            <a href="#hizmetler" onClick={() => setMenuAcik(false)}>Hizmetlerimiz</a>
            <Link href="/calismalarimiz" onClick={() => setMenuAcik(false)}>Çalışmalarımız</Link>
            <Link href="/referanslar" onClick={() => setMenuAcik(false)}>Referanslar</Link>
            <a href="#iletisim" onClick={() => setMenuAcik(false)}>İletişim</a>
            <button type="button" onClick={() => { setMenuAcik(false); setTeklifFormAcik(true); }} className="bg-[#183325] text-white px-8 py-3 rounded-full hover:bg-[#1d3729] transition shadow-sm mt-2 w-full font-medium">
              Teklif İste
            </button>
          </div>
        )}

        {/* HERO — üstten başlar; içerik nav altında kalır */}
        <section className="relative min-h-[min(90vh,920px)] flex items-center pt-[5.5rem] sm:pt-24 pb-24 md:pb-32 px-6 text-white overflow-hidden">
          <div className="absolute inset-0 z-0">
            {HERO_ARKA_PLAN.map((src, i) => (
              <div
                key={src}
                className={`absolute inset-0 transition-opacity duration-[1200ms] ease-in-out ${
                  i === heroSlide ? "opacity-100 z-[1]" : "opacity-0 z-0"
                }`}
                aria-hidden={i !== heroSlide}
              >
                <SafeImage
                  src={src}
                  alt=""
                  fill
                  priority={i === 0}
                  sizes="100vw"
                  className="object-cover object-center"
                />
              </div>
            ))}
            <div
              className="absolute inset-0 z-[2] bg-gradient-to-b from-black/60 via-black/45 to-black/35"
              aria-hidden
            />
            {/* Şeffaflık telefon–WhatsApp arasına kadar (globals --hero-fade-start-from-bottom); altı uzun yumuşak beyaz */}
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] max-h-[min(92vh,900px)]"
              style={{
                height:
                  "calc(var(--hero-fade-start-from-bottom) + min(34vh, 380px))",
                background:
                  "linear-gradient(to bottom, rgba(255,255,255,0) 0, rgba(255,255,255,0) min(34vh, 380px), rgba(255,255,255,0.08) calc(min(34vh, 380px) + 10%), rgba(255,255,255,0.22) calc(min(34vh, 380px) + 22%), rgba(255,255,255,0.45) calc(min(34vh, 380px) + 36%), rgba(255,255,255,0.68) calc(min(34vh, 380px) + 50%), rgba(255,255,255,0.86) calc(min(34vh, 380px) + 64%), rgba(255,255,255,0.96) calc(min(34vh, 380px) + 78%), #ffffff 100%)",
              }}
              aria-hidden
            />
          </div>
          <div className="max-w-4xl mx-auto text-center relative z-10 w-full">
            <p className="text-[#d8ebe0] text-sm md:text-base font-light tracking-[0.3em] uppercase mb-6 flex items-center justify-center gap-3 drop-shadow-sm">
              <span className="w-8 h-[1px] bg-white/40 hidden sm:block"></span>
              Ankara — 20 Yılı Aşkın Tecrübe
              <span className="w-8 h-[1px] bg-white/40 hidden sm:block"></span>
            </p>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight drop-shadow-md">
              Hayalinizdeki Bahçeyi <br className="hidden md:block" /> Gerçeğe Dönüştürüyoruz
            </h2>
            <p className="text-white/95 text-lg md:text-xl mb-10 max-w-3xl mx-auto font-light leading-relaxed drop-shadow">
              Peyzaj tasarımı, uygulama ve bakım hizmetlerinde profesyonel çözümler sunuyoruz.<br className="hidden md:block" />
              20 yılı aşkın deneyimimizle hayalinizdeki bahçeyi yaratıyoruz.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
              <button type="button" onClick={() => setTeklifFormAcik(true)} className="bg-[#183325] text-white font-semibold px-8 py-4 rounded-full hover:bg-[#1d3729] transition border-0 shadow-lg flex items-center justify-center group">
                Teklif Al
                <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
              <Link href="/calismalarimiz" className="bg-white/10 backdrop-blur-md border border-white/25 text-white font-medium px-8 py-4 rounded-full hover:bg-white/15 transition flex items-center justify-center">
                Çalışmalarımızı İnceleyin
              </Link>
            </div>
            <div className="flex justify-center gap-2 mt-10" role="tablist" aria-label="Hero görselleri">
              {HERO_ARKA_PLAN.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === heroSlide}
                  className={`h-2 rounded-full transition-all ${
                    i === heroSlide ? "w-8 bg-white" : "w-2 bg-white/40 hover:bg-white/60"
                  }`}
                  onClick={() => setHeroSlide(i)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* RAKAMLAR — hero gradient ile birleşir; üst boşlukla beyaz panel biraz aşağıda */}
        <section className="relative z-10 bg-white mt-12 sm:mt-16 md:mt-20 pt-6 sm:pt-8 pb-14 px-6 border-b border-gray-100">
          <div className="mx-auto grid max-w-4xl grid-cols-2 place-items-center gap-x-4 gap-y-10 text-center sm:gap-x-8 md:grid-cols-4 md:gap-8">
            {[
              { sayi: "20+", label: "Yıllık Tecrübe" },
              { sayi: "300+", label: "Tamamlanan Proje" },
              { sayi: "50+", label: "Referans" },
              { sayi: "250+", label: "Memnun Müşteri" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex w-full max-w-[10.5rem] flex-col items-center justify-center gap-1.5 sm:max-w-[11.5rem] md:max-w-none"
              >
                <p className="text-3xl font-bold text-green-700 tabular-nums sm:text-4xl">{item.sayi}</p>
                <p className="text-balance text-xs leading-snug text-gray-500 sm:text-sm">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* HAKKIMIZDA / FARKIMIZ (Yeni Tasarım) */}
        <section id="hakkimizda" className="bg-[#183325] py-24 px-6 font-sans">
          <div className="max-w-6xl mx-auto">
            {/* Üst Başlık Bölümü */}
            <div className="text-center mb-16">
              <p className="text-[#8ba797] text-xs font-semibold tracking-[0.2em] mb-3 uppercase">
                FARKIMIZ
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Neden Livni Peyzaj?
              </h2>
              <div className="w-12 h-[2px] bg-[#618671] mx-auto mb-6 rounded-full"></div>
              <p className="text-[#a4c2b1] text-[15px] max-w-2xl mx-auto font-light tracking-wide">
                Müşteri memnuniyetini odak alan, kaliteden ödün vermeyen bir ekiple çalışıyorsunuz.
              </p>
            </div>

            {/* Kartlar Grid (3 Sütun x 2 Satır) */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

              {/* Kart 1: Kanıtlanmış Deneyim */}
              <div className="bg-[#1d3729] border border-[#274535] p-6 rounded-xl hover:bg-[#203c2d] transition duration-300">
                <div className="flex gap-4">
                  <div className="shrink-0">
                    <div className="bg-[#244332] p-3 rounded-lg text-[#8ba797]">
                      {/* Madalya / Deneyim İkonu */}
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-base mb-2">Kanıtlanmış Deneyim</h3>
                    <p className="text-[#a4c2b1] text-sm leading-relaxed font-light">
                      20 yılı aşkın tecrübemizle Ankara&#39;nın en prestijli peyzaj projelerini hayata geçirdik. Her projede mükemmeliği hedefleriz.
                    </p>
                  </div>
                </div>
              </div>

              {/* Kart 2: Ekolojik Yaklaşım */}
              <div className="bg-[#1d3729] border border-[#274535] p-6 rounded-xl hover:bg-[#203c2d] transition duration-300">
                <div className="flex gap-4">
                  <div className="shrink-0">
                    <div className="bg-[#244332] p-3 rounded-lg text-[#8ba797]">
                      {/* Yaprak İkonu */}
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-base mb-2">Ekolojik Yaklaşım</h3>
                    <p className="text-[#a4c2b1] text-sm leading-relaxed font-light">
                      Su tasarruflu sulama sistemleri, yerli bitki kullanımı ve sürdürülebilir peyzaj çözümleriyle çevreye duyarlı projeler üretiyoruz.
                    </p>
                  </div>
                </div>
              </div>

              {/* Kart 3: Güçlü Satış Sonrası Destek */}
              <div className="bg-[#1d3729] border border-[#274535] p-6 rounded-xl hover:bg-[#203c2d] transition duration-300">
                <div className="flex gap-4">
                  <div className="shrink-0">
                    <div className="bg-[#244332] p-3 rounded-lg text-[#8ba797]">
                      {/* Kulaklık İkonu */}
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-base mb-2">Güçlü Satış Sonrası Destek</h3>
                    <p className="text-[#a4c2b1] text-sm leading-relaxed font-light">
                      Proje sonrası bakım anlaşmaları, teknik destek ve garanti hizmetlerimizle yanınızda olmaya devam ediyoruz.
                    </p>
                  </div>
                </div>
              </div>

              {/* Kart 4: Zamanında Teslimat */}
              <div className="bg-[#1d3729] border border-[#274535] p-6 rounded-xl hover:bg-[#203c2d] transition duration-300">
                <div className="flex gap-4">
                  <div className="shrink-0">
                    <div className="bg-[#244332] p-3 rounded-lg text-[#8ba797]">
                      {/* Saat İkonu */}
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-base mb-2">Zamanında Teslimat</h3>
                    <p className="text-[#a4c2b1] text-sm leading-relaxed font-light">
                      Sözleşme koşullarına tam uyum sağlayarak projelerimizi belirlenen süre ve bütçe dahilinde tamamlıyoruz.
                    </p>
                  </div>
                </div>
              </div>

              {/* Kart 5: Kalite Güvencesi */}
              <div className="bg-[#1d3729] border border-[#274535] p-6 rounded-xl hover:bg-[#203c2d] transition duration-300">
                <div className="flex gap-4">
                  <div className="shrink-0">
                    <div className="bg-[#244332] p-3 rounded-lg text-[#8ba797]">
                      {/* Kalkan İkonu */}
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-base mb-2">Kalite Güvencesi</h3>
                    <p className="text-[#a4c2b1] text-sm leading-relaxed font-light">
                      Kullandığımız tüm malzemeler Türkiye ve Avrupa kalite standartlarına uygundur. Uygulama kalitesi her aşamada denetlenir.
                    </p>
                  </div>
                </div>
              </div>

              {/* Kart 6: Özel Tasarım */}
              <div className="bg-[#1d3729] border border-[#274535] p-6 rounded-xl hover:bg-[#203c2d] transition duration-300">
                <div className="flex gap-4">
                  <div className="shrink-0">
                    <div className="bg-[#244332] p-3 rounded-lg text-[#8ba797]">
                      {/* Çizim/Tasarım İkonu */}
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-base mb-2">Özel Tasarım</h3>
                    <p className="text-[#a4c2b1] text-sm leading-relaxed font-light">
                      Her proje kendine özgüdür. Alanınızın ihtiyaçlarını ve beklentilerinizi dinleyerek size özel konsept tasarımlar oluşturuyoruz.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* HİZMETLER */}
        <section id="hizmetler" className="bg-gray-50 py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-green-600 text-sm font-semibold uppercase tracking-widest mb-3">Hizmetlerimiz</p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Neler Yapıyoruz?</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[
                { title: "Peyzaj Tasarımı", desc: "Bahçeniz için profesyonel proje ve tasarım hizmetleri" },
                { title: "Bahçe Düzenleme", desc: "Her ölçekte bahçe düzenleme ve uygulama" },
                { title: "Sulama Sistemleri", desc: "Otomatik sulama sistemi kurulum ve bakımı" },
                { title: "Çim Uygulama", desc: "Rulo çim ve tohum ekimi uygulamaları" },
                { title: "Ağaçlandırma", desc: "Ağaç, çalı ve bitki dikimi hizmetleri" },
                { title: "Bakım Hizmetleri", desc: "Düzenli bahçe bakım ve budama hizmetleri" },
              ].map((h) => (
                <div key={h.title} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition border border-gray-100 flex flex-col justify-center">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{h.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{h.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ÇALIŞMALARIMIZ */}
        <section id="calismalarimiz" className="bg-[#183325] py-24 px-6 overflow-hidden">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
              <div>
                <p className="text-[#8ba797] text-xs font-semibold tracking-[0.2em] mb-3 uppercase">Portfolyo</p>
                <h2 className="text-3xl md:text-4xl font-bold text-white">Çalışmalarımız</h2>
                <div className="w-12 h-[2px] bg-[#618671] mt-4 mb-4 rounded-full"></div>
                <p className="text-[#a4c2b1] text-[15px] font-light tracking-wide max-w-xl">
                  Tamamladığımız peyzaj tasarımı ve uygulama projelerimizden bazı kareler.
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex gap-2">
                  <button type="button" aria-label="Önceki projeler" onClick={() => slide("left")} className="bg-[#244332] hover:bg-[#618671] text-white w-10 h-10 rounded-full flex items-center justify-center transition">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button type="button" aria-label="Sonraki projeler" onClick={() => slide("right")} className="bg-[#244332] hover:bg-[#618671] text-white w-10 h-10 rounded-full flex items-center justify-center transition">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
                <Link href="/calismalarimiz" className="text-white font-semibold hover:text-white transition flex items-center gap-2 border border-[#618671] px-5 py-2 rounded-lg hover:bg-[#244332] shadow-sm whitespace-nowrap">
                  Tümünü Gör
                </Link>
              </div>
            </div>

            {/* Slider Kapsayıcı */}
            <div
              ref={carouselRef}
              className="flex gap-6 overflow-x-auto pb-8 [&::-webkit-scrollbar]:hidden"
              style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}
            >
              {sliderPhotos.map((imgName, index) => (
                <div
                  key={index}
                  role="button"
                  tabIndex={0}
                  aria-label={`Fotoğrafı büyüt: proje ${index + 1}`}
                  className="shrink-0 w-[280px] md:w-[320px] aspect-[4/5] relative rounded-2xl overflow-hidden bg-[#244332] border border-[#274535] cursor-pointer group hover:shadow-xl hover:shadow-black/20 transition-shadow duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#618671]/50"
                  onClick={() => setSeciliFotograf(imgName)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSeciliFotograf(imgName);
                    }
                  }}
                >
                  {medyaVideoMu(imgName) ? (
                    <video
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      src={`/site-fotolar/${imgName}`}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                    />
                  ) : (
                    <SafeImage
                      src={`/site-fotolar/${imgName}`}
                      alt={`Livni Peyzaj Proje ${index + 1}`}
                      fill
                      sizes="(max-width: 768px) 280px, 320px"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      fallbackLabel="Proje gorseli yakinda eklenecek"
                    />
                  )}

                  {/* Çok Daha Hafif ve Şık Hover Efekti */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                    <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                      <p className="text-white font-semibold text-lg tracking-wide drop-shadow-md">Örnek Proje</p>
                      <p className="text-white/80 text-sm mt-1 font-light tracking-widest uppercase">Peyzaj Tasarım</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* İLETİŞİM (Yeni Tasarım) */}
        <section id="iletisim" className="bg-[#f8f9f6] py-24 px-6 font-sans">
          <div className="max-w-6xl mx-auto">

            {/* Başlık */}
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-[#183325] tracking-tight mb-4">
                İletişim
              </h2>
              <div className="w-12 h-[3px] bg-[#183325] mx-auto mb-6 rounded-full"></div>
              <p className="text-gray-500 text-[15px] md:text-base max-w-2xl mx-auto font-light">
                Projeleriniz ve hizmetlerimiz hakkında bilgi almak için bize ulaşın.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">

              {/* SOL SÜTUN (Bilgiler ve Harita) */}
              <div className="lg:col-span-2 flex flex-col gap-6">

                {/* 4'lü İletişim Kartları Grid */}
                <div className="grid sm:grid-cols-2 gap-6">
                  {/* Kart 1: Telefon */}
                  <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm flex items-center gap-5">
                    <div className="bg-[#f0f3f1] p-3.5 rounded-2xl text-[#3b5947]">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-gray-400 tracking-widest mb-1.5">TELEFON</p>
                      <a href="tel:03124317872" className="text-[#183325] font-bold text-sm md:text-base hover:text-green-700 transition">
                        0312 431 78 72
                      </a>
                    </div>
                  </div>

                  {/* Kart 2: WhatsApp */}
                  <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm flex items-center gap-5">
                    <div className="bg-[#f0f3f1] p-3.5 rounded-2xl text-[#3b5947]">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-gray-400 tracking-widest mb-1.5">GSM / WHATSAPP</p>
                      <a href="https://wa.me/905322251185" target="_blank" rel="noreferrer" className="text-[#183325] font-bold text-sm md:text-base hover:text-green-700 transition">
                        0532 225 11 85
                      </a>
                    </div>
                  </div>

                  {/* Kart 3: E-Posta */}
                  <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm flex items-center gap-5">
                    <div className="bg-[#f0f3f1] p-3.5 rounded-2xl text-[#3b5947]">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-[11px] font-semibold text-gray-400 tracking-widest mb-1.5">E-POSTA</p>
                      <a href="mailto:info@livnipeyzaj.com" className="text-[#183325] font-bold text-sm md:text-base hover:text-green-700 transition truncate block">
                        info@livnipeyzaj.com
                      </a>
                    </div>
                  </div>

                  {/* Kart 4: Adres */}
                  <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm flex items-start gap-5">
                    <div className="shrink-0 bg-[#f0f3f1] p-3.5 rounded-2xl text-[#3b5947]">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-gray-400 tracking-widest mb-1.5">ADRES</p>
                      <p className="text-[#183325] font-bold text-sm leading-relaxed">
                        Esatoğlu Mh, Küçükesat,<br />Hacıyolu Sk. 22-A,<br />Çankaya / Ankara
                      </p>
                    </div>
                  </div>
                </div>

                {/* Harita */}
                <div className="bg-white p-8 rounded-[2rem] shadow-sm mt-2">
                  <h3 className="font-bold text-[#183325] mb-5 text-sm md:text-base">Konumumuz – Ankara</h3>
                  <div className="h-[250px] md:h-[300px] w-full rounded-2xl overflow-hidden bg-gray-100">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3060.297491740924!2d32.86016627660604!3d39.912361686180574!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14d34fa24b917bb3%3A0x6431e782803b9b47!2zRXNhdG_En2x1LCBIYWPEsXlvbHUgU2suIDIyLUEsIDA2NjYwIMOHYW5rYXlhL0Fua2FyYQ!5e0!3m2!1str!2str!4v1714562725895!5m2!1str!2str"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen={true}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                </div>

              </div>

              {/* SAĞ SÜTUN (Hızlı İletişim & Sosyal Medya) */}
              <div className="flex flex-col gap-6">

                {/* Hızlı İletişim (Yeşil Kutu) */}
                <div className="bg-[#183325] rounded-[2rem] p-10 flex flex-col items-center text-center justify-center min-h-[340px]">
                  <div className="bg-[#244332] p-4 rounded-full text-white mb-6">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                  </div>
                  <h3 className="text-white text-xl font-bold mb-3 tracking-wide">Hızlı İletişim</h3>
                  <p className="text-[#a4c2b1] text-[13px] md:text-sm mb-8 leading-relaxed font-light px-2">
                    WhatsApp üzerinden anında iletişime geçin, sorularınızı yanıtlayalım.
                  </p>
                  <a href="https://wa.me/905322251185" target="_blank" rel="noreferrer" className="bg-[#25d366] text-white font-bold w-full py-4 rounded-xl hover:bg-[#20b858] transition flex items-center justify-center gap-2 text-[15px] shadow-lg shadow-[#25d366]/20">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    WhatsApp&apos;a Yaz
                  </a>
                </div>

                {/* Mini Teklif Formu */}
                <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-sm">
                  <h3 className="font-bold text-[#183325] text-sm md:text-base mb-2">Mini Teklif Formu</h3>
                  <p className="text-gray-500 text-xs md:text-sm mb-5">
                    Bilgilerinizi bırakın, size kısa sürede dönüş yapalım.
                  </p>
                  <form className="flex flex-col gap-3.5" onSubmit={teklifFormGonder}>
                    <input
                      required
                      type="text"
                      placeholder="Ad Soyad"
                      value={teklifForm.adSoyad}
                      onChange={(e) => setTeklifForm((prev) => ({ ...prev, adSoyad: e.target.value }))}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-[#183325] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#618671]/40 focus:border-[#618671]"
                    />
                    <input
                      required
                      type="tel"
                      placeholder="Telefon"
                      value={teklifForm.telefon}
                      onChange={(e) => setTeklifForm((prev) => ({ ...prev, telefon: e.target.value }))}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-[#183325] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#618671]/40 focus:border-[#618671]"
                    />
                    <select
                      required
                      value={teklifForm.alanTipi}
                      onChange={(e) => setTeklifForm((prev) => ({ ...prev, alanTipi: e.target.value }))}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#183325] focus:outline-none focus:ring-2 focus:ring-[#618671]/40 focus:border-[#618671]"
                    >
                      <option value="" disabled>Alan Tipi Seçin</option>
                      <option value="Villa Bahçesi">Villa Bahçesi</option>
                      <option value="Site / Rezidans">Site / Rezidans</option>
                      <option value="Ticari Alan">Ticari Alan</option>
                      <option value="Diğer">Diğer</option>
                    </select>
                    <div className="mt-1 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <button
                        type="submit"
                        className="rounded-xl bg-[#183325] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1f3d2e] shadow-sm"
                      >
                        WhatsApp ile Gönder
                      </button>
                      <button
                        type="button"
                        onClick={teklifMailGonder}
                        className="rounded-xl border border-[#183325]/15 bg-white px-4 py-3 text-sm font-semibold text-[#183325] transition hover:bg-[#f0f3f1] shadow-sm"
                      >
                        E-Posta ile Gönder
                      </button>
                    </div>
                  </form>
                </div>

                {/* Bizi Takip Edin (Beyaz Kutu) */}
                <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-sm flex-grow">
                  <h3 className="font-bold text-[#183325] mb-6 text-sm md:text-base">Bizi Takip Edin</h3>
                  <div className="flex flex-col gap-4">

                    {/* Instagram */}
                    <a href="https://instagram.com/livni.peyzaj" target="_blank" rel="noreferrer" className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-md transition group bg-[#fdfdfd]">
                      <div className="bg-[#f0f3f1] p-3 rounded-xl text-[#3b5947]">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                        </svg>
                      </div>
                      <span className="text-[#183325] font-medium text-sm">@livni.peyzaj</span>
                    </a>

                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-green-900 text-green-300 text-center py-6 px-4 text-sm">
          <p>© {new Date().getFullYear()} Livni Peyzaj Proje Uygulama — Tüm hakları saklıdır.</p>
        </footer>

        {/* TEKLIF FORMU MODALı */}
        {mounted && teklifFormAcik && (
          <div
            className="fixed inset-0 z-[150] flex items-center justify-center overflow-y-auto overscroll-contain p-4 sm:p-8 bg-black/80 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label="Tam Teklif Formu"
            onClick={() => setTeklifFormAcik(false)}
          >
            <div
              className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl my-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-gray-100 px-6 sm:px-10 py-6 flex items-center justify-between rounded-t-3xl">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#183325]">Teklif Al</h2>
                <button
                  type="button"
                  onClick={() => setTeklifFormAcik(false)}
                  className="text-gray-400 hover:text-gray-600 transition text-2xl"
                  aria-label="Kapat"
                >
                  ✕
                </button>
              </div>

              <div className="px-6 sm:px-10 py-8 max-h-[calc(100vh-200px)] overflow-y-auto">
                <p className="text-gray-600 mb-6 text-sm sm:text-base">
                  Bilgilerinizi bırakın, size kısa sürede dönüş yapalım.
                </p>

                <form className="flex flex-col gap-5" onSubmit={teklifFormGonder}>
                  {/* Ad Soyad */}
                  <div>
                    <label className="block text-sm font-semibold text-[#183325] mb-2">Ad Soyad *</label>
                    <input
                      required
                      type="text"
                      placeholder="Adınız ve Soyadınız"
                      value={teklifForm.adSoyad}
                      onChange={(e) => setTeklifForm((prev) => ({ ...prev, adSoyad: e.target.value }))}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-[#183325] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#618671]/40 focus:border-[#618671]"
                    />
                  </div>

                  {/* Telefon */}
                  <div>
                    <label className="block text-sm font-semibold text-[#183325] mb-2">Telefon *</label>
                    <input
                      required
                      type="tel"
                      placeholder="0(5XX) XXX XX XX"
                      value={teklifForm.telefon}
                      onChange={(e) => setTeklifForm((prev) => ({ ...prev, telefon: e.target.value }))}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-[#183325] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#618671]/40 focus:border-[#618671]"
                    />
                  </div>

                  {/* Alan Tipi */}
                  <div>
                    <label className="block text-sm font-semibold text-[#183325] mb-2">Alan Tipi *</label>
                    <select
                      required
                      value={teklifForm.alanTipi}
                      onChange={(e) => setTeklifForm((prev) => ({ ...prev, alanTipi: e.target.value }))}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#183325] focus:outline-none focus:ring-2 focus:ring-[#618671]/40 focus:border-[#618671]"
                    >
                      <option value="" disabled>Alan Tipi Seçin</option>
                      <option value="Villa Bahçesi">Villa Bahçesi</option>
                      <option value="Site / Rezidans">Site / Rezidans</option>
                      <option value="Ticari Alan">Ticari Alan</option>
                      <option value="Diğer">Diğer</option>
                    </select>
                  </div>

                  {/* Detay */}
                  <div>
                    <label className="block text-sm font-semibold text-[#183325] mb-2">Proje Detayları</label>
                    <textarea
                      placeholder="Projeniz hakkında bilgi verin... (İsteğe bağlı)"
                      value={teklifForm.detay}
                      onChange={(e) => setTeklifForm((prev) => ({ ...prev, detay: e.target.value }))}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-[#183325] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#618671]/40 focus:border-[#618671]"
                      rows={4}
                    />
                  </div>

                  {/* Butonlar */}
                  <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    <button
                      type="submit"
                      className="flex-1 rounded-xl bg-[#183325] px-6 py-3 font-semibold text-white transition hover:bg-[#1f3d2e] shadow-sm flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                      WhatsApp ile Gönder
                    </button>
                    <button
                      type="button"
                      onClick={teklifMailGonder}
                      className="flex-1 rounded-xl border border-[#183325]/15 bg-white px-6 py-3 font-semibold text-[#183325] transition hover:bg-[#f0f3f1] shadow-sm flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      E-Posta ile Gönder
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setTeklifFormAcik(false)}
                    className="rounded-xl border border-gray-200 bg-white px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 shadow-sm"
                  >
                    Kapat
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* LİGHTBOX (Fotoğraf Büyütme Modalı) */}
        {mounted && seciliFotograf && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto overscroll-contain p-4 sm:p-8 bg-black/90 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label="Büyütülmüş fotoğraf"
            onClick={() => setSeciliFotograf(null)}
          >
            <button
              type="button"
              aria-label="Kapat"
              onClick={(e) => {
                e.stopPropagation();
                setSeciliFotograf(null);
              }}
              className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[110] text-white/80 hover:text-white transition bg-black/50 hover:bg-black/80 rounded-full p-2"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="relative max-h-full max-w-full py-12" onClick={(e) => e.stopPropagation()}>
              {medyaVideoMu(seciliFotograf) ? (
                <video
                  src={`/site-fotolar/${seciliFotograf}`}
                  className="max-h-[min(92vh,1200px)] w-auto max-w-full object-contain rounded-lg shadow-2xl"
                  controls
                  autoPlay
                  playsInline
                  preload="metadata"
                />
              ) : (
                <Image
                  src={`/site-fotolar/${seciliFotograf}`}
                  alt="Büyütülmüş proje fotoğrafı"
                  width={1920}
                  height={1440}
                  sizes="100vw"
                  quality={90}
                  className="max-h-[min(92vh,1200px)] w-auto max-w-full object-contain rounded-lg shadow-2xl"
                  priority
                />
              )}
            </div>
          </div>
        )}

      </main>
    );
  }