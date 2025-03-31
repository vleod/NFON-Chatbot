
export interface NFONProduct {
  id: string;
  name: string;
  description: string;
  category: 'voicebot' | 'chatbot' | 'livechat' | 'speech-to-text' | 'general-ai';
  keyFeatures: string[];
  useCases: string[];
  icon: string;
}

export const nfonProducts: NFONProduct[] = [
  {
    id: 'botario-voicebot',
    name: 'Botario Voicebot',
    description: 'Intelligente Sprachassistenten zur automatisierten Bearbeitung von Anrufen und sprachgesteuerten Interaktionen mit nahtloser Integration in Ihre bestehenden Systeme.',
    category: 'voicebot',
    keyFeatures: [
      'Natural language processing',
      '24/7 availability',
      'Seamless call routing',
      'Multi-language support',
      'Integration with CRM systems'
    ],
    useCases: [
      'Automatisierte Kundenservice-Anrufe',
      'Terminvereinbarung und -verwaltung',
      'Häufige Fragen beantworten',
      'Bestellstatus-Abfragen'
    ],
    icon: 'phone'
  },
  {
    id: 'nfon-chatbot',
    name: 'NFON Chatbot',
    description: 'Automatisierte Textdialogsysteme für Websites, Portale oder Kundenservices mit intelligenter Fragebeantwortung und nahtloser Integration in bestehende digitale Plattformen.',
    category: 'chatbot',
    keyFeatures: [
      'Intuitive Gesprächsabläufe',
      'Omnichannel-Einsatz',
      'Individuelle Wissensdatenbank',
      'Übergabe an menschliche Agenten',
      'Analyse-Dashboard'
    ],
    useCases: [
      'Website Kundensupport',
      'Lead-Qualifizierung',
      'Produktempfehlungen',
      'Technische Fehlerbehebung'
    ],
    icon: 'message-circle'
  },
  {
    id: 'nfon-livechat',
    name: 'NFON LiveChat',
    description: 'Echtzeit-Chat-Lösung mit KI-Unterstützung für Kundenservice-Teams zur effizienten Kommunikation mit Website-Besuchern und persönlicher Beratung durch echte Mitarbeiter.',
    category: 'livechat',
    keyFeatures: [
      'KI-unterstützte Antwortvorschläge',
      'Besucherverfolgung',
      'Datei-Sharing',
      'Chat-Transkriptanalyse',
      'Proaktive Chat-Initiierung'
    ],
    useCases: [
      'Verkaufsunterstützung',
      'Kunden-Onboarding',
      'Technische Unterstützung',
      'Service-Upgrades'
    ],
    icon: 'messages-square'
  },
  {
    id: 'nfon-speech-to-text',
    name: 'NFON Speech-to-Text',
    description: 'Fortschrittliche Transkriptionstechnologie, die gesprochene Sprache in Text umwandelt für Dokumentation, Protokollierung und detaillierte Gesprächsanalysen mit höchster Präzision.',
    category: 'speech-to-text',
    keyFeatures: [
      'Hochpräzise Transkription',
      'Unterstützung mehrerer Sprachen',
      'Sprechererkennung',
      'Anpassbares Vokabular',
      'Echtzeit-Verarbeitung'
    ],
    useCases: [
      'Call-Center-Analysen',
      'Besprechungstranskription',
      'Compliance-Dokumentation',
      'Generierung von Kundeneinblicken'
    ],
    icon: 'mic'
  },
  {
    id: 'nfon-ai-suite',
    name: 'NFON AI Suite',
    description: 'Umfassende KI-Lösung, die mehrere Technologien kombiniert, um ein einheitliches Kundenkommunikationserlebnis über alle Kanäle hinweg zu schaffen und Prozesse zu optimieren.',
    category: 'general-ai',
    keyFeatures: [
      'Einheitliche Analyseplattform',
      'Kanalübergreifendes Mapping der Customer Journey',
      'KI-gestützte Workflow-Automatisierung',
      'Stimmungsanalyse',
      'Vorausschauender Kundenservice'
    ],
    useCases: [
      'Unternehmenskommunikationsstrategie',
      'Optimierung der Kundenerfahrung',
      'Business Intelligence',
      'Verbesserung der operativen Effizienz'
    ],
    icon: 'brain'
  }
];

export const sampleInquiries = [
  {
    id: '1',
    text: 'Wir suchen nach einer Lösung, die automatisch Kundenanrufe beantworten kann. Unser Call Center ist überlastet und wir würden gerne einige der häufigsten Anfragen automatisieren.',
    customer: 'Versicherung AG',
    date: '2023-10-15'
  },
  {
    id: '2',
    text: 'Unsere Website-Besucher benötigen oft sofortige Unterstützung. Gibt es eine Möglichkeit, einen Chat einzurichten, der von echten Mitarbeitern betreut wird, aber auch KI-Unterstützung hat?',
    customer: 'Online Shop GmbH',
    date: '2023-10-18'
  },
  {
    id: '3',
    text: 'Wir möchten unsere Kundengespräche analysieren, um Trends zu erkennen. Haben Sie ein Tool, das Anrufe transkribieren kann?',
    customer: 'Marktforschung KG',
    date: '2023-10-20'
  },
  {
    id: '4',
    text: 'Wir interessieren uns für eine KI-Lösung, die uns helfen kann, Kundenanfragen auf verschiedenen Kanälen zu beantworten. Was können Sie uns anbieten?',
    customer: 'Multinationale GmbH',
    date: '2023-10-22'
  },
  {
    id: '5',
    text: 'Unsere Webseite braucht einen Chatbot, der Kunden bei der Produktauswahl beraten kann. Haben Sie so etwas im Angebot?',
    customer: 'TechRetail AG',
    date: '2023-10-25'
  }
];
