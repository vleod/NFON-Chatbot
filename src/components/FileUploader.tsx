
import { useState } from "react";
import { Upload, Loader2, X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { CustomerInquiry } from "@/types";
import { parseCSV } from "@/services/analysisService";

interface FileUploaderProps {
  onUpload: (inquiries: CustomerInquiry[]) => void;
}

const FileUploader = ({ onUpload }: FileUploaderProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) return;
    
    if (!file.name.endsWith('.csv') && !file.name.endsWith('.txt')) {
      toast({
        title: "Ungültiges Dateiformat",
        description: "Bitte wählen Sie eine CSV- oder Textdatei.",
        variant: "destructive",
      });
      return;
    }
    
    setFileName(file.name);
    setIsLoading(true);
    
    try {
      const content = await file.text();
      
      let inquiries: CustomerInquiry[] = [];
      
      if (file.name.endsWith('.csv')) {
        inquiries = parseCSV(content);
      } else {
        // Handle text file (one inquiry per line)
        const lines = content.split('\n').filter(line => line.trim().length > 0);
        inquiries = lines.map((line, index) => ({
          id: `txt-${index}`,
          text: line.trim(),
        }));
      }
      
      if (inquiries.length > 0) {
        onUpload(inquiries);
        
        toast({
          title: "Datei erfolgreich hochgeladen",
          description: `${inquiries.length} Kundenanfragen wurden geladen.`,
        });
      } else {
        toast({
          title: "Leere Datei",
          description: "Die Datei enthält keine verarbeitbaren Kundenanfragen.",
          variant: "destructive",
        });
      }
      
    } catch (error) {
      console.error('Error processing file:', error);
      toast({
        title: "Fehler beim Datei-Upload",
        description: "Die Datei konnte nicht verarbeitet werden. Bitte überprüfen Sie das Format.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const clearFile = () => {
    setFileName(null);
  };
  
  return (
    <div className="w-full">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
        {fileName ? (
          <div className="flex items-center justify-center gap-2">
            <FileText className="text-nfon-blue" size={20} />
            <span className="font-medium text-gray-700">{fileName}</span>
            {isLoading ? (
              <Loader2 className="animate-spin text-nfon-blue" size={20} />
            ) : (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full" 
                onClick={clearFile}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ) : (
          <>
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-700">
              CSV- oder Textdatei hochladen
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              Datei hier ablegen oder klicken zum Auswählen
            </p>
            <Button 
              className="mt-4 bg-nfon-blue hover:bg-nfon-lightblue"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Wird verarbeitet...
                </>
              ) : (
                'Datei auswählen'
              )}
            </Button>
          </>
        )}
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleFileChange}
          accept=".csv,.txt"
          disabled={isLoading}
        />
      </div>
    </div>
  );
};

export default FileUploader;
