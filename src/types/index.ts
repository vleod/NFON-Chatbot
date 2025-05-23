
export interface CustomerInquiry {
  id: string;
  text: string;
  customer?: string;
  date?: string;
  sourceFile?: string; // Name of the source file if extracted from a document
}

export interface AnalysisResult {
  inquiry: CustomerInquiry;
  recommendedProductCategory: 'voicebot' | 'chatbot' | 'livechat' | 'speech-to-text' | 'general-ai' | 'unclear';
  confidence: number;
  followUpQuestion?: string;
  analysis: string;
  customerResponse?: string;
}
