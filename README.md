# Reinigungsplaner – Aktualisierte Version (Juli 2026)

## Neue Änderungen in diesem Update

1. **Alle Daten jederzeit editierbar, auch an gesperrten Tagen**
   Der Bearbeiten-Button (✏️) bei jedem Zimmer funktioniert jetzt IMMER, unabhängig davon, ob der Tag über 🔒 gesperrt wurde. Die Sperre verhindert nur das Starten/Beenden neuer Reinigungen sowie das Hinzufügen neuer Zimmer, nicht aber das Korrigieren bereits vorhandener Einträge.

2. **Start- und Endzeit der Reinigung manuell editierbar**
   Im Bearbeiten-Fenster jedes Zimmers gibt es jetzt zwei neue Felder "Startzeit" und "Endzeit" (Format HH:MM:SS), mit denen Sie die tatsächliche Reinigungszeit nachträglich korrigieren können, falls sie falsch erfasst wurde.

3. **Arbeitszeit (Kommen/Gehen) manuell editierbar**
   Über den neuen Link "Bearbeiten" oben rechts in der Arbeitszeit-Karte öffnet sich ein Fenster, in dem Sie Kommen- und Gehen-Zeit direkt eingeben oder korrigieren können – unabhängig vom Sperrstatus des Tages.

4. **WW-Zimmer ohne eigene Zeile in den Berichten**
   In den Tabellen "Aufschlüsselung nach Kategorie" (Tag/Monat/Jahr) gibt es jetzt nur noch drei Zeilen: Blau, Rot, Gelb. WW-Zimmer werden weiterhin mit dem lila WW-Badge auf der Zimmerkarte gekennzeichnet, erscheinen aber in der Statistik automatisch in der Zeile ihrer Farbe (meist Gelb) – keine separate WW-Zeile mehr.

5. **Tagesbericht zeigt Anwesenheit UND reine Reinigungszeit**
   Im Tab "Tag" gibt es eine neue Karte "Anwesenheit vs. Reinigungszeit" mit drei Werten:
   - Anwesenheit im Hotel (Kommen bis Gehen)
   - Reine Reinigungszeit (Summe aller Start-Ende-Zeiten der Zimmer)
   - Leerlauf-/Pausenzeit (automatisch berechnet: Anwesenheit minus Reinigungszeit)

   So sehen Sie sofort, wie viel Zeit für Pausen, Wagen-/Werkzeug-Transport oder andere Tätigkeiten außerhalb der reinen Zimmerreinigung verwendet wurde.

## Wie Sie einen Fehler nachträglich korrigieren

- Zum betreffenden Tag navigieren (Pfeile ◀ ▶ im Header, egal ob Vergangenheit oder Zukunft).
- Beim Zimmer auf ✏️ (Bearbeiten) klicken, um Zimmernummer, Status, WW, Suite, Startzeit oder Endzeit zu ändern.
- Für Kommen/Gehen: In der Arbeitszeit-Karte auf "Bearbeiten" klicken.
- Diese Funktionen sind immer verfügbar, auch bei gesperrten Tagen.

## Installation auf dem Handy

1. Alle Dateien in Ihr GitHub-Repository hochladen (bestehende Dateien überschreiben).
2. GitHub Pages aktualisiert sich automatisch nach ein bis zwei Minuten.
3. Die installierte App auf dem Handy schließen und neu öffnen, damit die neue Version geladen wird (der Service Worker cached die App, daher ggf. Browser-/App-Cache leeren, falls die Änderungen nicht sofort sichtbar sind).

## Dateistruktur

- index.html – Seitenstruktur inkl. neuer Felder für Zeiten und Arbeitszeit-Bearbeitung
- app.js – Programmlogik inkl. neuer Bearbeitungsfunktionen und Tagesbericht-Erweiterung
- styles.css – Design (unverändert)
- manifest.json – PWA-Einstellungen
- sw.js – Service Worker für Offline-Funktion
- icon-192.png / icon-512.png – App-Icons
