"use client";
import Link from "next/link";

const referanslar = [
  { proje: "Malatya Hekimhan Toki", durum: "Bitti" },
  { proje: "Van İskele Yolu Belediye", durum: "Bitti" },
  { proje: "Ankara Teksif İncesu", durum: "Bitti" },
  { proje: "Ankara BMS Kazan", durum: "Bitti" },
  { proje: "Ankara Bağdaşanlar Sitesi", durum: "Bitti" },
  { proje: "Ankara Ata Erkek Yurtları", durum: "Bitti" },
  { proje: "Ankara Birlik Mahhallesi Site", durum: "Bitti" },
  { proje: "Ankara Eryaman Öz Ceviz Ana Okulları", durum: "Bitti" },
  { proje: "Ankara İncek Villaları Otomatik Sulama Sistemleri", durum: "Bitti" },
  { proje: "Ankara Eskişehir 8. Evler Villaları", durum: "Bitti" },
  { proje: "Ankara Royal Rezidans Gazi Osman Paşa", durum: "Bitti" },
  { proje: "Çevik Karnal Sitesi Yapısal Kilitli Parke Taşı ve Bordur Taşı İşi", durum: "Bitti" },
  { proje: "Nallıhan Adliye Sarayı - Emniyet Müdürlüğü - Jandarma Karakolu Bitkisel İşi", durum: "Bitti" },
  { proje: "Samsun Makina - ANKARA", durum: "Bitti" },
  { proje: "İncek Bitkisel ve Sulama Sistemleri", durum: "Bitti" },
  { proje: "Türkiye Eczacılar Birliği Merkez Yapısal Bitkisel ve Havuz İşi - Eskişehir Yolu Ankara", durum: "Bitti" },
  { proje: "Girişim Uuropawer Elektirik AŞ. Saray Kazan - Bitkisel proje", durum: "Bitti" },
  { proje: "Beytebe Mira Ofis Bitkisel ve Otomatik Sulama İşi", durum: "Bitti" },
  { proje: "Sağlık Bilimleri Üniversitesi Kütüphanesi - Rulo Çim", durum: "Bitti" },
  { proje: "Bitkisel ve Sulama Sistemleri..Sirkeli", durum: "Bitti" },
  { proje: "Mabuskent Villaları Sulama Ve Bitkisel İşi", durum: "Bitti" },
  { proje: "Beta Villaları Bitkisel", durum: "Bitti" },
  { proje: "Ankara seramik porselen A.Ş. - Bitkisel", durum: "Bitti" },
  { proje: "ACF inşaat A.Ş. Havuz ve Yapısal Bitkisel Hamam Önü İşi", durum: "Bitti" },
  { proje: "Park Platin Konaklari - Alacatl yapisan bitkisel Ve Sulama İşi, kent mobilyalari ve drenaj İşi", durum: "Bitti" },
  { proje: "Adalet Bakanlığı Bilgi İşlem Müdürlüğü Bitkisel Proje", durum: "Bitti" },
  { proje: "Avrupa Yakası Spor Kompleksi Bağcılar Bitkisel", durum: "Bitti" },
  { proje: "YDA Ankara Bitkisel Yenimahalle", durum: "Bitti" },
  { proje: "Ceza Tevfik Evleri Genel Müdürlüğü - Yapısal Bitkisel Sulama İşi", durum: "Bitti" },
  { proje: "Mersin Büyükşehir Belediyesi Orta Refüj 50.000 m2 Sulama Ve Çim Ekimi HLZ.A.Ş.", durum: "Bitti" },
  { proje: "Green Loft Bitkisel Sulama Sistemi", durum: "Bitti" },
  { proje: "Valore Sitesi - Yaşam Kent.- Yapısal Bitkisel Sulama", durum: "Bitti" },
  { proje: "T.C. Spor Bakanlığı Kız Yurdu Nnevşehir Ürgüp Ensar İnş. ve Pırlanta İnş. 2. Kısım Bitkisel 20.000 m2. Bitki ve Herek", durum: "Bitti" },
  { proje: "İç işleribakanlığı Adakale vilayetler evi işi bitkisel bitki Ekimi ve toprak serimi ve Rula çim serimi 2000m2", durum: "Bitti" },
  { proje: "Ünlü İnşaat A.Ş. Bitkisel Sulama", durum: "Bitti" },
  { proje: "Petrotek Global Mak. San. Gölbaşı Yapısal Bitkisel Kuru Peyzaj", durum: "Devam Ediyor" },
  { proje: "Özver İnşaat.A.Ş. Çubuk Üretim Tesisi Peyzaj işi Ankara", durum: "Devam Ediyor" },
];

export default function Referanslar() {
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
                    <tr key={index} className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
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