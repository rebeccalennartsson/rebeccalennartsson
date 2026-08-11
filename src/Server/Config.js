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
        },
        {
            title: 'BEGRAVNING',
            texts: [
                'Begravning är en känslofylld dag, full med minnen men främst avsked. Rebecca har flertalet gånger haft det ärofyllda uppdraget att genom sång hjälpa anhöriga ta avsked. Ni varmt välkomna att kontaka Rebecca, hon hjälper er gärna.',
                'Hon medverkar vid begravningar i Göteborgs kyrkor och kapell.',
            ],
            disabled: false,
        },
        {
            title: 'DOP',
            texts: [
                'Planerar ni att förgylla kommande dop med sång? Då är ni varmt välkomna att kontakta Rebecca så hjälper hon er!',
                'Rebecca sjunger vid dop i Göteborg och närliggande orter.',
            ],
            disabled: false,
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
