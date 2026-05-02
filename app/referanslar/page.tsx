"use client";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

// Devam ediyor'ları başa al
const referanslar = [
  { proje: "Petrotek Global Mak. San. Gölbaşı Yapısal Bitkisel Kuru Peyzaj", durum: "Devam Ediyor", id: "petrotek", gorseller: [] },
  { proje: "Özver İnşaat.A.Ş. Çubuk Üretim Tesisi Peyzaj işi Ankara", durum: "Devam Ediyor", id: "cubuk", gorseller: [93, 92, 91, 90, 89, 9, 88] },
  { proje: "Malatya Hekimhan Toki", durum: "Bitti", id: "malatya", gorseller: [] },
  { proje: "Van İskele Yolu Belediye", durum: "Bitti", id: "van", gorseller: [] },
  { proje: "Ankara Teksif İncesu", durum: "Bitti", id: "teksif", gorseller: [] },
  { proje: "Ankara BMS Kazan", durum: "Bitti", id: "bms", gorseller: [] },
  { proje: "Ankara Bağdaşanlar Sitesi", durum: "Bitti", id: "bagdasanlar", gorselller: [] },
  { proje: "Ankara Ata Erkek Yurtları", durum: "Bitti", id: "ata", gorselller: [] },
  { proje: "Ankara Birlik Mahhallesi Site", durum: "Bitti", id: "birlik", gorselller: [] },
  { proje: "Ankara Eryaman Öz Ceviz Ana Okulları", durum: "Bitti", id: "eryaman", gorselller: [] },
  { proje: "Ankara İncek Villaları Otomatik Sulama Sistemleri", durum: "Bitti", id: "incek", gorselller: [0, 2, 8, 12, 14, 17, 50] },
  { proje: "Ankara Eskişehir 8. Evler Villaları", durum: "Bitti", id: "eskisehir", gorselller: [] },
  { proje: "Ankara Royal Rezidans Gazi Osman Paşa", durum: "Bitti", id: "royal", gorselller: [] },
  { proje: "Çevik Karnal Sitesi Yapısal Kilitli Parke Taşı ve Bordur Taşı İşi", durum: "Bitti", id: "cevik", gorselller: [] },
  { proje: "Nallıhan Adliye Sarayı - Emniyet Müdürlüğü - Jandarma Karakolu Bitkisel İşi", durum: "Bitti", id: "nalihan", gorselller: [] },
  { proje: "Samsun Makina - ANKARA", durum: "Bitti", id: "samsun", gorselller: [] },
  { proje: "İncek Bitkisel ve Sulama Sistemleri", durum: "Bitti", id: "incek2", gorselller: [] },
  { proje: "Türkiye Eczacılar Birliği Merkez Yapısal Bitkisel ve Havuz İşi - Eskişehir Yolu Ankara", durum: "Bitti", id: "eczacilar", gorselller: [] },
  { proje: "Girişim Uuropawer Elektirik AŞ. Saray Kazan - Bitkisel proje", durum: "Bitti", id: "girisim", gorselller: [] },
  { proje: "Beytebe Mira Ofis Bitkisel ve Otomatik Sulama İşi", durum: "Bitti", id: "beytebe", gorselller: [] },
  { proje: "Sağlık Bilimleri Üniversitesi Kütüphanesi - Rulo Çim", durum: "Bitti", id: "saglik", gorselller: [] },
  { proje: "Bitkisel ve Sulama Sistemleri..Sirkeli", durum: "Bitti", id: "sirkeli", gorselller: [] },
  { proje: "Mabuskent Villaları Sulama Ve Bitkisel İşi", durum: "Bitti", id: "mabuskent", gorselller: [] },
  { proje: "Beta Villaları Bitkisel", durum: "Bitti", id: "beta", gorselller: [] },
  { proje: "Ankara seramik porselen A.Ş. - Bitkisel", durum: "Bitti", id: "seramik", gorselller: [] },
  { proje: "ACF inşaat A.Ş. Havuz ve Yapısal Bitkisel Hamam Önü İşi", durum: "Bitti", id: "acf", gorselller: [] },
  { proje: "Park Platin Konaklari - Alacatl yapisan bitkisel Ve Sulama İşi, kent mobilyalari ve drenaj İşi", durum: "Bitti", id: "park", gorselller: [] },
  { proje: "Adalet Bakanlığı Bilgi İşlem Müdürlüğü Bitkisel Proje", durum: "Bitti", id: "adalet", gorselller: [] },
  { proje: "Avrupa Yakası Spor Kompleksi Bağcılar Bitkisel", durum: "Bitti", id: "avrupa", gorselller: [] },
  { proje: "YDA Ankara Bitkisel Yenimahalle", durum: "Bitti", id: "yda", gorselller: [] },
  { proje: "Ceza Tevfik Evleri Genel Müdürlüğü - Yapısal Bitkisel Sulama İşi", durum: "Bitti", id: "ceza", gorselller: [10, 25] },
  { proje: "Mersin Büyükşehir Belediyesi Orta Refüj 50.000 m2 Sulama Ve Çim Ekimi HLZ.A.Ş.", durum: "Bitti", id: "mersin", gorselller: [] },
  { proje: "Green Loft Bitkisel Sulama Sistemi", durum: "Bitti", id: "greenloft", gorselller: [] },
  { proje: "Valore Sitesi - Yaşam Kent.- Yapısal Bitkisel Sulama", durum: "Bitti", id: "valore", gorselller: [] },
  { proje: "T.C. Spor Bakanlığı Kız Yurdu Nnevşehir Ürgüp Ensar İnş. ve Pırlanta İnş. 2. Kısım Bitkisel 20.000 m2. Bitki ve Herek", durum: "Bitti", id: "sporbakanl", gorselller: [] },
  { proje: "İç işleribakanlığı Adakale vilayetler evi işi bitkisel bitki Ekimi ve toprak serimi ve Rula çim serimi 2000m2", durum: "Bitti", id: "icisler", gorselller: [] },
  { proje: "Ünlü İnşaat A.Ş. Bitkisel Sulama", durum: "Bitti", id: "unlu", gorselller: [] },
];

export default function Referanslar() {
  const [seciliProjeFotosu, setSeciliProjeFotosu] = useState<number[] | null>(null);
  return (
    <main className="min-h-screen bg-gray-50 font-sans">
      {/* HEADER */}
      <section className="bg-[#183325] py-24 px-6 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#8ba797] text-xs font-semibold tracking-[0.2em] mb-3 uppercase">
            Referanslar
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Bize Güvenenler
          </h1>
          <div className="w-12 h-[2px] bg-[#618671] mx-auto mb-6 rounded-full"></div>
          <p className="text-[#a4c2b1] text-lg max-w-2xl mx-auto font-light">
            Tamamladığımız ve devam eden projelerimizden bazıları. Her proje bizim için bir referanstır.
          </p>
        </div>
      </section>

      {/* REFERANSLAR LİSTESİ */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#183325] text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Yapılan İşin Açıklaması</th>
                    <th className="px-6 py-4 text-left font-semibold">Durumu</th>
                  </tr>
                </thead>
                <tbody>
                  {referanslar.map((ref, index) => (
                    <tr 
                      key={index} 
                      onClick={() => ref.gorseller && ref.gorseller.length > 0 && setSeciliProjeFotosu(ref.gorseller)}
                      className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} ${ref.gorseller && ref.gorseller.length > 0 ? 'cursor-pointer hover:bg-blue-50 transition' : ''}`}
                    >
                      <td className="px-6 py-4 text-gray-800 font-medium">{ref.proje}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          ref.durum === 'Bitti'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {ref.durum}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* MODAL - Seçilen Referansın Görselleri (Bottom Sheet) */}
      {seciliProjeFotosu && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => setSeciliProjeFotosu(null)}
          />
          {/* Sheet Dialog */}
          <div
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl max-h-[90vh] flex flex-col"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 sm:px-10 py-6 flex items-center justify-between rounded-t-3xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#183325]">
                {referanslar.find(r => r.gorseller === seciliProjeFotosu)?.proje}
              </h2>
              <button
                type="button"
                onClick={() => setSeciliProjeFotosu(null)}
                className="text-gray-400 hover:text-gray-600 transition text-2xl flex-shrink-0"
                aria-label="Kapat"
              >
                ✕
              </button>
            </div>

            <div className="px-6 sm:px-10 py-8 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {seciliProjeFotosu.map((gorselIdx, idx) => {
                  const fileName = gorselIdx < 100 ? `livnipeyzaj_${gorselIdx + 1}.jpg` : 
                                   gorselIdx === 100 ? "livnipeyzaj_101.png" : "livnipeyzaj_10_video.mp4";
                  return (
                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden bg-gray-200 border border-gray-100">
                      {fileName.endsWith('.mp4') ? (
                        <video
                          src={`/site-fotolar/${fileName}`}
                          autoPlay
                          muted
                          loop
                          playsInline
                          preload="metadata"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Image
                          src={`/site-fotolar/${fileName}`}
                          alt={`Proje görseli ${gorselIdx + 1}`}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          className="w-full h-full object-cover"
                          quality={75}
                          loading="lazy"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

      {/* CTA */}
      <section className="bg-[#183325] py-16 px-6 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Siz de Referanslarımız Arasına Katılın
          </h2>
          <p className="text-[#a4c2b1] mb-8 max-w-2xl mx-auto">
            Peyzaj projeleriniz için profesyonel çözümler arıyorsanız, bize ulaşın.
          </p>
          <Link
            href="/#iletisim"
            className="inline-flex items-center bg-[#618671] hover:bg-[#4a5d4f] text-white font-semibold px-8 py-4 rounded-full transition"
          >
            Teklif İste
          </Link>
        </div>
      </section>
    </main>
  );
}