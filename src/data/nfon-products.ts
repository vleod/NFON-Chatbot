
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
    description: 'AI-powered voice assistants that can handle customer calls, answer questions, and route callers to the right department.',
    category: 'voicebot',
    keyFeatures: [
      'Natural language processing',
      '24/7 availability',
      'Seamless call routing',
      'Multi-language support',
      'Integration with CRM systems'
    ],
    useCases: [
      'Customer service automation',
      'Appointment scheduling',
      'FAQ handling',
      'Order status inquiries'
    ],
    icon: 'phone'
  },
  {
    id: 'nfon-chatbot',
    name: 'NFON Chatbot',
    description: 'Intelligent text-based virtual assistants that can engage with customers on websites and messaging platforms.',
    category: 'chatbot',
    keyFeatures: [
      'Intuitive conversation flows',
      'Omnichannel deployment',
      'Custom knowledge base integration',
      'Handoff to human agents',
      'Analytics dashboard'
    ],
    useCases: [
      'Website customer support',
      'Lead qualification',
      'Product recommendations',
      'Technical troubleshooting'
    ],
    icon: 'message-circle'
  },
  {
    id: 'nfon-livechat',
    name: 'NFON LiveChat',
    description: 'Real-time chat solution with AI-assistance for customer service teams to engage with website visitors efficiently.',
    category: 'livechat',
    keyFeatures: [
      'AI-suggested responses',
      'Visitor tracking',
      'File sharing',
      'Chat transcript analysis',
      'Proactive chat initiation'
    ],
    useCases: [
      'Sales support',
      'Customer onboarding',
      'Technical assistance',
      'Service upgrades'
    ],
    icon: 'messages-square'
  },
  {
    id: 'nfon-speech-to-text',
    name: 'NFON Speech-to-Text',
    description: 'Advanced transcription technology that converts spoken language into written text for analysis and documentation.',
    category: 'speech-to-text',
    keyFeatures: [
      'High accuracy transcription',
      'Multiple language support',
      'Speaker identification',
      'Custom vocabulary',
      'Real-time processing'
    ],
    useCases: [
      'Call center analytics',
      'Meeting transcription',
      'Compliance documentation',
      'Customer insight generation'
    ],
    icon: 'mic'
  },
  {
    id: 'nfon-ai-suite',
    name: 'NFON AI Suite',
    description: 'Comprehensive AI solution that combines multiple technologies to create a unified customer communication experience.',
    category: 'general-ai',
    keyFeatures: [
      'Unified analytics platform',
      'Cross-channel customer journey mapping',
      'AI-powered workflow automation',
      'Sentiment analysis',
      'Predictive customer service'
    ],
    useCases: [
      'Enterprise communication strategy',
      'Customer experience optimization',
      'Business intelligence',
      'Operational efficiency improvements'
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
