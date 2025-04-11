import React from "react";
import { PageContainer } from "~/components/page-container";
import { SectionTitle } from "~/components/section-title";
import { Button } from "~/components/button";
import { routes } from "~/routes";

export default async function OffersPage() {
    return (
        <PageContainer>
            {/* Wedding Offer Section */}
            <section className="w-full pb-8 md:pb-12">
                <SectionTitle
                    title="Oferta ślubna"
                    subtitle="Kompleksowa usługa dla Waszego wyjątkowego dnia"
                />

                <div className="mx-auto max-w-4xl">
                    <div className="mb-12 text-center">
                        <p className="mx-auto max-w-3xl font-light leading-relaxed text-stone-600 mb-4">
                            Z pasją i profesjonalizmem uwiecznimy każdą wyjątkową chwilę Waszego ślubu, tworząc niepowtarzalną kolekcję wspomnień. Łącząc artystyczną fotografię z kunsztem filmowym, dokumentujemy historię Waszej miłości z dbałością o najmniejszy detal. Nasza dyskretna obecność pozwala Wam swobodnie przeżywać ten wyjątkowy dzień, podczas gdy my zajmujemy się zatrzymaniem tych emocji w czasie. Gwarantujemy szybką realizację materiałów, transparentne zasady współpracy i brak ukrytych kosztów.
                        </p>
                    </div>

                    {/* Featured Image */}
                    <div className="mb-16 overflow-hidden rounded-lg shadow-lg">
                        <img
                            src="https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=1200&h=600"
                            alt="Para młoda przytulająca się na schodach"
                            className="w-full object-cover h-[400px]"
                        />
                    </div>

                    {/* Offer Details Section */}
                    <div className="grid gap-12 md:grid-cols-2 mb-16">
                        {/* Photography Column */}
                        <div className="bg-section-background rounded-lg p-8 shadow-md">
                            <h3 className="mb-6 font-serif text-2xl font-medium text-stone-800 border-b border-gold-200 pb-2">
                                Zdjęcia
                            </h3>
                            <ul className="space-y-4">
                                <li className="flex items-start">
                                    <span className="mr-3 text-gold-500">✓</span>
                                    <span className="font-light text-stone-700">Bogata kolekcja około 1000 starannie wyselekcjonowanych zdjęć na pendrive</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-3 text-gold-500">✓</span>
                                    <span className="font-light text-stone-700">Profesjonalna obróbka i korekcja kolorystyczna wszystkich zdjęć</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-3 text-gold-500">✓</span>
                                    <span className="font-light text-stone-700">Prywatna galeria internetowa zabezpieczona hasłem do wygodnego udostępniania</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-3 text-gold-500">✓</span>
                                    <span className="font-light text-stone-700">Eleganckie zdjęcia grupowe i portretowe z rodziną i bliskimi</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-3 text-gold-500">✓</span>
                                    <span className="font-light text-stone-700">Do wyboru: zestaw 2 albumów ślubnych (200 odbitek 15x10cm, 40 odbitek 21x15cm) lub ekskluzywna fotoksiążka 30x30cm o objętości 80 stron</span>
                                </li>
                            </ul>
                        </div>

                        {/* Video Column */}
                        <div className="bg-section-background rounded-lg p-8 shadow-md">
                            <h3 className="mb-6 font-serif text-2xl font-medium text-stone-800 border-b border-gold-200 pb-2">
                                Film
                            </h3>
                            <ul className="space-y-4">
                                <li className="flex items-start">
                                    <span className="mr-3 text-gold-500">✓</span>
                                    <span className="font-light text-stone-700">Profesjonalny film o długości 3 godzin (możliwość dostosowania długości według preferencji)</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-3 text-gold-500">✓</span>
                                    <span className="font-light text-stone-700">Film w wysokiej rozdzielczości FullHD dostarczany na pendrive</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-3 text-gold-500">✓</span>
                                    <span className="font-light text-stone-700">Krystalicznie czyste nagranie audio w kościele za pomocą profesjonalnego rejestratora</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-3 text-gold-500">✓</span>
                                    <span className="font-light text-stone-700">Płynne ujęcia z użyciem zaawansowanego stabilizatora żyroskopowego (gimbal)</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-3 text-gold-500">✓</span>
                                    <span className="font-light text-stone-700">Kompletny pakiet: artystyczna czołówka, ujęcia z przygotowań (opcjonalnie), film główny oraz emocjonalny teledysk</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Included in price */}
                    <div className="mb-16">
                        <h3 className="mb-6 font-serif text-2xl font-medium text-stone-800 text-center">
                            Korzyści w standardowym pakiecie
                        </h3>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {[
                                'Dwie osoby - fotograf i kamerzysta',
                                'Sesja plenerowa w dniu ślubu',
                                'Gotowe materiały do 3 miesięcy od uroczystości',
                                'Pracujemy w pierwszy dzień od przygotowań do godz 1:30',
                                'Pracujemy w poprawiny (o ile są) do godz 24:00',
                                'Nie doliczamy kosztów przejazdu do 100km od Andrychowa'
                            ].map((item, index) => (
                                <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-stone-100">
                                    <div className="flex items-center">
                                        <span className="mr-3 text-gold-400">❤</span>
                                        <span className="font-light text-stone-700">{item}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Additional options */}
                    <div className="mb-16">
                        <h3 className="mb-6 font-serif text-2xl font-medium text-stone-800 text-center">
                            Opcje dodatkowe
                        </h3>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {[
                                'Poprawiny',
                                'Dodatkowa foto-książka',
                                'Film na DVD (4 komplety)',
                                'Sesja plenerowa w innym terminie',
                                'Film i zdjęcia z drona'
                            ].map((item, index) => (
                                <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-stone-100">
                                    <div className="flex items-center">
                                        <span className="mr-3 text-gold-400">+</span>
                                        <span className="font-light text-stone-700">{item}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Why choose us */}
                    <div className="mb-16">
                        <h3 className="mb-8 font-serif text-2xl font-medium text-stone-800 text-center">
                            Dlaczego warto wybrać naszą ofertę?
                        </h3>

                        {/* Introduction paragraph */}
                        <div className="mb-8 text-center">
                            <p className="mx-auto max-w-3xl font-light italic text-stone-700 mb-4">
                                Wybierając naszą ofertę, otrzymujecie nie tylko usługę fotograficzną i filmową, 
                                ale przede wszystkim <span className="text-gold-600 font-medium">gwarancję profesjonalizmu</span> popartą 
                                długoletnim doświadczeniem i setkami zadowolonych par.
                            </p>
                        </div>

                        {/* Top 3 highlighted advantages */}
                        <div className="grid gap-6 md:grid-cols-3 mb-8">
                            <div className="bg-gold-50 p-6 rounded-lg shadow-md border border-gold-100 flex flex-col items-center text-center">
                                <span className="text-gold-500 text-4xl mb-4">20+</span>
                                <h4 className="text-stone-800 font-medium mb-2">Lat doświadczenia</h4>
                                <p className="text-stone-600 font-light">Setki zrealizowanych uroczystości i tysiące uwiecznionych wyjątkowych momentów</p>
                            </div>
                            
                            <div className="bg-gold-50 p-6 rounded-lg shadow-md border border-gold-100 flex flex-col items-center text-center">
                                <span className="text-gold-500 text-4xl mb-4">24h</span>
                                <h4 className="text-stone-800 font-medium mb-2">Ekspresowe zdjęcia</h4>
                                <p className="text-stone-600 font-light">Pierwsze zdjęcia otrzymacie już następnego dnia po uroczystości</p>
                            </div>
                            
                            <div className="bg-gold-50 p-6 rounded-lg shadow-md border border-gold-100 flex flex-col items-center text-center">
                                <span className="text-gold-500 text-4xl mb-4">0 zł</span>
                                <h4 className="text-stone-800 font-medium mb-2">Brak ukrytych kosztów</h4>
                                <p className="text-stone-600 font-light">Przejrzysty cennik i pełna transparentność bez niespodzianek</p>
                            </div>
                        </div>

                        {/* All advantages in expanded list */}
                        <div className="bg-section-background rounded-lg p-8 shadow-md">
                            <ul className="space-y-4">
                                <li className="flex items-start">
                                    <span className="mr-3 text-gold-500 text-lg">✓</span>
                                    <div>
                                        <h5 className="font-medium text-stone-800">Profesjonalne doświadczenie</h5>
                                        <span className="font-light text-sm text-stone-700">Ponad 20 lat doświadczenia i setki zrealizowanych uroczystości ślubnych</span>
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-3 text-gold-500 text-lg">✓</span>
                                    <div>
                                        <h5 className="font-medium text-stone-800">Pełne zaangażowanie</h5>
                                        <span className="font-light text-sm text-stone-700">Nigdy nie opuszczamy wesela bez wcześniejszej konsultacji — zostajemy z Wami do końca</span>
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-3 text-gold-500 text-lg">✓</span>
                                    <div>
                                        <h5 className="font-medium text-stone-800">Nastawienie na gości</h5>
                                        <span className="font-light text-sm text-stone-700">Chętnie uwiecznimy każdą grupę czy parę, która zapragnie pamiątkowego zdjęcia</span>
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-3 text-gold-600 text-lg">✓</span>
                                    <div>
                                        <h5 className="font-medium text-stone-800">Transparentna współpraca</h5>
                                        <span className="font-light text-sm text-stone-700">Przejrzysty cennik i bogaty pakiet podstawowy bez żadnych ukrytych kosztów — to co ustalamy na początku, obowiązuje do końca</span>
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-3 text-gold-500 text-lg">✓</span>
                                    <div>
                                        <h5 className="font-medium text-stone-800">Indywidualne podejście</h5>
                                        <span className="font-light text-sm text-stone-700">Każdy gość chętny do udziału w fotografii zostanie uwieczniony na zdjęciach i filmie</span>
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-3 text-gold-600 text-lg">✓</span>
                                    <div>
                                        <h5 className="font-medium text-stone-800">Ekspresowa realizacja</h5>
                                        <span className="font-light text-sm text-stone-700">Już następnego dnia po weselu otrzymacie pierwsze wybrane zdjęcia do publikacji w mediach społecznościowych (za Waszą zgodą)</span>
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-3 text-gold-500 text-lg">✓</span>
                                    <div>
                                        <h5 className="font-medium text-stone-800">Dyskretna obecność</h5>
                                        <span className="font-light text-sm text-stone-700">Działamy w tle, nie ingerujemy w przebieg uroczystości — będziemy tam, gdzie nas potrzebujecie</span>
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-3 text-gold-500 text-lg">✓</span>
                                    <div>
                                        <h5 className="font-medium text-stone-800">Szacunek dla komfortu gości</h5>
                                        <span className="font-light text-sm text-stone-700">Nie fotografujemy ani nie filmujemy osób podczas posiłków — szanujemy prywatność i komfort wszystkich uczestników</span>
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-3 text-gold-600 text-lg">✓</span>
                                    <div>
                                        <h5 className="font-medium text-stone-800">Profesjonalna selekcja materiału</h5>
                                        <span className="font-light text-sm text-stone-700">Niefortunne sytuacje czy niechciane momenty nigdy nie trafią do finalnych materiałów — otrzymacie tylko najlepsze ujęcia</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        
                        {/* Final note */}
                        <div className="mt-8 text-center">
                            <p className="mx-auto max-w-3xl text-stone-600 font-light">
                                Naszym priorytetem jest zadowolenie Pary Młodej i stworzenie pamiątki, 
                                do której będziecie wracać z uśmiechem przez długie lata.
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <Button
                            href={routes.contact.route}
                            variant="hero"
                            className="px-8 py-4"
                        >
                            SPRAWDŹ DOSTĘPNOŚĆ
                        </Button>
                    </div>
                </div>
            </section>

            {/* Other Services Section */}
            <section className="w-full bg-section-background py-16 md:py-24 mt-16 px-4">
                <div className="mx-auto">
                    <SectionTitle
                        title="Pozostałe usługi"
                        subtitle="Inne usługi fotograficzne i filmowe"
                    />

                    <div className="mx-auto max-w-4xl">
                        <div className="mb-12 text-center">
                            <p className="mx-auto max-w-3xl font-light leading-relaxed text-stone-600 mb-4">
                                Poza kompleksową obsługą ślubną, oferujemy również szereg innych specjalistycznych usług fotograficznych i filmowych. Jeśli poszukujesz rozwiązań niewymienionych poniżej, zachęcamy do bezpośredniego kontaktu — z przyjemnością omówimy Twoje indywidualne potrzeby.
                            </p>
                        </div>

                        <div className="grid gap-8 md:grid-cols-2">
                            {/* Restoration Service */}
                            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                <div className="h-60 overflow-hidden">
                                    <img
                                        src="https://images.unsplash.com/photo-1607462109225-6b64ae2dd3cb?q=80&w=600&h=400"
                                        alt="Renowacja i retusz zdjęć"
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className="font-serif text-xl font-medium text-stone-800 mb-2">Renowacja i retusz zdjęć</h3>
                                    <p className="font-light text-stone-600">Przywrócimy blask Twoim cennym wspomnieniom — profesjonalna renowacja i artystyczny retusz każdego rodzaju fotografii</p>
                                </div>
                            </div>

                            {/* VHS Conversion Service */}
                            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                <div className="h-60 overflow-hidden">
                                    <img
                                        src="https://images.unsplash.com/photo-1611209009772-d40fd03d510d?q=80&w=600&h=400"
                                        alt="Przegrywanie kaset VHS"
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className="font-serif text-xl font-medium text-stone-800 mb-2">Przegrywanie kaset VHS</h3>
                                    <p className="font-light text-stone-600">Uchronimy Twoje archiwalne nagrania przed bezpowrotnym zniszczeniem — profesjonalna cyfryzacja kaset VHS i innych formatów analogowych</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 flex justify-center">
                            <Button
                                href={routes.contact.route}
                                variant="default"
                            >
                                ZAPYTAJ O SZCZEGÓŁY
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </PageContainer>
    );
}