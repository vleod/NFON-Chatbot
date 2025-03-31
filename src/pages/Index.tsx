
import { useState } from "react";
import Header from "@/components/Header";
import InquiryInput from "@/components/InquiryInput";
import FileUploader from "@/components/FileUploader";
import AnalysisResults from "@/components/AnalysisResults";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomerInquiry, AnalysisResult } from "@/types";
import { analyzeInquiry, analyzeBatchInquiries } from "@/services/analysisService";
import { sampleInquiries } from "@/data/nfon-products";
import { Button } from "@/components/ui/button";
import { Database, UploadCloud, FileText } from "lucide-react";

const Index = () => {
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSingleInquiry = async (inquiry: CustomerInquiry) => {
    setIsLoading(true);
    try {
      const result = await analyzeInquiry(inquiry);
      setResults(prev => [result, ...prev]);
    } catch (error) {
      console.error('Error analyzing inquiry:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBatchInquiries = async (inquiries: CustomerInquiry[]) => {
    setIsLoading(true);
    try {
      const batchResults = await analyzeBatchInquiries(inquiries);
      setResults(prev => [...batchResults, ...prev]);
    } catch (error) {
      console.error('Error analyzing batch inquiries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadSamples = async () => {
    setIsLoading(true);
    try {
      const sampleResults = await analyzeBatchInquiries(sampleInquiries);
      setResults(prev => [...sampleResults, ...prev]);
    } catch (error) {
      console.error('Error analyzing sample inquiries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Kundenanfragen analysieren</CardTitle>
                <CardDescription>
                  Lassen Sie Kundenanfragen analysieren, um passende NFON AI-Produkte zu identifizieren
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="input">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="input" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Einzelne Anfrage
                    </TabsTrigger>
                    <TabsTrigger value="upload" className="flex items-center gap-2">
                      <UploadCloud className="h-4 w-4" />
                      Datei hochladen
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="input" className="space-y-4">
                    <InquiryInput onSubmit={handleSingleInquiry} />
                  </TabsContent>
                  
                  <TabsContent value="upload" className="space-y-4">
                    <FileUploader onUpload={handleBatchInquiries} />
                    <div className="mt-4 text-center">
                      <p className="text-xs text-gray-500 mb-2">oder</p>
                      <Button 
                        variant="outline" 
                        onClick={handleLoadSamples}
                        className="w-full"
                        disabled={isLoading}
                      >
                        <Database className="mr-2 h-4 w-4" />
                        Beispiel-Anfragen laden
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Über dieses Tool</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-4">
                <p>
                  Dieses Tool nutzt KI, um Kundenanfragen zu analysieren und passende NFON-Produkte vorzuschlagen. Es kann zwischen folgenden Produktkategorien unterscheiden:
                </p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Botario Voicebots (Sprachassistenten)</li>
                  <li>NFON Chatbots (Textassistenten)</li>
                  <li>NFON LiveChat (Echtzeitunterstützung)</li>
                  <li>NFON Speech-to-Text (Transkription)</li>
                  <li>NFON AI Suite (Umfassende Lösungen)</li>
                </ul>
                <p>
                  Bei unklaren Anfragen werden Rückfragen generiert, um weitere Details zu erhalten.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <AnalysisResults 
              results={results} 
              isLoading={isLoading} 
              onClearResults={clearResults} 
            />
          </div>
        </div>
      </main>

      <footer className="bg-gray-100 border-t py-4">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} NFON AI Sales Team Tool | Interne Nutzung</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
