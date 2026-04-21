"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";

type SafeImageProps = {
  src: string;
  alt: string;
  fallbackLabel?: string;
};

function SafeImage({ src, alt, fallbackLabel = "Gorsel yuklenemedi" }: SafeImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#30513f] to-[#1d3729] text-center text-sm text-white/80 p-4">
        {fallbackLabel}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 33vw, 25vw"
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      onError={() => setHasError(true)}
    />
  );
}

export default function Calismalarimiz() {
  const [seciliFotograf, setSeciliFotograf] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  
  const medyaVideoMu = (dosyaAdi: string) => dosyaAdi.toLowerCase().endsWith(".mp4");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !seciliFotograf) return;
    
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
  }, [seciliFotograf, mounted]);

  const photos = useMemo(() => {
    const oneCikacakNumaralar = [82, 88, 79, 76, 74, 61, 64, 60, 53, 54, 50, 51, 44, 43, 31, 25, 28, 11, 7];
    const photoArray = Array.from({ length: 100 }, (_, i) => `livnipeyzaj_${i + 1}.jpg`);

    // Verilen görseller ilk 19 sırayla birebir yer değiştirir.
    oneCikacakNumaralar.forEach((numara, index) => {
      const hedefIndex = index;
      const kaynakIndex = photoArray.indexOf(`livnipeyzaj_${numara}.jpg`);
      if (kaynakIndex !== -1) {
        [photoArray[hedefIndex], photoArray[kaynakIndex]] = [photoArray[kaynakIndex], photoArray[hedefIndex]];
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
      const aIndex = a - 1;
      const bIndex = b - 1;
      if (aIndex >= 0 && bIndex >= 0 && aIndex < photoArray.length && bIndex < photoArray.length) {
        [photoArray[aIndex], photoArray[bIndex]] = [photoArray[bIndex], photoArray[aIndex]];
      }
    });

    const onuncuFotograf = photoArray[9];
    photoArray[9] = "livnipeyzaj_10_video.mp4";
    photoArray.push(onuncuFotograf, "livnipeyzaj_101.png");

    // İstenen ek değişim: 102. sıradaki medya ile 19. sıradaki medyayı yer değiştir.
    [photoArray[18], photoArray[101]] = [photoArray[101], photoArray[18]];
    
    return photoArray;
  }, []);

  return (
    <main className="min-h-screen font-sans bg-gray-50 pt-[100px]">

      {/* BAŞLIK KISMI */}
      <section className="px-6 mb-12">
        <div className="max-w-6xl mx-auto text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-green-600 text-sm font-semibold uppercase tracking-widest mb-3">Portfolyo</p>
            <h1 className="text-4xl md:text-5xl font-bold text-[#183325]">Çalışmalarımız</h1>
          </div>
          <Link href="/" className="text-gray-600 hover:text-green-700 bg-white border border-gray-200 px-6 py-2.5 rounded-lg shadow-sm hover:shadow transition font-medium flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Ana Sayfaya Dön
          </Link>
        </div>
      </section>

      {/* GALERİ (100 FOTOĞRAF GRİDİ) */}
      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto">
          {/* Responsive Grid: Mobilde 1, Tablette 2, Ekranda 3, Büyük Ekranda 4 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {photos.map((imgName, index) => (
              <div
                key={index}
                role="button"
                tabIndex={0}
                aria-label={`Fotoğrafı büyüt: ${index + 1}`}
                className="group relative rounded-2xl overflow-hidden aspect-square shadow-sm border border-gray-100 cursor-pointer bg-[#244332] hover:shadow-xl hover:shadow-black/10 transition-shadow duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-green-600/40"
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
                    fallbackLabel="Proje gorseli yakinda eklenecek"
                  />
                )}

                {/* Çok Daha Hafif ve Şık Hover Efekti */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                  <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                    <p className="text-white font-semibold text-lg tracking-wide drop-shadow-md">
                      Proje Fotoğrafı #{index + 1}
                    </p>
                    <p className="text-white/80 text-sm mt-1 font-light tracking-widest uppercase">
                      Peyzaj Uygulaması
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

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