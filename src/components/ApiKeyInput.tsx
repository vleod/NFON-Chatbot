
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Key, Check, AlertCircle } from "lucide-react";
import { setOpenAIApiKey, getOpenAIApiKey } from "@/services/llmService";

const ApiKeyInput = () => {
  const [apiKey, setApiKey] = useState<string>("");
  const [saved, setSaved] = useState<boolean>(false);

  useEffect(() => {
    const savedKey = getOpenAIApiKey();
    if (savedKey) {
      setApiKey(savedKey);
      setSaved(true);
    }
  }, []);

  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      toast({
        title: "API-Schlüssel fehlt",
        description: "Bitte geben Sie einen gültigen OpenAI API-Schlüssel ein.",
        variant: "destructive",
      });
      return;
    }

    try {
      setOpenAIApiKey(apiKey.trim());
      setSaved(true);
      toast({
        title: "API-Schlüssel gespeichert",
        description: "Ihr OpenAI API-Schlüssel wurde erfolgreich gespeichert.",
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
        <CardTitle className="text-lg">OpenAI API-Schlüssel</CardTitle>
        <CardDescription>
          Geben Sie Ihren OpenAI API-Schlüssel ein, um das KI-Modell für die Analyse zu nutzen.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                type="password"
                placeholder="sk-..."
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setSaved(false);
                }}
                className="pr-10"
              />
              {saved && (
                <div className="absolute right-3 top-2.5 text-green-500">
                  <Check size={16} />
                </div>
              )}
            </div>
            <Button onClick={handleSaveApiKey} disabled={!apiKey.trim() || saved}>
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
                Hier können Sie einen API-Schlüssel erstellen
              </a>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiKeyInput;
