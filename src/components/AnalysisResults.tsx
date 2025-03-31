
import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle, HelpCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AnalysisResult } from "@/types";
import { nfonProducts } from "@/data/nfon-products";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

interface AnalysisResultsProps {
  results: AnalysisResult[];
  isLoading: boolean;
  onClearResults: () => void;
}

const AnalysisResults = ({ results, isLoading, onClearResults }: AnalysisResultsProps) => {
  const [resultsByCategory, setResultsByCategory] = useState<Record<string, number>>({});
  
  useEffect(() => {
    if (results.length > 0) {
      const categories: Record<string, number> = {
        'voicebot': 0,
        'chatbot': 0,
        'livechat': 0,
        'speech-to-text': 0,
        'general-ai': 0,
        'unclear': 0
      };
      
      results.forEach(result => {
        categories[result.recommendedProductCategory] = 
          (categories[result.recommendedProductCategory] || 0) + 1;
      });
      
      setResultsByCategory(categories);
    }
  }, [results]);
  
  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'voicebot': return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case 'chatbot': return "bg-green-100 text-green-800 hover:bg-green-200";
      case 'livechat': return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      case 'speech-to-text': return "bg-amber-100 text-amber-800 hover:bg-amber-200";
      case 'general-ai': return "bg-indigo-100 text-indigo-800 hover:bg-indigo-200";
      case 'unclear': return "bg-gray-100 text-gray-800 hover:bg-gray-200";
      default: return "";
    }
  };
  
  const renderCategoryIcon = (category: string) => {
    const product = nfonProducts.find(p => p.category === category);
    return product?.icon || 'help-circle';
  };

  const getIconForResult = (result: AnalysisResult) => {
    if (result.recommendedProductCategory === 'unclear') {
      return <HelpCircle className="h-5 w-5 text-gray-500" />;
    }
    return result.confidence > 0.7 ? (
      <CheckCircle className="h-5 w-5 text-green-500" />
    ) : (
      <AlertCircle className="h-5 w-5 text-amber-500" />
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-48 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-nfon-blue" />
        <p className="text-sm text-gray-500">Analysiere Kundenanfragen...</p>
      </div>
    );
  }

  if (results.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Analyseergebnisse</h2>
        <Button 
          variant="outline" 
          onClick={onClearResults}
          className="text-sm"
        >
          Ergebnisse löschen
        </Button>
      </div>

      {results.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Zusammenfassung</CardTitle>
            <CardDescription>Verteilung der {results.length} analysierten Kundenanfragen</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(resultsByCategory).map(([category, count]) => {
                if (count === 0) return null;
                const percentage = (count / results.length) * 100;
                
                return (
                  <div key={category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium capitalize">{category.replace('-', ' ')}</span>
                      <span className="text-sm text-gray-500">{count} ({percentage.toFixed(0)}%)</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {results.map((result, index) => {
          const product = result.recommendedProductCategory !== 'unclear' ?
            nfonProducts.find(p => p.category === result.recommendedProductCategory) : null;
            
          return (
            <Card key={index}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-base">
                      {getIconForResult(result)}
                      {result.inquiry.customer ? `Anfrage von ${result.inquiry.customer}` : `Anfrage ${index + 1}`}
                    </CardTitle>
                    {result.inquiry.date && (
                      <CardDescription className="text-xs">Datum: {result.inquiry.date}</CardDescription>
                    )}
                  </div>
                  <Badge className={`${getCategoryBadgeColor(result.recommendedProductCategory)} capitalize`}>
                    {result.recommendedProductCategory === 'unclear' ? 'Unklar' : result.recommendedProductCategory.replace('-', ' ')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Kundenanfrage:</h4>
                  <p className="text-sm bg-gray-50 p-3 rounded-md">{result.inquiry.text}</p>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-medium">Vertrauen in die Analyse:</h4>
                    <span className="text-xs font-medium">{(result.confidence * 100).toFixed(0)}%</span>
                  </div>
                  <Progress 
                    value={result.confidence * 100} 
                    className="h-2"
                    indicatorClassName={
                      result.confidence > 0.7 ? "bg-green-500" : 
                      result.confidence > 0.5 ? "bg-amber-500" : 
                      "bg-red-500"
                    }
                  />
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-1">Analyse:</h4>
                  <p className="text-sm">{result.analysis}</p>
                </div>
                
                {product && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="text-sm font-medium mb-2">Empfohlenes Produkt: {product.name}</h4>
                      <p className="text-sm text-gray-700">{product.description}</p>
                    </div>
                  </>
                )}
                
                {result.followUpQuestion && (
                  <div className="bg-nfon-lightgray p-3 rounded-md">
                    <h4 className="text-sm font-medium mb-1 flex items-center gap-1">
                      <HelpCircle className="h-4 w-4 text-nfon-blue" />
                      Empfohlene Rückfrage:
                    </h4>
                    <p className="text-sm">{result.followUpQuestion}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AnalysisResults;
