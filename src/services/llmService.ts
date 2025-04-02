
import { toast } from "@/components/ui/use-toast";
import { CustomerInquiry, AnalysisResult } from "../types";
import { nfonProducts } from "../data/nfon-products";

// Der API-Schlüssel sollte in einer sicheren Umgebung gespeichert werden
// Für dieses Beispiel lassen wir den Benutzer den API-Schlüssel eingeben
let openAIApiKey: string | null = null;

interface LLMAnalysisResponse {
  recommendedProductCategory: 'voicebot' | 'chatbot' | 'livechat' | 'speech-to-text' | 'general-ai' | 'unclear';
  confidence: number;
  analysis: string;
  followUpQuestion?: string;
  customerResponse?: string;
}

export const setOpenAIApiKey = (apiKey: string) => {
  openAIApiKey = apiKey;
  localStorage.setItem('openai_api_key', apiKey);
};

export const getOpenAIApiKey = (): string | null => {
  if (!openAIApiKey) {
    openAIApiKey = localStorage.getItem('openai_api_key');
  }
  return openAIApiKey;
};

export const analyzeLLM = async (inquiry: CustomerInquiry): Promise<LLMAnalysisResponse> => {
  const apiKey = getOpenAIApiKey();
  
  if (!apiKey) {
    toast({
      title: "API-Schlüssel fehlt",
      description: "Bitte geben Sie Ihren OpenAI API-Schlüssel ein, um das LLM zu nutzen.",
      variant: "destructive",
    });
    throw new Error("OpenAI API key is missing");
  }

  try {
    // Produktbeschreibungen für den Prompt vorbereiten
    const productDescriptions = nfonProducts.map(product => `
      ${product.name} (${product.category}):
      ${product.description}
      Hauptmerkmale: ${product.keyFeatures.join(', ')}
      Anwendungsfälle: ${product.useCases.join(', ')}
    `).join('\n');

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `Du bist ein KI-Assistent für NFON, ein Anbieter von Kommunikationslösungen. 
            Deine Aufgabe ist es, Kundenanfragen zu analysieren und das am besten geeignete NFON-Produkt zu empfehlen.
            
            Hier sind die verfügbaren Produkte mit ihren Beschreibungen:
            ${productDescriptions}
            
            Bitte analysiere die Anfrage und gib folgende Informationen zurück:
            1. recommendedProductCategory: Die Kategorie des empfohlenen Produkts (voicebot, chatbot, livechat, speech-to-text, general-ai oder unclear)
            2. confidence: Eine Zahl zwischen 0 und 1, die deine Zuversicht in die Empfehlung darstellt
            3. analysis: Eine kurze Analyse der Anfrage (max. 2 Sätze)
            4. followUpQuestion: Eine Folgefrage, um mehr Informationen zu erhalten (optional)
            
            Antwortformat: JSON mit den oben genannten Feldern.`
          },
          {
            role: "user",
            content: inquiry.text
          }
        ],
        temperature: 0.3,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const llmResponse = data.choices[0].message.content;
    
    // Parsen der LLM-Antwort
    try {
      const parsedResponse = JSON.parse(llmResponse);
      return {
        recommendedProductCategory: parsedResponse.recommendedProductCategory,
        confidence: parsedResponse.confidence,
        analysis: parsedResponse.analysis,
        followUpQuestion: parsedResponse.followUpQuestion,
      };
    } catch (parseError) {
      console.error("Failed to parse LLM response:", parseError);
      throw new Error("Failed to parse LLM response");
    }

  } catch (error) {
    console.error("LLM analysis error:", error);
    toast({
      title: "Fehler bei der LLM-Analyse",
      description: `Es ist ein Fehler aufgetreten: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`,
      variant: "destructive",
    });

    // Fallback zur regelbasierten Analyse
    return {
      recommendedProductCategory: "unclear",
      confidence: 0.3,
      analysis: "Konnte keine LLM-Analyse durchführen. Verwendung der regelbasierten Analyse als Fallback.",
    };
  }
};

// Hilfsfunktion zur Generierung personalisierter Antworten mit dem LLM
export const generateLLMResponse = async (result: AnalysisResult): Promise<string> => {
  const apiKey = getOpenAIApiKey();
  
  if (!apiKey) {
    return "Bitte geben Sie einen OpenAI API-Schlüssel ein, um personalisierte Antworten zu generieren.";
  }

  try {
    const product = nfonProducts.find(p => p.category === result.recommendedProductCategory);
    
    let productInfo = "Es konnte kein passendes Produkt identifiziert werden.";
    if (product) {
      productInfo = `
        ${product.name}: ${product.description}
        Hauptmerkmale: ${product.keyFeatures.join(', ')}
        Anwendungsfälle: ${product.useCases.join(', ')}
      `;
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `Du bist ein freundlicher Vertriebsmitarbeiter von NFON. Formuliere eine personalisierte Antwort auf die Kundenanfrage. 
            Die Antwort sollte höflich, professionell und auf Deutsch sein. Wenn ein passendes Produkt gefunden wurde, 
            beschreibe dessen Vorteile und wie es die Bedürfnisse des Kunden erfüllen kann. 
            Stelle bei Bedarf eine Folgefrage, um weitere Informationen zu erhalten.`
          },
          {
            role: "user",
            content: `
              Kundenanfrage: "${result.inquiry.text}"
              
              Analyseergebnis:
              Empfohlenes Produkt: ${result.recommendedProductCategory}
              Zuversicht: ${result.confidence}
              Analyse: ${result.analysis}
              
              Produktinformationen:
              ${productInfo}
              
              Folgefrage (falls vorhanden): ${result.followUpQuestion || ''}
              
              Bitte generiere eine personalisierte Antwort für diesen Kunden.
            `
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error generating LLM response:", error);
    return "Entschuldigung, es ist ein Fehler bei der Generierung der personalisierten Antwort aufgetreten. Bitte versuchen Sie es später erneut.";
  }
};
