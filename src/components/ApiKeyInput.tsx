
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Key, Check, AlertCircle } from "lucide-react";
import { setOpenAIApiKey, getOpenAIApiKey, setHuggingFaceApiKey, getHuggingFaceApiKey, getActiveProvider, setActiveProvider } from "@/services/llmService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ApiKeyInput = () => {
  const [openaiKey, setOpenaiKey] = useState<string>("");
  const [huggingfaceKey, setHuggingfaceKey] = useState<string>("");
  const [openaiSaved, setOpenaiSaved] = useState<boolean>(false);
  const [huggingfaceSaved, setHuggingfaceSaved] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("openai");

  useEffect(() => {
    // Load saved API keys
    const savedOpenAIKey = getOpenAIApiKey();
    if (savedOpenAIKey) {
      setOpenaiKey(savedOpenAIKey);
      setOpenaiSaved(true);
    }

    const savedHuggingFaceKey = getHuggingFaceApiKey();
    if (savedHuggingFaceKey) {
      setHuggingfaceKey(savedHuggingFaceKey);
      setHuggingfaceSaved(true);
    }

    // Set active tab based on saved provider
    const activeProvider = getActiveProvider();
    if (activeProvider) {
      setActiveTab(activeProvider);
    }
  }, []);

  const handleSaveOpenAIKey = () => {
    if (!openaiKey.trim()) {
      toast({
        title: "API-Schlüssel fehlt",
        description: "Bitte geben Sie einen gültigen OpenAI API-Schlüssel ein.",
        variant: "destructive",
      });
      return;
    }

    try {
      setOpenAIApiKey(openaiKey.trim());
      setActiveProvider("openai");
      setOpenaiSaved(true);
      setActiveTab("openai");
      toast({
        title: "API-Schlüssel gespeichert",
        description: "Ihr OpenAI API-Schlüssel wurde erfolgreich gespeichert und als aktiver Provider ausgewählt.",
      });
    } catch (error) {
      console.error("Error saving API key:", error);
      toast({
        title: "Fehler beim Speichern",
        description: "Der API-Schlüssel konnte nicht gespeichert werden.",
        variant: "destructive",
      });
    }
  };

  const handleSaveHuggingFaceKey = () => {
    if (!huggingfaceKey.trim()) {
      toast({
        title: "API-Schlüssel fehlt",
        description: "Bitte geben Sie einen gültigen Hugging Face API-Schlüssel ein.",
        variant: "destructive",
      });
      return;
    }

    try {
      setHuggingFaceApiKey(huggingfaceKey.trim());
      setActiveProvider("huggingface");
      setHuggingfaceSaved(true);
      setActiveTab("huggingface");
      toast({
        title: "API-Schlüssel gespeichert",
        description: "Ihr Hugging Face API-Schlüssel wurde erfolgreich gespeichert und als aktiver Provider ausgewählt.",
      });
    } catch (error) {
      console.error("Error saving API key:", error);
      toast({
        title: "Fehler beim Speichern",
        description: "Der API-Schlüssel konnte nicht gespeichert werden.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">KI-Provider Konfiguration</CardTitle>
        <CardDescription>
          Wählen Sie einen KI-Provider und geben Sie Ihren API-Schlüssel ein, um das KI-Modell für die Analyse zu nutzen.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="openai">OpenAI</TabsTrigger>
            <TabsTrigger value="huggingface">Hugging Face (Llama 3)</TabsTrigger>
          </TabsList>
          
          <TabsContent value="openai" className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  type="password"
                  placeholder="sk-..."
                  value={openaiKey}
                  onChange={(e) => {
                    setOpenaiKey(e.target.value);
                    setOpenaiSaved(false);
                  }}
                  className="pr-10"
                />
                {openaiSaved && (
                  <div className="absolute right-3 top-2.5 text-green-500">
                    <Check size={16} />
                  </div>
                )}
              </div>
              <Button onClick={handleSaveOpenAIKey} disabled={!openaiKey.trim() || openaiSaved}>
                <Key className="mr-2 h-4 w-4" />
                Speichern
              </Button>
            </div>
            <div className="text-sm flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <p className="text-muted-foreground">
                Der API-Schlüssel wird lokal im Browser gespeichert und nicht an unsere Server übertragen.
                <br />
                <a
                  href="https://platform.openai.com/api-keys"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Hier können Sie einen OpenAI API-Schlüssel erstellen
                </a>
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="huggingface" className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  type="password"
                  placeholder="hf_..."
                  value={huggingfaceKey}
                  onChange={(e) => {
                    setHuggingfaceKey(e.target.value);
                    setHuggingfaceSaved(false);
                  }}
                  className="pr-10"
                />
                {huggingfaceSaved && (
                  <div className="absolute right-3 top-2.5 text-green-500">
                    <Check size={16} />
                  </div>
                )}
              </div>
              <Button onClick={handleSaveHuggingFaceKey} disabled={!huggingfaceKey.trim() || huggingfaceSaved}>
                <Key className="mr-2 h-4 w-4" />
                Speichern
              </Button>
            </div>
            <div className="text-sm flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <p className="text-muted-foreground">
                Der API-Schlüssel wird lokal im Browser gespeichert und nicht an unsere Server übertragen.
                <br />
                <a
                  href="https://huggingface.co/settings/tokens"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Hier können Sie einen Hugging Face API-Schlüssel erstellen
                </a>
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ApiKeyInput;
