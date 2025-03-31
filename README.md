
# NFON AI Produktberater

Ein intelligentes Tool zur Analyse von Kundenanfragen und Empfehlung passender NFON AI-Produkte für das Sales-Team.

## Projektübersicht

Der NFON AI Produktberater ist eine Webanwendung, die es dem Sales-Team ermöglicht, Kundenanfragen zu analysieren und automatisch passende NFON-Produkte vorzuschlagen. Das Tool kann zwischen verschiedenen Produktkategorien unterscheiden und generiert bei Bedarf sinnvolle Rückfragen.

**URL**: https://lovable.dev/projects/0899ca83-3c7c-449d-8942-2a484347409c

## Funktionen

- **Eingabe von einzelnen Kundenanfragen** über ein Textfeld
- **Batch-Upload** von Kundenanfragen als CSV- oder Textdatei
- **Demo-Daten** mit Beispielanfragen zum Testen
- **KI-gestützte Analyse** der Anfragen nach Produktkategorien:
  - Botario Voicebots
  - NFON Chatbots
  - NFON LiveChat
  - NFON Speech-to-Text
  - NFON AI Suite
- **Konfidenzwerte** zur Einschätzung der Analysegenauigkeit
- **Rückfragevorschläge** bei unklaren Anfragen
- **Statistische Übersicht** bei Analyse mehrerer Anfragen

## Technische Umsetzung

Das Tool wurde mit folgenden Technologien entwickelt:

- **React** mit TypeScript als Frontend-Framework
- **Tailwind CSS** für das responsive Design
- **Lucide Icons** für die visuellen Elemente
- **Shadcn UI** für die Komponenten-Bibliothek

### Analyse-Algorithmus

Die Analyse funktioniert durch einen Pattern-Matching-Algorithmus, der häufige Schlüsselwörter und Phrasen erkennt, die auf bestimmte Produktkategorien hindeuten. Der Algorithmus:

1. Nimmt den Text der Kundenanfrage entgegen
2. Vergleicht Schlüsselwörter und Phrasen mit einer vordefinierten Liste pro Kategorie
3. Ermittelt die Kategorie mit den meisten Übereinstimmungen
4. Berechnet einen Konfidenzwert basierend auf der Anzahl und Verteilung der Übereinstimmungen
5. Generiert eine Analyse und bei Bedarf eine Rückfrage

### CSV-Parser

Der CSV-Parser kann verschiedene Formate verarbeiten und erkennt automatisch, ob eine Kopfzeile vorhanden ist. Er extrahiert die Kundenanfragen sowie optional den Kundennamen und das Datum.

## Erweiterungsmöglichkeiten

Für zukünftige Versionen sind folgende Erweiterungen denkbar:

- Integration eines echten LLM (z.B. GPT-4) für präzisere Analysen
- Anbindung an CRM-Systeme zur direkten Übernahme von Kundenanfragen
- Export-Funktion für die Analyseergebnisse
- Detaillierte Produktvergleiche für ähnliche Anforderungen
- Mehrsprachige Unterstützung für internationale Anfragen

## Nutzung

1. Öffnen Sie die Anwendung im Browser
2. Geben Sie entweder eine einzelne Kundenanfrage ein oder laden Sie eine CSV-/Textdatei hoch
3. Das Tool analysiert die Anfrage(n) und zeigt Empfehlungen an
4. Bei mehreren Anfragen wird zusätzlich eine statistische Auswertung angezeigt

Die Beispieldaten können über den "Beispiel-Anfragen laden" Button geladen werden, um das Tool zu testen.

## Entwickler

Entwickelt für das AI Sales Team bei NFON.
