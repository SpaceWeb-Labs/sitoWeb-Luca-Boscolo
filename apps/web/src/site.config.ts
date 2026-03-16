export const siteConfig = {
  // Identità
  name: 'Boscolo Luca',
  title: 'Consulente Assicurativo',
  fullTitle: 'Boscolo Luca — Consulente Assicurativo in Provincia di Varese',
  description:
    'Consulenza assicurativa personalizzata in provincia di Varese. Polizze auto, casa, salute, previdenza e impresa. Contattami per un preventivo gratuito.',

  // Contatti
  email: 'PLACEHOLDER@email.com',
  phone: '+39 000 000 0000',
  area: 'Provincia di Varese (VA)',
  hours: 'Lun-Ven 9:00-18:00',

  // Legal / IVASS
  piva: '00000000000',
  ruiNumber: 'E000000000',
  ruiSection: 'E',
  ruiDate: 'GG/MM/AAAA',
  agencyName: 'PLACEHOLDER Nome Agenzia',
  agencyCity: 'PLACEHOLDER Città',
  ivassRegistryUrl: 'https://ruipubblico.ivass.it/rui-pubblica/ng/#/home',
  // Decommentare SOLO se autorizzato dall'agente principale:
  // distributedCompanies: ['Generali Italia S.p.A.'],

  // Form contatti
  formspreeEndpoint: 'https://formspree.io/f/PLACEHOLDER',

  // SEO
  siteUrl: 'https://PLACEHOLDER.it',
  ogImage: '/og-image.jpg',

  // Navigazione (sezioni single-page)
  sections: [
    { id: 'chi-sono', label: 'nav.about' },
    { id: 'servizi', label: 'nav.services' },
    { id: 'perche', label: 'nav.why' },
    { id: 'contatti', label: 'nav.contact' },
  ],
} as const
