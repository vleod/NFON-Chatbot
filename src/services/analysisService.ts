import { CustomerInquiry } from "../types";
import { AnalysisResult } from "../types";
import { nfonProducts } from "../data/nfon-products";
import { toast } from "@/components/ui/use-toast";
import { analyzeLLM, generateLLMResponse, getOpenAIApiKey } from "./llmService";

interface CategoryMapping {
  [key: string]: {
    category: 'voicebot' | 'chatbot' | 'livechat' | 'speech-to-text' | 'general-ai';
    patterns: string[];
    businessNeeds: string[];
  }
}

const CATEGORY_MAPPINGS: CategoryMapping = {
  voicebot: {
    category: 'voicebot',
    patterns: [
      'anrufe', 'telefonanrufe', 'call center', 'callcenter', 'telefonisch', 
      'anrufbeantworter', 'sprachassistent', 'voicebot', 'spracherkennung',
      'anruf', 'telefonie', 'telefonieren', 'stimme', 'automatisch beantworten',
      'anrufvolumen', 'telefonservice', 'ivr', 'interactive voice response'
    ],
    businessNeeds: [
      'anrufvolumen', 'viele anrufe', '24/7', 'call-center', 'kundenservice telefon',
      'telefonische anfragen', 'telefonische beratung', 'automatisierte anrufannahme',
      'anrufe außerhalb der geschäftszeiten', 'telefonische bestellungen',
      'telefonhotline', 'sprachgesteuertes menü', 'kundenanrufe', 'warteschlange',
      'automatisierte anrufweiterleitung', 'sprachgesteuerte selbstbedienung'
    ]
  },
  chatbot: {
    category: 'chatbot',
    patterns: [
      'chatbot', 'chat-bot', 'automatische antworten', 'automatisierte chats',
      'chat automation', 'bot für website', 'website bot', 'textbot',
      'chat-assistent', 'automatische textantworten', 'webseiten-bot',
      'messengern', 'messaging', 'nachrichtenbot'
    ],
    businessNeeds: [
      'website support', 'faq beantwortung', 'automatische antworten', 'digitaler assistent',
      'textnachrichten automatisieren', 'website interaktion', 'online kundenservice',
      'häufige fragen', 'selbstbedienung online', 'kundenanfragen auf der website',
      'digitale kundenbetreuung', 'automatisches messaging', 'schnelle reaktionszeiten',
      'beratung auf der website', 'online-hilfe', 'rund um die uhr verfügbar'
    ]
  },
  livechat: {
    category: 'livechat',
    patterns: [
      'live chat', 'livechat', 'live-chat', 'chat mit mitarbeitern', 'echten mitarbeitern', 
      'echtzeit-chat', 'echtzeit chat', 'menschlicher chat', 'chat support',
      'support chat', 'chat-support', 'berater im chat', 'chat-berater',
      'chat-beratung', 'live beratung', 'live-beratung', 'sofortige unterstützung', 'sofortige hilfe'
    ],
    businessNeeds: [
      'persönliche beratung', 'echte mitarbeiter', 'direkte kommunikation', 'sofortige hilfe',
      'menschliche interaktion', 'personalisierter service', 'beratungsgespräche',
      'vertriebsgespräche online', 'komplexe anfragen', 'individuelle fälle',
      'verkaufsgespräche', 'kundenbeziehungen', 'direkter kundenkontakt',
      'professionelle beratung', 'höherwertiger support', 'online-verkauf'
    ]
  },
  speechToText: {
    category: 'speech-to-text',
    patterns: [
      'transkribieren', 'transkription', 'speech-to-text', 'speech to text', 
      'spracherkennung', 'gesprächstranskription', 'gespräche aufzeichnen',
      'aufgezeichnete gespräche', 'aufzeichnung', 'anrufanalyse', 'call recording',
      'mitschnitt', 'mitschrift', 'gesprächsmitschrift', 'protokoll', 'gesprächsprotokoll'
    ],
    businessNeeds: [
      'dokumentation', 'protokollierung', 'qualitätssicherung', 'schulungsmaterial',
      'barrierefreiheit', 'compliance', 'aufzeichnungspflicht', 'gerichtsverwertbarkeit',
      'besprechungsprotokolle', 'analyse von kundengesprächen', 'auswertung',
      'nachverfolgung', 'beweissicherung', 'nacharbeit', 'rechtliche anforderungen',
      'zugänglichkeit', 'gesprächsanalyse', 'mehrsprachige kommunikation'
    ]
  },
  generalAI: {
    category: 'general-ai',
    patterns: [
      'ki-lösung', 'ki lösung', 'künstliche intelligenz', 'ai solution', 'ai-lösung',
      'ai lösung', 'umfassende lösung', 'komplettlösung', 'gesamtlösung', 'alles-in-einem',
      'alles in einem', 'plattform', 'suite', 'mehrere kanäle', 'omnichannel', 'alle kanäle'
    ],
    businessNeeds: [
      'digitale transformation', 'prozessoptimierung', 'mehrere kommunikationskanäle',
      'ganzheitliche lösung', 'durchgängige kundenerfahrung', 'omnichannel',
      'prozessautomatisierung', 'effizienzsteigerung', 'kostenreduktion',
      'wettbewerbsvorteil', 'innovativ', 'zukunftssicher', 'skalierbar',
      'unternehmensweite lösung', 'strategische neuausrichtung', 'moderne kommunikation',
      'end-to-end', 'datenanalyse', 'kundenerfahrung verbessern'
    ]
  }
};

const analyzeContext = (text: string): Record<string, number> => {
  const lowercaseText = text.toLowerCase();
  const scores: Record<string, number> = {
    voicebot: 0,
    chatbot: 0,
    livechat: 0,
    'speech-to-text': 0,
    'general-ai': 0
  };
  
  for (const [key, mapping] of Object.entries(CATEGORY_MAPPINGS)) {
    const categoryKey = mapping.category;
    
    for (const pattern of mapping.patterns) {
      if (lowercaseText.includes(pattern.toLowerCase())) {
        scores[categoryKey] += 2;
      }
    }
    
    for (const need of mapping.businessNeeds) {
      if (lowercaseText.includes(need.toLowerCase())) {
        scores[categoryKey] += 1.5;
      }
    }
  }
  
  if (/(\bhoh(es|e)?\s+anrufvolumen\b|\bviel(e)?\s+anrufe\b|\b24\/7\b|\brund\s+um\s+die\s+uhr\b)/i.test(lowercaseText)) {
    scores.voicebot += 1;
  }
  
  if (/(\bwebsite\b|\bonline\b|\bdigital\b|\bfaq\b|\bhäufig(e)?\s+fragen\b)/i.test(lowercaseText)) {
    scores.chatbot += 0.8;
  }
  
  if (/(\bpersönlich\b|\bindividuell\b|\bkomplex\b|\bechtzeit\b|\bsofort\b|\bberater\b|\bberaten\b|\bberatung\b)/i.test(lowercaseText)) {
    scores.livechat += 1;
  }
  
  if (/(\bdokumentation\b|\bprotokoll\b|\baufzeichnung\b|\baufzeichnen\b|\btranskrib\w+\b|\bmitschnitt\b|\bgeschäftlich\b|\brechtlich\b|\banalyse\b)/i.test(lowercaseText)) {
    scores['speech-to-text'] += 1;
  }
  
  if (/(\bmehrere\s+kanäle\b|\bomnichannel\b|\bverschiedene\s+wege\b|\btransformation\b|\bganzheitlich\b|\bkomplett\b|\ball(es)?\b|\bintegriert\b)/i.test(lowercaseText)) {
    scores['general-ai'] += 1;
  }
  
  return scores;
};

const generateCustomerResponse = (result: AnalysisResult): string => {
  const product = nfonProducts.find(p => p.category === result.recommendedProductCategory);
  
  if (result.recommendedProductCategory === 'unclear') {
    return `Vielen Dank für Ihre Anfrage. Um Ihnen besser helfen zu können, hätten wir noch eine Frage: ${result.followUpQuestion} Mit diesen Informationen können wir Ihnen eine maßgeschneiderte Lösung anbieten.`;
  }
  
  if (result.confidence < 0.6) {
    return `Vielen Dank für Ihr Interesse an unseren KI-Lösungen. Basierend auf Ihrer Anfrage könnte ${product?.name} für Sie interessant sein. ${result.followUpQuestion ? `Um sicherzustellen, dass wir Ihre Anforderungen optimal verstehen: ${result.followUpQuestion}` : ''}`;
  }
  
  return `Vielen Dank für Ihre Anfrage. Basierend auf Ihren Anforderungen empfehlen wir Ihnen ${product?.name}. ${product?.description} ${result.followUpQuestion ? `\n\nZur weiteren Optimierung unseres Angebots: ${result.followUpQuestion}` : ''}`;
};

export const analyzeInquiry = (inquiry: CustomerInquiry): Promise<AnalysisResult> => {
  return new Promise(async (resolve) => {
    setTimeout(async () => {
      try {
        if (getOpenAIApiKey()) {
          try {
            const llmResult = await analyzeLLM(inquiry);
            
            const result: AnalysisResult = {
              inquiry,
              recommendedProductCategory: llmResult.recommendedProductCategory,
              confidence: llmResult.confidence,
              followUpQuestion: llmResult.followUpQuestion,
              analysis: llmResult.analysis
            };
            
            if (inquiry.id.startsWith('manual-')) {
              result.customerResponse = await generateLLMResponse(result);
            }
            
            resolve(result);
            return;
          } catch (llmError) {
            console.error("LLM analysis failed, falling back to rule-based analysis:", llmError);
          }
        }
        
        const text = inquiry.text.toLowerCase();
        
        const categoryScores = analyzeContext(text);
        
        let bestCategory: 'voicebot' | 'chatbot' | 'livechat' | 'speech-to-text' | 'general-ai' | 'unclear' = 'unclear';
        let highestScore = 0;
        
        for (const [category, score] of Object.entries(categoryScores)) {
          if (score > highestScore) {
            highestScore = score;
            bestCategory = category as any;
          }
        }
        
        let confidence = 0.3;
        
        if (highestScore > 0) {
          const totalScore = Object.values(categoryScores).reduce((a, b) => a + b, 0);
          
          if (totalScore > 0) {
            const relativeDominance = highestScore / totalScore;
            confidence = Math.min(0.4 + (highestScore / 5) * 0.3 + relativeDominance * 0.3, 0.95);
          }
        }
        
        if (highestScore < 1.5) {
          bestCategory = 'unclear';
          confidence = Math.min(confidence, 0.4);
        }
        
        let analysis = '';
        if (bestCategory !== 'unclear' && confidence > 0.6) {
          const product = nfonProducts.find(p => p.category === bestCategory);
          if (product) {
            analysis = `Die Anfrage deutet auf Bedarf an ${product.name} hin. Die Kundenanforderungen passen zu unserer ${bestCategory} Lösung.`;
          }
        } else if (bestCategory !== 'unclear' && confidence > 0.4) {
          analysis = `Die Anfrage könnte auf Bedarf an ${bestCategory}-Lösungen hinweisen, aber weitere Klärung ist empfehlenswert.`;
        } else {
          analysis = `Die Anfrage ist nicht eindeutig einem bestimmten Produktbereich zuzuordnen. Eine allgemeine Beratung wird empfohlen.`;
          bestCategory = 'unclear';
        }
        
        let followUpQuestion;
        if (bestCategory === 'unclear' || confidence < 0.7) {
          followUpQuestion = "Könnten Sie näher erläutern, welche spezifischen Kommunikationsherausforderungen Sie aktuell in Ihrem Unternehmen bewältigen möchten?";
        } else if (confidence < 0.9) {
          switch(bestCategory) {
            case 'voicebot':
              followUpQuestion = "Wie viele Anrufe erhalten Sie täglich und welche Art von Anfragen kommen am häufigsten vor?";
              break;
            case 'chatbot':
              followUpQuestion = "Welche spezifischen Funktionen erwarten Sie von einem Chatbot und in welche Systeme soll er integriert werden?";
              break;
            case 'livechat':
              followUpQuestion = "Wie groß ist Ihr Support-Team und wie möchten Sie den Live-Chat in Ihre bestehenden Prozesse integrieren?";
              break;
            case 'speech-to-text':
              followUpQuestion = "Welche Art von Analysen möchten Sie mit den transkribierten Gesprächen durchführen?";
              break;
            case 'general-ai':
              followUpQuestion = "Welche Kommunikationskanäle sind für Ihr Unternehmen am wichtigsten?";
              break;
            default:
              followUpQuestion = "Können Sie näher erläutern, welche spezifischen Herausforderungen Sie mit einer KI-Lösung angehen möchten?";
          }
        }
        
        const result: AnalysisResult = {
          inquiry,
          recommendedProductCategory: bestCategory,
          confidence,
          followUpQuestion,
          analysis
        };
        
        if (inquiry.id.startsWith('manual-')) {
          result.customerResponse = generateCustomerResponse(result);
        }
        
        resolve(result);
      } catch (error) {
        console.error("Error during analysis:", error);
        resolve({
          inquiry,
          recommendedProductCategory: "unclear",
          confidence: 0.3,
          followUpQuestion: "Könnten Sie Ihre Anfrage bitte näher erläutern? Es ist ein Fehler bei der Analyse aufgetreten.",
          analysis: "Bei der Analyse ist ein Fehler aufgetreten."
        });
      }
    }, 1500);
  });
};

export const analyzeBatchInquiries = async (inquiries: CustomerInquiry[]): Promise<AnalysisResult[]> => {
  try {
    const results: AnalysisResult[] = [];
    
    for (const inquiry of inquiries) {
      const result = await analyzeInquiry(inquiry);
      results.push(result);
    }
    
    return results;
  } catch (error) {
    console.error('Error analyzing batch inquiries:', error);
    toast({
      title: "Fehler bei der Analyse",
      description: "Es ist ein Fehler bei der Analyse der Anfragen aufgetreten.",
      variant: "destructive",
    });
    return [];
  }
};

export const parseCSV = (content: string): CustomerInquiry[] => {
  try {
    const lines = content.trim().split('\n');
    
    if (lines.length === 0) {
      return [];
    }
    
    const hasHeader = lines[0].toLowerCase().includes('text') || 
                     lines[0].toLowerCase().includes('anfrage') ||
                     lines[0].toLowerCase().includes('kunde');
    
    const startIndex = hasHeader ? 1 : 0;
    
    const inquiries: CustomerInquiry[] = [];
    
    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (!line) continue;
      
      const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
      
      if (parts.length >= 1) {
        let text = parts[0].trim();
        if (text.startsWith('"') && text.endsWith('"')) {
          text = text.substring(1, text.length - 1);
        }
        
        let customer = parts.length > 1 ? parts[1].trim() : undefined;
        if (customer && customer.startsWith('"') && customer.endsWith('"')) {
          customer = customer.substring(1, customer.length - 1);
        }
        
        let date = parts.length > 2 ? parts[2].trim() : undefined;
        if (date && date.startsWith('"') && date.endsWith('"')) {
          date = date.substring(1, date.length - 1);
        }
        
        inquiries.push({
          id: `csv-${i}`,
          text,
          customer,
          date
        });
      }
    }
    
    return inquiries;
  } catch (error) {
    console.error('Error parsing CSV:', error);
    toast({
      title: "Fehler bei der CSV-Verarbeitung",
      description: "Das Format der CSV-Datei konnte nicht verarbeitet werden.",
      variant: "destructive",
    });
    return [];
  }
};
