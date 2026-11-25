const accompaniment = 'I kyrkan sjunger Rebecca tillsammans med församlingens organist eller pianist, och hon kan även ta med en egen pianist eller gitarrist.';

const accompanimentFaq = {
    question: 'Vem ackompanjerar sången?',
    answer: accompaniment,
};

const priceFaq = {
    question: 'Vad kostar det?',
    answer: 'Priset beror på datum, plats och hur mycket sång ni vill ha. Kontakta Rebecca med era önskemål så får ni ett pris.',
};

const areaFaq = {
    question: 'Var sjunger Rebecca?',
    answer: 'I Göteborg med omnejd, och även i Bohuslän, Halland, Dalsland, Skaraborg och norra Småland – bland annat i Kungsbacka, Varberg, Borås, Alingsås, Kungälv, Trollhättan, Vänersborg, Uddevalla och Jönköping.',
};

export const Config = {
    pages: [
        {
            title: 'OM',
            texts: [
                'Rebecca är utbildad musikalartist vid Balettakademien i Göteborg och har studerat sång sen 2010.',
                'Hon är verksam som sångerska i Göteborg med omnejd och tar emot uppdrag i Bohuslän, Halland, Dalsland, Skaraborg och norra Småland – bland annat i Kungsbacka, Varberg, Borås, Alingsås, Kungälv, Trollhättan, Vänersborg, Uddevalla och Jönköping.',
                'Hon blev 2021 tilldelad ett stipendie från Eduard Magnus Musikfond för fortsatta studier inom opera.',
                'Rebecca är godkänd för F-skatt.'
            ],
            disabled: false,
        },
        {
            title: 'BRÖLLOP',
            texts: [
                'Planerar ni för ert kommande bröllop? Rebecca har många års erfarenhet av att sjunga på bröllop och har en bred repertoar. Varmt välkomna att kontakta Rebecca så hjälper hon er med sång på er stora dag!',
                'Rebecca sjunger på bröllop i kyrkor och festlokaler i Göteborg med omnejd.',
            ],
            disabled: false,
            slug: 'brollop',
            article: {
                linkText: 'Läs mer om sång på bröllop',
                metaTitle: 'Sångerska till bröllop i Göteborg – Rebecca Lennartsson',
                metaDescription: 'Boka sångerska till ert bröllop i Göteborg med omnejd. Sång till vigseln, middagen och första dansen – Rebecca Lennartsson, utbildad musikalartist.',
                heading: 'Sångerska till bröllop i Göteborg',
                serviceType: 'Bröllopssång',
                contactSubject: 'Bröllop',
                lead: 'Musiken är en av de saker gästerna minns längst från ett bröllop. Här kan ni läsa hur ni får till sången på er stora dag – och hur Rebecca Lennartsson kan hjälpa er, i Göteborg med omnejd.',
                sections: [
                    {
                        heading: 'Därför gör sången skillnad',
                        texts: [
                            'En vigsel är kort, men den bär hela dagen. När ni går in, när ni har sagt ja och när ni går ut som gifta – det är i de ögonblicken en levande röst gör mest. Sång live fyller rummet på ett sätt som en högtalare aldrig gör, och den ger gästerna en stund att känna efter.',
                            'En erfaren sångerska vet också hur en ceremoni rör sig: när sången ska börja, hur lång den ska vara och hur den följer prästen eller officianten. Då kan ni släppa musiken och vara närvarande.',
                        ],
                    },
                    {
                        heading: 'Så får ni till musiken på bröllopet',
                        texts: [
                            'Börja med vigseln. Vanligast är sång vid inmarschen, mitt i ceremonin och vid utmarschen. Välj gärna en sång som betyder något för er två – en psalm, en klassisk kärlekssång eller en poplåt ni har en historia med.',
                            'Tänk sedan på resten av dagen. Sång under minglet, till middagen eller till första dansen gör att musiken följer med från vigseln till festen.',
                            'Boka i god tid. Lördagar under sommaren går åt först, så hör av er så snart ni har ett datum.',
                            'Stäm av med kyrkan eller lokalen. I kyrkan planeras musiken tillsammans med prästen och kyrkomusikern. I en festlokal är det bra att veta om det finns piano och ljudanläggning.',
                        ],
                    },
                    {
                        heading: 'Därför passar Rebecca för ert bröllop',
                        texts: [
                            'Rebecca Lennartsson är utbildad musikalartist vid Balettakademien i Göteborg och har studerat sång sedan 2010. Hon har många års erfarenhet av att sjunga på bröllop, har en bred repertoar och sjunger i kyrkor och festlokaler i Göteborg med omnejd – bland annat i Kungsbacka, Kungälv, Alingsås, Borås och Uddevalla.',
                            accompaniment,
                            'Innan bröllopet hörs ni på telefon eller ses för att planera musiken, och era låtönskemål är varmt välkomna.',
                            'Rebecca är godkänd för F-skatt.',
                        ],
                    },
                ],
                faq: [
                    {
                        question: 'Hur långt i förväg ska vi boka sångerska till bröllopet?',
                        answer: 'Så snart ni har ett datum. Populära helger under bröllopssäsongen bokas tidigt, så kontakta gärna Rebecca redan när ni bokar kyrka eller lokal.',
                    },
                    {
                        question: 'Kan vi önska vilka låtar som ska sjungas?',
                        answer: 'Ja. Era låtönskemål är varmt välkomna, och Rebecca hjälper er gärna att hitta en sång som passar om ni är osäkra.',
                    },
                    {
                        question: 'Träffar vi Rebecca innan bröllopet?',
                        answer: 'Ja. Innan dagen hörs ni på telefon eller ses för att gå igenom ceremonin, låtarna och var i programmet sången ska ligga.',
                    },
                    accompanimentFaq,
                    priceFaq,
                    areaFaq,
                ],
            },
        },
        {
            title: 'BEGRAVNING',
            texts: [
                'Begravning är en känslofylld dag, full med minnen men främst avsked. Rebecca har flertalet gånger haft det ärofyllda uppdraget att genom sång hjälpa anhöriga ta avsked. Ni varmt välkomna att kontaka Rebecca, hon hjälper er gärna.',
                'Hon medverkar vid begravningar i Göteborgs kyrkor och kapell.',
            ],
            disabled: false,
            slug: 'begravning',
            article: {
                linkText: 'Läs mer om sång vid begravning',
                metaTitle: 'Sång vid begravning i Göteborg – Rebecca Lennartsson, sångerska',
                metaDescription: 'Sångerska till begravning och minnesstund i Göteborg med omnejd. Rebecca Lennartsson hjälper er att välja sång som hedrar den ni minns.',
                heading: 'Sång vid begravning i Göteborg',
                serviceType: 'Begravningssång',
                contactSubject: 'Begravning',
                lead: 'Musiken på en begravning säger ofta det som är svårt att säga med ord. Här kan ni läsa hur sången brukar gå till och hur Rebecca Lennartsson kan hjälpa er, i Göteborg med omnejd.',
                sections: [
                    {
                        heading: 'Sångens plats i ett avsked',
                        texts: [
                            'En begravning är en dag full av minnen och av avsked. En sång kan samla rummet, ge plats för sorgen och låta den ni minns vara nära en stund till.',
                            'Många väljer en sång som den avlidne tyckte om, eller en som säger något om livet ni delade. Det kan vara en psalm, en visa eller en sång som har betytt mycket för familjen.',
                        ],
                    },
                    {
                        heading: 'Så går det till',
                        texts: [
                            'Musiken planeras oftast tillsammans med prästen eller officianten och, i kyrkan, med församlingens kyrkomusiker. Berätta gärna för begravningsbyrån eller prästen att ni vill ha en solist, så blir det enkelt att få ihop programmet.',
                            'Det är ofta kort tid fram till begravningen. Hör av er så snart ni vet datum och plats.',
                            'Ni behöver inte ha bestämt några sånger innan ni hör av er. Rebecca hjälper er gärna att hitta en som passar.',
                        ],
                    },
                    {
                        heading: 'Rebecca hjälper er',
                        texts: [
                            'Rebecca Lennartsson har flertalet gånger haft det ärofyllda uppdraget att genom sång hjälpa anhöriga ta avsked. Hon är utbildad musikalartist vid Balettakademien i Göteborg och medverkar vid begravningar i Göteborgs kyrkor och kapell.',
                            accompaniment,
                            'Innan begravningen hörs ni på telefon eller ses för att gå igenom musiken i lugn och ro.',
                        ],
                    },
                ],
                faq: [
                    {
                        question: 'Hur snabbt kan vi boka sång till en begravning?',
                        answer: 'Hör av er så snart ni vet datum och plats, så återkommer Rebecca så fort hon kan.',
                    },
                    {
                        question: 'Kan vi välja en sång som den avlidne tyckte om?',
                        answer: 'Ja. Era önskemål är varmt välkomna, och Rebecca hjälper er gärna om ni inte vet vad ni ska välja.',
                    },
                    accompanimentFaq,
                    priceFaq,
                    areaFaq,
                ],
            },
        },
        {
            title: 'DOP',
            texts: [
                'Planerar ni att förgylla kommande dop med sång? Då är ni varmt välkomna att kontakta Rebecca så hjälper hon er!',
                'Rebecca sjunger vid dop i Göteborg och närliggande orter.',
            ],
            disabled: false,
            slug: 'dop',
            article: {
                linkText: 'Läs mer om sång vid dop',
                metaTitle: 'Sång vid dop i Göteborg – Rebecca Lennartsson, sångerska',
                metaDescription: 'Boka sångerska till dopet i Göteborg och närliggande orter. Rebecca Lennartsson, utbildad musikalartist, hjälper er att välja sång.',
                heading: 'Sång vid dop i Göteborg',
                serviceType: 'Dopsång',
                contactSubject: 'Dop',
                lead: 'Ett dop är en av livets första stora dagar. En sång gör stunden högtidlig och blir ett minne för hela familjen. Så här får ni till sången – och så kan Rebecca Lennartsson hjälpa er.',
                sections: [
                    {
                        heading: 'Därför sång på dopet',
                        texts: [
                            'Ett dop är ofta en kort ceremoni, och sången blir lätt det ögonblick familjen pratar om efteråt. Den ger dopet en högtidlig ram och en stund av eftertanke mitt i allt det praktiska med ett litet barn.',
                        ],
                    },
                    {
                        heading: 'Så får ni till musiken',
                        texts: [
                            'Vanligast är en sång i samband med själva dopet, och ibland en till när ceremonin avslutas. Det kan vara en psalm, en vaggvisa eller en sång som betyder något för er familj.',
                            'Prata med prästen om var i ceremonin sången passar bäst, och hör av er till Rebecca så snart ni har ett datum.',
                        ],
                    },
                    {
                        heading: 'Rebecca hjälper er',
                        texts: [
                            'Rebecca Lennartsson är utbildad musikalartist vid Balettakademien i Göteborg och sjunger vid dop i Göteborg och närliggande orter.',
                            accompaniment,
                            'Innan dopet hörs ni på telefon eller ses för att planera musiken, och era låtönskemål är varmt välkomna.',
                        ],
                    },
                ],
                faq: [
                    {
                        question: 'Kan vi önska vilken sång som ska sjungas på dopet?',
                        answer: 'Ja. Era önskemål är varmt välkomna, och Rebecca hjälper er gärna att välja om ni är osäkra.',
                    },
                    accompanimentFaq,
                    priceFaq,
                    areaFaq,
                ],
            },
        },
        {
            title: 'EVENT',
            texts: [
                'Rebecca är en erfaren eventsångerska och sjunger på fester, jubileer, företagsevent och julfester i Göteborg med omnejd. Varmt välkomna att höra av er så skapar ni tillsammans en kväll att minnas!',
            ],
            disabled: false,
            slug: 'event',
            article: {
                linkText: 'Läs mer om sång på event och julfester',
                metaTitle: 'Sångerska till event, fest och julbord i Göteborg – Rebecca Lennartsson',
                metaDescription: 'Boka en erfaren eventsångerska i Göteborg till fest, jubileum, företagsevent, julfest eller julbord. Rebecca Lennartsson, utbildad musikalartist.',
                heading: 'Sångerska till event och julfester i Göteborg',
                serviceType: 'Eventsång',
                contactSubject: 'Event',
                lead: 'En födelsedag, ett jubileum, en företagsfest eller ett julbord blir något extra med sång live. Här kan ni läsa hur ni planerar sången och hur Rebecca Lennartsson kan göra ert event minnesvärt, i Göteborg med omnejd.',
                sections: [
                    {
                        heading: 'Livesång lyfter ett firande',
                        texts: [
                            'Ett framträdande ger kvällen en höjdpunkt och samlar gästerna. Det skapar stämning på ett sätt som en spellista inte gör, och det blir något gästerna pratar om efteråt.',
                        ],
                    },
                    {
                        heading: 'Julfester och julbord',
                        texts: [
                            'Till jul är livesång ett enkelt sätt att göra julbordet eller företagets julfest lite mer högtidlig. Julsånger som alla känner igen skapar stämning och får gästerna att sjunga med.',
                            'December är den mest efterfrågade tiden för julfester, så boka gärna i god tid.',
                        ],
                    },
                    {
                        heading: 'Så planerar ni sången',
                        texts: [
                            'Bestäm var i kvällen sången ska ligga – till välkomstdrinken, under middagen eller som ett framträdande mellan talen.',
                            'Kolla med lokalen om det finns piano och ljudanläggning.',
                            'Hör av er i god tid med datum, plats och vilken sorts fest det är.',
                        ],
                    },
                    {
                        heading: 'Rebecca på ert event',
                        texts: [
                            'Rebecca Lennartsson är en erfaren eventsångerska och utbildad musikalartist vid Balettakademien i Göteborg. Hon har studerat sång sedan 2010 och sjunger på event och firanden i Göteborg med omnejd.',
                            'Hon kan ta med en egen pianist eller gitarrist. Innan eventet hörs ni på telefon eller ses för att planera musiken, och era låtönskemål är varmt välkomna.',
                            'Rebecca är godkänd för F-skatt.',
                        ],
                    },
                ],
                faq: [
                    {
                        question: 'Sjunger Rebecca på julbord och julfester?',
                        answer: 'Ja. Rebecca sjunger på julfester och julbord, både för företag och privata sällskap. Hör av er i god tid, december bokas snabbt.',
                    },
                    {
                        question: 'Kan vi önska låtar till vårt event?',
                        answer: 'Ja. Era låtönskemål är varmt välkomna, och Rebecca hjälper er gärna att sätta ihop ett program som passar tillfället.',
                    },
                    {
                        question: 'Vem ackompanjerar sången?',
                        answer: 'Rebecca kan ta med en egen pianist eller gitarrist.',
                    },
                    priceFaq,
                    areaFaq,
                ],
            },
        },
    ],
    settings: {
        youtube: [
            {
                disabled: true,
                title: "Utan dina andetag - cover Rebecca Lennartsson",
                src: "https://www.youtube.com/embed/SMLaPKJopuQ?controls=0&autoplay=1&mute=1",
                allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
                local: false,
                altText: null
            }
        ],
        mp3: [
            {
                disabled: false,
                title: "Ser du månen där du är ikväll? (Tillsammans igen)",
                src: "tillsammans_igen.mp3",
                allow: null,
                local: true,
                altText: "Ser du månen där du är ikväll? (Tillsammans igen) - cover Rebecca Lennartsson av Thomas Stenström"
            },
            {
                disabled: true,
                title: "Perfect",
                src: "tillsammans_igen.mp3",
                allow: null,
                local: true,
                altText: "perfect - cover Rebecca Lennartsson - av Ed Sheeran"
            }
        ],
        contact: {
            email: "rebeccalennartsson1@gmail.com",
            disabled: false,
        },
        hero: {
            tagline: 'Sångerska i Göteborg',
            services: 'Bröllop · Begravning · Dop · Event',
        }
    }
};
