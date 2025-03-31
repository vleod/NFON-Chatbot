
import { useState } from "react";
import { Send, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CustomerInquiry } from "@/types";

interface InquiryInputProps {
  onSubmit: (inquiry: CustomerInquiry) => void;
}

const InquiryInput = ({ onSubmit }: InquiryInputProps) => {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (text.trim()) {
      onSubmit({
        id: `manual-${new Date().getTime()}`,
        text: text.trim()
      });
      setText("");
    }
  };

  const clearInput = () => {
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="inquiry" className="text-sm font-medium">
          Kundenanfrage eingeben
        </label>
        <Textarea
          id="inquiry"
          placeholder="Geben Sie hier die Kundenanfrage ein..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-h-[120px]"
        />
      </div>
      <div className="flex gap-2 justify-end">
        <Button 
          type="button" 
          variant="outline" 
          onClick={clearInput}
          disabled={!text.trim()}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Löschen
        </Button>
        <Button 
          type="submit" 
          className="bg-nfon-blue hover:bg-nfon-lightblue"
          disabled={!text.trim()}
        >
          <Send className="mr-2 h-4 w-4" />
          Analysieren
        </Button>
      </div>
    </form>
  );
};

export default InquiryInput;
