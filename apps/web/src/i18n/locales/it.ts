export default {
  common: {
    loading: 'Caricamento...',
    error: 'Si è verificato un errore',
    retry: 'Riprova',
    save: 'Salva',
    cancel: 'Annulla',
    delete: 'Elimina',
    edit: 'Modifica',
    close: 'Chiudi',
    confirm: 'Conferma',
    back: 'Indietro',
    next: 'Avanti',
    yes: 'Sì',
    no: 'No',
    or: 'o',
    required: 'Campo obbligatorio',
    learnMore: 'Scopri di più',
    requestInfo: 'Richiedi informazioni',
    freeConsultation: 'Consulenza gratuita',
  },
  nav: {
    home: 'Home',
    about: 'Chi Sono',
    services: 'Servizi',
    why: 'Perché Scegliermi',
    contact: 'Contatti',
    blog: 'News',
    dashboard: 'Dashboard',
    profile: 'Profilo',
    logout: 'Esci',
    cta: 'Consulenza Gratuita',
  },
  auth: {
    login: 'Accedi',
    logout: 'Esci',
    register: 'Registrati',
    email: 'Email',
    password: 'Password',
    forgotPassword: 'Password dimenticata?',
    resetPassword: 'Reimposta password',
    loginError: 'Email o password non corretti',
    loginSuccess: 'Accesso effettuato',
    logoutSuccess: 'Disconnesso correttamente',
    signInWithGoogle: 'Accedi con Google',
    backToSite: '← Torna al sito',
  },
  cookie: {
    title: 'Utilizziamo i cookie',
    description:
      'Questo sito utilizza cookie tecnici necessari al funzionamento e, con il tuo consenso, cookie analitici per migliorare l\'esperienza. Rispettiamo la tua privacy in conformità con GDPR e LPD svizzera.',
    accept: 'Accetta tutti',
    reject: 'Solo necessari',
    preferences: 'Gestisci preferenze',
    privacyPolicy: 'Privacy Policy',
    learnMore: 'Scopri di più',
    necessaryTitle: 'Cookie necessari',
    necessaryDesc: 'Essenziali per il funzionamento del sito. Non possono essere disattivati.',
    alwaysActive: 'Sempre attivi',
    analyticsTitle: 'Cookie analitici',
    analyticsDesc: 'Ci aiutano a capire come viene usato il sito per migliorarlo.',
    marketingTitle: 'Cookie marketing',
    marketingDesc: 'Utilizzati per mostrarti contenuti pertinenti ai tuoi interessi.',
  },
  errors: {
    notFound: 'Pagina non trovata',
    notFoundDesc: 'La pagina che cerchi non esiste o è stata spostata.',
    serverError: 'Errore del server',
    serverErrorDesc: 'Si è verificato un errore imprevisto. Riprova tra qualche minuto.',
    goHome: 'Torna alla home',
    unknown: 'Si è verificato un errore imprevisto.',
  },

  // ─── HOME ────────────────────────────────────────────
  home: {
    title: 'Home',
    description:
      'Consulenza assicurativa personalizzata in provincia di Varese. Polizze auto, casa, salute, previdenza e impresa.',
    heroTitle: 'Proteggi ciò che conta,',
    heroTitleAccent: 'con chi ti ascolta davvero.',
    heroSubtitle:
      'Consulenza assicurativa su misura in provincia di Varese. Ti aiuto a trovare la protezione giusta per te, la tua famiglia e la tua attività.',
    ctaPrimary: 'Parliamone Insieme',
    ctaSecondary: 'Scopri i Servizi',

    // Services preview on home
    servicesTitle: 'Come posso aiutarti',
    servicesSubtitle: 'Soluzioni assicurative personalizzate per ogni esigenza della tua vita',

    // CTA banner
    ctaTitle: 'Pronto a proteggere ciò che ami?',
    ctaText:
      'Contattami per una consulenza gratuita e senza impegno. Insieme troveremo la soluzione più adatta alle tue esigenze.',
    ctaButton: 'Richiedi una Consulenza',
  },

  // ─── CHI SONO ────────────────────────────────────────
  about: {
    title: 'Chi Sono',
    subtitle: 'Il tuo punto di riferimento assicurativo sul territorio',
    teaserTitle: 'Chi Sono',
    teaserText:
      'Sono Boscolo Luca, consulente assicurativo con esperienza nel settore. Opero in provincia di Varese con un approccio consulenziale e personalizzato: ascolto le tue esigenze, analizzo la tua situazione e ti propongo le soluzioni più adatte per proteggere te, la tua famiglia e il tuo patrimonio.',
    bio: '[PLACEHOLDER_BIO]',
    learnMore: 'Scopri di più',
    points: {
      experience: 'Esperienza consolidata nel settore assicurativo',
      territory: 'Profonda conoscenza del territorio varesino',
      approach: 'Approccio consulenziale e personalizzato',
      rui: 'Iscritto al RUI — Sezione E',
    },
  },

  // ─── SERVIZI (dettagliati) ───────────────────────────
  services: {
    title: 'I Servizi',
    subtitle: 'Ogni area della tua vita merita la giusta protezione',
    ctaGeneric: 'Richiedi Info',
    backToServices: '← Tutti i servizi',
    exploreAll: 'Esplora tutti i servizi',

    // Used on home preview
    item1: { title: 'Auto e Mobilità', desc: 'RC Auto, moto, veicoli commerciali e flotte.' },
    item2: { title: 'Casa e Patrimonio', desc: 'Protezione abitazione, condominio e RC.' },
    item3: { title: 'Salute e Famiglia', desc: 'Polizze sanitarie, infortuni, protezione reddito.' },
    placeholder: '',

    auto: {
      title: 'Auto e Mobilità',
      subtitle: 'Viaggia sicuro, ogni giorno',
      desc: 'Dalla RC Auto obbligatoria alle coperture complete per ogni tipo di veicolo. Ti aiuto a trovare la polizza più conveniente senza rinunciare alle garanzie che contano.',
      image: '/images/services/auto.jpg',
      items: {
        rcAuto: {
          title: 'RC Auto',
          desc: 'Assicurazione obbligatoria per la responsabilità civile. Confronto tra le migliori offerte per trovare il rapporto qualità-prezzo ideale per te.',
        },
        furtoIncendio: {
          title: 'Furto e Incendio',
          desc: 'Proteggi il valore del tuo veicolo da furto, incendio e atti vandalici con garanzie su misura.',
        },
        kasko: {
          title: 'Kasko e Collisione',
          desc: 'Copertura completa per danni al tuo veicolo, anche in caso di sinistro con colpa. Ideale per auto di valore.',
        },
        moto: {
          title: 'Moto e Scooter',
          desc: 'Polizze dedicate al mondo delle due ruote, con garanzie specifiche per motociclisti e sospensione invernale.',
        },
        veicoliCommerciali: {
          title: 'Veicoli Commerciali',
          desc: 'Soluzioni per furgoni, autocarri e mezzi da lavoro. Protezione su misura per chi usa il veicolo per la propria attività.',
        },
        flotte: {
          title: 'Flotte Aziendali',
          desc: 'Gestione assicurativa centralizzata per parchi auto aziendali, con condizioni dedicate e assistenza prioritaria.',
        },
      },
    },

    casa: {
      title: 'Casa e Patrimonio',
      subtitle: 'Tutela il tuo mondo',
      desc: 'La casa è il bene più prezioso. Dall\'incendio alle catastrofi naturali, dalla responsabilità civile alla tutela del condominio: ti aiuto a proteggerla a 360°.',
      image: '/images/services/casa.jpg',
      items: {
        incendio: {
          title: 'Incendio e Scoppio',
          desc: 'Copertura base per danni da incendio, esplosione e scoppio. Proteggi la struttura e il contenuto della tua abitazione.',
        },
        furto: {
          title: 'Furto in Abitazione',
          desc: 'Rimborso per furto, rapina e danni da effrazione. Valutazione accurata del contenuto per una copertura adeguata.',
        },
        catastrofi: {
          title: 'Eventi Atmosferici e Catastrofi',
          desc: 'Protezione contro grandine, alluvioni, terremoti e altri eventi naturali. Sempre più importante nel contesto climatico attuale.',
        },
        rc: {
          title: 'RC della Famiglia',
          desc: 'Responsabilità civile per danni causati a terzi da te o dai tuoi familiari nella vita quotidiana.',
        },
        condominio: {
          title: 'Polizza Condominio',
          desc: 'Copertura globale per il fabbricato condominiale: parti comuni, RC dell\'amministratore, danni da acqua.',
        },
        tutelaLegale: {
          title: 'Tutela Legale',
          desc: 'Assistenza legale per controversie legate alla proprietà immobiliare: vicinato, contratti, locazioni.',
        },
      },
    },

    salute: {
      title: 'Salute e Famiglia',
      subtitle: 'La salute prima di tutto',
      desc: 'Proteggi te e la tua famiglia con coperture sanitarie complete. Dalle spese mediche agli infortuni, dalla protezione del reddito alle polizze vita.',
      image: '/images/services/salute.jpg',
      items: {
        speseMediche: {
          title: 'Spese Mediche e Ricovero',
          desc: 'Rimborso per visite specialistiche, interventi chirurgici, ricoveri e diagnostica. Accesso rapido alle cure senza liste d\'attesa.',
        },
        infortuni: {
          title: 'Infortuni',
          desc: 'Protezione economica in caso di infortunio con invalidità temporanea o permanente. Copertura 24h, professionale ed extra-professionale.',
        },
        malattieGravi: {
          title: 'Malattie Gravi',
          desc: 'Capitale immediato in caso di diagnosi di patologie gravi (tumore, infarto, ictus). Per affrontare la malattia con serenità economica.',
        },
        protezioneReddito: {
          title: 'Protezione del Reddito',
          desc: 'Indennità giornaliera in caso di impossibilità a lavorare per malattia o infortunio. Tutela il tuo tenore di vita.',
        },
        vita: {
          title: 'Polizza Vita',
          desc: 'Protezione per i tuoi cari in caso di premorienza. Capitale o rendita ai beneficiari per garantire la stabilità della famiglia.',
        },
        animali: {
          title: 'Animali Domestici',
          desc: 'Copertura veterinaria e RC per cani e gatti. Perché anche loro fanno parte della famiglia.',
        },
      },
    },

    previdenza: {
      title: 'Previdenza e Risparmio',
      subtitle: 'Costruisci il tuo futuro',
      desc: 'Pianifica oggi per vivere sereno domani. Dalla pensione integrativa ai piani di accumulo, ti aiuto a costruire un percorso di risparmio su misura.',
      image: '/images/services/previdenza.jpg',
      items: {
        pensioneIntegrativa: {
          title: 'Pensione Integrativa',
          desc: 'Fondi pensione per integrare la pensione pubblica. Vantaggi fiscali immediati e un futuro più sereno.',
        },
        pip: {
          title: 'Piani Individuali Pensionistici (PIP)',
          desc: 'Strumenti flessibili per la previdenza complementare con possibilità di scelta tra diverse linee di investimento.',
        },
        pac: {
          title: 'Piani di Accumulo (PAC)',
          desc: 'Risparmio programmato con versamenti periodici. Costruisci il tuo capitale gradualmente, senza stress.',
        },
        investimentoAssicurativo: {
          title: 'Investimento Assicurativo',
          desc: 'Polizze unit-linked e gestioni separate per far crescere il tuo patrimonio con la protezione assicurativa.',
        },
        tfr: {
          title: 'Gestione TFR',
          desc: 'Consulenza sulla destinazione del TFR: fondo pensione o azienda? Ti aiuto a fare la scelta giusta.',
        },
      },
    },

    impresa: {
      title: 'Impresa e Professionisti',
      subtitle: 'Proteggi la tua attività',
      desc: 'Dalla responsabilità civile professionale alla tutela del patrimonio aziendale. Soluzioni su misura per imprenditori, artigiani e liberi professionisti.',
      image: '/images/services/impresa.jpg',
      items: {
        rcProfessionale: {
          title: 'RC Professionale',
          desc: 'Obbligatoria per molte professioni. Copertura per danni causati a terzi nell\'esercizio della professione.',
        },
        rcImpresa: {
          title: 'RC Impresa (RCT/RCO)',
          desc: 'Responsabilità civile verso terzi e dipendenti. Fondamentale per qualsiasi attività produttiva o commerciale.',
        },
        multirischio: {
          title: 'Multirischio Azienda',
          desc: 'Pacchetto completo: incendio, furto, danni elettrici, RC, interruzione attività. Una polizza, tutta la protezione.',
        },
        cyber: {
          title: 'Cyber Risk',
          desc: 'Protezione contro attacchi informatici, data breach e ransomware. Sempre più essenziale nell\'era digitale.',
        },
        tutelaLegale: {
          title: 'Tutela Legale Impresa',
          desc: 'Assistenza legale per controversie commerciali, fiscali e giuslavoristiche. Difendi i tuoi diritti senza pensieri.',
        },
        dAndO: {
          title: 'D&O (Directors & Officers)',
          desc: 'Protezione personale per amministratori e dirigenti contro azioni di responsabilità patrimoniale.',
        },
      },
    },
  },

  // ─── PERCHÉ SCEGLIERMI ──────────────────────────────
  why: {
    title: 'Perché Scegliermi',
    subtitle: 'Cosa mi distingue',
    consulenza: {
      title: 'Consulenza Personalizzata',
      desc: 'Non vendo polizze, trovo soluzioni. Ogni situazione è diversa e merita un\'analisi dedicata.',
    },
    territorio: {
      title: 'Presente sul Territorio',
      desc: 'Opero in provincia di Varese. Ci incontriamo di persona, quando vuoi.',
    },
    trasparenza: {
      title: 'Trasparenza Totale',
      desc: 'Ti spiego ogni clausola, ogni copertura, ogni costo. Nessuna sorpresa.',
    },
    assistenza: {
      title: 'Assistenza Continua',
      desc: 'Non sparisco dopo la firma. Sono qui per ogni esigenza, sinistro o aggiornamento.',
    },
  },

  // ─── COME FUNZIONA ──────────────────────────────────
  process: {
    title: 'Come Funziona',
    subtitle: 'Quattro passi verso la tua protezione',
    step1: {
      title: 'Contattami',
      desc: 'Compila il form o chiamami direttamente. Il primo passo è sempre il più semplice.',
    },
    step2: {
      title: 'Analizziamo Insieme',
      desc: 'Capiamo le tue esigenze reali, senza fretta e senza pressioni.',
    },
    step3: {
      title: 'Proposta Su Misura',
      desc: 'Ti presento le soluzioni più adatte, spiegandoti tutto nel dettaglio.',
    },
    step4: {
      title: 'Protezione Attiva',
      desc: 'Sei coperto, e io resto il tuo riferimento per qualsiasi necessità futura.',
    },
  },

  // ─── CONTATTI ────────────────────────────────────────
  contact: {
    title: 'Contatti',
    subtitle: 'Parliamo della tua protezione. Scrivimi, ti rispondo entro 24 ore.',
    name: 'Nome',
    namePlaceholder: 'Il tuo nome',
    email: 'Email',
    emailPlaceholder: "tua{'@'}email.com",
    phone: 'Telefono',
    phonePlaceholder: '+39 000 000 0000',
    subject: 'Argomento',
    subjectPlaceholder: 'Seleziona un argomento',
    subjectOptions: {
      auto: 'Auto e Mobilità',
      casa: 'Casa e Patrimonio',
      salute: 'Salute e Famiglia',
      previdenza: 'Previdenza e Risparmio',
      impresa: 'Impresa e Professionisti',
      altro: 'Altro',
    },
    message: 'Messaggio',
    messagePlaceholder: 'Raccontami le tue esigenze...',
    send: 'Invia Messaggio',
    successTitle: 'Messaggio inviato!',
    successText: 'Grazie per avermi contattato. Ti risponderò entro 24 ore.',
    sendAnother: 'Invia un altro messaggio',
    privacyNote: 'Inviando accetti la nostra',
    infoTitle: 'Contatti diretti',
    hours: 'Lun–Ven, 9:00–18:00',
    submitError: 'Errore durante l\'invio. Riprova.',
  },

  // ─── FOOTER ──────────────────────────────────────────
  footer: {
    ruiLabel: 'Intermediario assicurativo iscritto al RUI — Sezione E',
    agencyLabel: 'Collaboratore dell\'Agenzia',
    ivassNote: 'Ogni intermediario è soggetto alla vigilanza dell\'IVASS',
    ivassRegistry: 'Registro pubblico IVASS',
    privacy: 'Privacy Policy',
    cookies: 'Cookie Policy',
  },

  // ─── BLOG (kept for admin/blog feature) ──────────────
  blog: {
    title: 'News & Aggiornamenti',
    subtitle: 'Ultime notizie dal nostro team',
    readMore: 'Leggi tutto',
    empty: 'Nessun articolo pubblicato.',
    back: '← Blog',
    loading: 'Caricamento articolo...',
  },

  // ─── ADMIN ───────────────────────────────────────────
  admin: {
    posts: 'Post e News',
    contacts: 'Messaggi',
    newPost: 'Nuovo post',
    editPost: 'Modifica post',
    titleRequired: 'Titolo *',
    titlePlaceholder: 'Titolo del post',
    excerptLabel: 'Anteprima',
    excerptPlaceholder: 'Breve descrizione (opzionale)',
    bodyRequired: 'Contenuto *',
    bodyPlaceholder: 'Scrivi il contenuto del post in HTML o testo semplice...',
    settings: 'Impostazioni',
    statusLabel: 'Stato',
    languageLabel: 'Lingua',
    slugRequired: 'Slug (URL) *',
    published: 'Pubblicato',
    draft: 'Bozza',
    publish: 'Pubblica',
    unpublish: 'Nascondi',
    confirmDelete: 'Eliminare questo post?',
    noPosts: 'Nessun post ancora.',
    saving: 'Salvataggio...',
    saveError: 'Errore nel salvataggio',
    unsavedChanges: 'Hai modifiche non salvate. Vuoi davvero uscire?',
    colTitle: 'Titolo',
    colLanguage: 'Lingua',
    colStatus: 'Stato',
    colDate: 'Data',
    colActions: 'Azioni',
    contactsTitle: 'Messaggi ricevuti',
    unread: 'non letti',
    subjectLabel: 'Oggetto:',
    replyByEmail: 'Rispondi via email →',
    selectMessage: 'Seleziona un messaggio per leggerlo',
    noMessages: 'Nessun messaggio.',
    backToSite: '← Torna al sito',
  },
}
