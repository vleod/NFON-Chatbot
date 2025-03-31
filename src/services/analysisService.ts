
import { CustomerInquiry } from "../types";
import { AnalysisResult } from "../types";
import { nfonProducts } from "../data/nfon-products";
import { toast } from "@/components/ui/use-toast";

interface CategoryMapping {
  [key: string]: {
    category: 'voicebot' | 'chatbot' | 'livechat' | 'speech-to-text' | 'general-ai';
    patterns: string[];
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
    ]
  },
  chatbot: {
    category: 'chatbot',
    patterns: [
      'chatbot', 'chat-bot', 'automatische antworten', 'automatisierte chats',
      'chat automation', 'bot für website', 'website bot', 'textbot',
      'chat-assistent', 'automatische textantworten', 'webseiten-bot',
      'messengern', 'messaging', 'nachrichtenbot'
    ]
  },
  livechat: {
    category: 'livechat',
    patterns: [
      'live chat', 'livechat', 'live-chat', 'chat mit mitarbeitern', 'echten mitarbeitern', 
      'echtzeit-chat', 'echtzeit chat', 'menschlicher chat', 'chat support',
      'support chat', 'chat-support', 'berater im chat', 'chat-berater',
      'chat-beratung', 'live beratung', 'live-beratung', 'sofortige unterstützung', 'sofortige hilfe'
    ]
  },
  speechToText: {
    category: 'speech-to-text',
    patterns: [
      'transkribieren', 'transkription', 'speech-to-text', 'speech to text', 
      'spracherkennung', 'gesprächstranskription', 'gespräche aufzeichnen',
      'aufgezeichnete gespräche', 'aufzeichnung', 'anrufanalyse', 'call recording',
      'mitschnitt', 'mitschrift', 'gesprächsmitschrift', 'protokoll', 'gesprächsprotokoll'
    ]
  },
  generalAI: {
    category: 'general-ai',
    patterns: [
      'ki-lösung', 'ki lösung', 'künstliche intelligenz', 'ai solution', 'ai-lösung',
      'ai lösung', 'umfassende lösung', 'komplettlösung', 'gesamtlösung', 'alles-in-einem',
      'alles in einem', 'plattform', 'suite', 'mehrere kanäle', 'omnichannel', 'alle kanäle'
    ]
  }
};

// Simulated AI analysis using pattern matching
export const analyzeInquiry = (inquiry: CustomerInquiry): Promise<AnalysisResult> => {
  return new Promise((resolve) => {
    // Simulate processing delay
    setTimeout(() => {
      const text = inquiry.text.toLowerCase();
      
      // Count matches for each category
      const matchCounts: Record<string, number> = {
        voicebot: 0,
        chatbot: 0,
        livechat: 0,
        'speech-to-text': 0,
        'general-ai': 0
      };
      
      // Check for patterns in each category
      for (const [key, mapping] of Object.entries(CATEGORY_MAPPINGS)) {
        const patterns = mapping.patterns;
        for (const pattern of patterns) {
          if (text.includes(pattern.toLowerCase())) {
            const categoryKey = mapping.category;
            matchCounts[categoryKey] += 1;
          }
        }
      }
      
      // Find the category with the most matches
      let bestCategory: 'voicebot' | 'chatbot' | 'livechat' | 'speech-to-text' | 'general-ai' | 'unclear' = 'unclear';
      let highestCount = 0;
      
      for (const [category, count] of Object.entries(matchCounts)) {
        if (count > highestCount) {
          highestCount = count;
          bestCategory = category as any;
        }
      }
      
      // Calculate confidence (simple version)
      const totalMatches = Object.values(matchCounts).reduce((a, b) => a + b, 0);
      const confidence = totalMatches > 0 
        ? Math.min(0.5 + (highestCount / totalMatches) * 0.5, 0.95) 
        : 0.3; // Base confidence
      
      // Generate analysis
      let analysis = '';
      if (bestCategory !== 'unclear' && confidence > 0.6) {
        const product = nfonProducts.find(p => p.category === bestCategory);
        if (product) {
          analysis = `Die Anfrage deutet auf Bedarf an ${product.name} hin. Mehrere Schlüsselwörter weisen auf ${bestCategory} als beste Lösung hin.`;
        }
      } else if (bestCategory !== 'unclear' && confidence > 0.4) {
        analysis = `Die Anfrage könnte auf Bedarf an ${bestCategory}-Lösungen hinweisen, aber weitere Klärung ist empfehlenswert.`;
      } else {
        analysis = `Die Anfrage ist nicht eindeutig einem bestimmten Produktbereich zuzuordnen. Eine allgemeine Beratung wird empfohlen.`;
        bestCategory = 'unclear';
      }
      
      // Generate follow-up question for low confidence or unclear cases
      let followUpQuestion;
      if (bestCategory === 'unclear' || confidence < 0.7) {
        followUpQuestion = "Könnten Sie näher erläutern, welche spezifischen Kommunikationsherausforderungen Sie aktuell in Ihrem Unternehmen bewältigen möchten?";
      } else if (confidence < 0.9) {
        // Generate specific follow-up based on category
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
      
      resolve({
        inquiry,
        recommendedProductCategory: bestCategory,
        confidence,
        followUpQuestion,
        analysis
      });
    }, 1500); // Simulate processing time
  });
};

export const analyzeBatchInquiries = async (inquiries: CustomerInquiry[]): Promise<AnalysisResult[]> => {
  try {
    const results: AnalysisResult[] = [];
    
    // Process inquiries in sequence to simulate a real analysis
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

// Function to parse CSV content
export const parseCSV = (content: string): CustomerInquiry[] => {
  try {
    // Split content into lines
    const lines = content.trim().split('\n');
    
    if (lines.length === 0) {
      return [];
    }
    
    // Check if we have a header row
    const hasHeader = lines[0].toLowerCase().includes('text') || 
                     lines[0].toLowerCase().includes('anfrage') ||
                     lines[0].toLowerCase().includes('kunde');
    
    // Start from 2nd line if we have a header
    const startIndex = hasHeader ? 1 : 0;
    
    const inquiries: CustomerInquiry[] = [];
    
    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (!line) continue;
      
      // Handle different CSV formats
      const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
      
      if (parts.length >= 1) {
        let text = parts[0].trim();
        // Remove quotes if they exist
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
