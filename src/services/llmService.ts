
import { toast } from "@/components/ui/use-toast";
import { CustomerInquiry, AnalysisResult } from "../types";
import { nfonProducts } from "../data/nfon-products";

// API-Schlüssel werden im localStorage gespeichert
let openAIApiKey: string | null = null;
let huggingFaceApiKey: string | null = null;
let activeProvider: "openai" | "huggingface" | null = null;

interface LLMAnalysisResponse {
  recommendedProductCategory: 'voicebot' | 'chatbot' | 'livechat' | 'speech-to-text' | 'general-ai' | 'unclear';
  confidence: number;
  analysis: string;
  followUpQuestion?: string;
  customerResponse?: string;
}

// OpenAI API-Schlüssel Verwaltung
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

// Hugging Face API-Schlüssel Verwaltung
export const setHuggingFaceApiKey = (apiKey: string) => {
  huggingFaceApiKey = apiKey;
  localStorage.setItem('huggingface_api_key', apiKey);
};

export const getHuggingFaceApiKey = (): string | null => {
  if (!huggingFaceApiKey) {
    huggingFaceApiKey = localStorage.getItem('huggingface_api_key');
  }
  return huggingFaceApiKey;
};

// Aktiver Provider Verwaltung
export const setActiveProvider = (provider: "openai" | "huggingface") => {
  activeProvider = provider;
  localStorage.setItem('active_llm_provider', provider);
};

export const getActiveProvider = (): "openai" | "huggingface" | null => {
  if (!activeProvider) {
    const saved = localStorage.getItem('active_llm_provider') as "openai" | "huggingface" | null;
    activeProvider = saved;
  }
  return activeProvider;
};

// Gemeinsame Funktion zur Generierung der Produktbeschreibungen für den Prompt
const getProductDescriptions = () => {
  return nfonProducts.map(product => `
    ${product.name} (${product.category}):
    ${product.description}
    Hauptmerkmale: ${product.keyFeatures.join(', ')}
    Anwendungsfälle: ${product.useCases.join(', ')}
  `).join('\n');
};

// Analyse mit OpenAI
const analyzeWithOpenAI = async (inquiry: CustomerInquiry): Promise<LLMAnalysisResponse> => {
  const apiKey = getOpenAIApiKey();
  
  if (!apiKey) {
    throw new Error("OpenAI API key is missing");
  }

  const productDescriptions = getProductDescriptions();

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
  
  try {
    const parsedResponse = JSON.parse(llmResponse);
    return {
      recommendedProductCategory: parsedResponse.recommendedProductCategory,
      confidence: parsedResponse.confidence,
      analysis: parsedResponse.analysis,
      followUpQuestion: parsedResponse.followUpQuestion,
    };
  } catch (parseError) {
    console.error("Failed to parse OpenAI response:", parseError);
    throw new Error("Failed to parse OpenAI response");
  }
};

// Analyse mit Hugging Face (Llama 3)
const analyzeWithHuggingFace = async (inquiry: CustomerInquiry): Promise<LLMAnalysisResponse> => {
  const apiKey = getHuggingFaceApiKey();
  
  if (!apiKey) {
    throw new Error("Hugging Face API key is missing");
  }

  const productDescriptions = getProductDescriptions();

  const response = await fetch("https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      inputs: `<|system|>
Du bist ein KI-Assistent für NFON, ein Anbieter von Kommunikationslösungen. 
Deine Aufgabe ist es, Kundenanfragen zu analysieren und das am besten geeignete NFON-Produkt zu empfehlen.

Hier sind die verfügbaren Produkte mit ihren Beschreibungen:
${productDescriptions}

Bitte analysiere die Anfrage und gib folgende Informationen zurück:
1. recommendedProductCategory: Die Kategorie des empfohlenen Produkts (voicebot, chatbot, livechat, speech-to-text, general-ai oder unclear)
2. confidence: Eine Zahl zwischen 0 und 1, die deine Zuversicht in die Empfehlung darstellt
3. analysis: Eine kurze Analyse der Anfrage (max. 2 Sätze)
4. followUpQuestion: Eine Folgefrage, um mehr Informationen zu erhalten (optional)

Antwortformat: JSON mit den oben genannten Feldern.
<|user|>
${inquiry.text}
<|assistant|>`,
      parameters: {
        max_new_tokens: 512,
        temperature: 0.3,
        top_p: 0.95,
        return_full_text: false
      }
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Hugging Face API error: ${errorData.error || response.statusText}`);
  }

  const data = await response.json();
  const llmResponse = data[0]?.generated_text || "";
  
  try {
    // Hugging Face kann JSON in unstrukturiertem Text zurückgeben, daher müssen wir versuchen, 
    // den JSON-Teil zu extrahieren und zu parsen
    const jsonMatch = llmResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in Hugging Face response");
    }
    
    const parsedResponse = JSON.parse(jsonMatch[0]);
    return {
      recommendedProductCategory: parsedResponse.recommendedProductCategory || "unclear",
      confidence: parsedResponse.confidence || 0.5,
      analysis: parsedResponse.analysis || "Keine Analyse verfügbar.",
      followUpQuestion: parsedResponse.followUpQuestion,
    };
  } catch (parseError) {
    console.error("Failed to parse Hugging Face response:", parseError, "Response was:", llmResponse);
    throw new Error("Failed to parse Hugging Face response");
  }
};

// Allgemeine Analyse-Funktion, die den ausgewählten Provider verwendet
export const analyzeLLM = async (inquiry: CustomerInquiry): Promise<LLMAnalysisResponse> => {
  const provider = getActiveProvider();
  
  try {
    // Prüfen, welcher Provider aktiv ist
    if (provider === "huggingface") {
      // Hugging Face für die Analyse verwenden
      return await analyzeWithHuggingFace(inquiry);
    } else {
      // OpenAI als Standard oder explizit ausgewählten Provider verwenden
      return await analyzeWithOpenAI(inquiry);
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

// Generieren personalisierter Antworten mit dem LLM
export const generateLLMResponse = async (result: AnalysisResult): Promise<string> => {
  const provider = getActiveProvider();
  let apiKey: string | null = null;
  
  if (provider === "huggingface") {
    apiKey = getHuggingFaceApiKey();
  } else {
    apiKey = getOpenAIApiKey();
  }
  
  if (!apiKey) {
    return "Bitte geben Sie einen API-Schlüssel ein, um personalisierte Antworten zu generieren.";
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

    if (provider === "huggingface") {
      // Hugging Face für die Antwortgenerierung verwenden
      const response = await fetch("https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: `<|system|>
Du bist ein freundlicher Vertriebsmitarbeiter von NFON. Formuliere eine personalisierte Antwort auf die Kundenanfrage. 
Die Antwort sollte höflich, professionell und auf Deutsch sein. Wenn ein passendes Produkt gefunden wurde, 
beschreibe dessen Vorteile und wie es die Bedürfnisse des Kunden erfüllen kann. 
Stelle bei Bedarf eine Folgefrage, um weitere Informationen zu erhalten.
<|user|>
Kundenanfrage: "${result.inquiry.text}"

Analyseergebnis:
Empfohlenes Produkt: ${result.recommendedProductCategory}
Zuversicht: ${result.confidence}
Analyse: ${result.analysis}

Produktinformationen:
${productInfo}

Folgefrage (falls vorhanden): ${result.followUpQuestion || ''}

Bitte generiere eine personalisierte Antwort für diesen Kunden.
<|assistant|>`,
          parameters: {
            max_new_tokens: 512,
            temperature: 0.7,
            top_p: 0.95,
            return_full_text: false
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Hugging Face API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data[0]?.generated_text || "Entschuldigung, es ist ein Fehler bei der Generierung der personalisierten Antwort aufgetreten.";
      
    } else {
      // OpenAI für die Antwortgenerierung verwenden (Standardfall)
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
    }
  } catch (error) {
    console.error("Error generating LLM response:", error);
    return "Entschuldigung, es ist ein Fehler bei der Generierung der personalisierten Antwort aufgetreten. Bitte versuchen Sie es später erneut.";
  }
};
