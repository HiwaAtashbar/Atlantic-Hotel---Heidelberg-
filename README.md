# Reinigungsplaner – Update (31.07.2026, Version 3)

## Neue Änderungen in diesem Update

1. **Zweite Zimmernummer der Suite ist optional**
   Das Feld "Zweite Zimmernummer der Suite" war bereits technisch optional (die App speichert auch, wenn es leer bleibt) – der Hinweistext wurde jetzt zusätzlich mit "(optional)" ergänzt, damit klar ist, dass eine Eingabe hier nicht zwingend erforderlich ist.

2. **Neue Verdienst-Tabelle in allen drei Berichten (Tag/Monat/Jahr)**
   Zusätzlich zur bestehenden Tabelle "Reinigungszeit nach Farbe" (Blau/Rot/Gelb – für die Gesamtzeitberechnung) gibt es jetzt eine zweite, getrennte Tabelle "Verdienst nach Zimmertyp" mit genau zwei Zeilen:
   - Normale Zimmer (Anzahl × Lohn pro normalem Zimmer)
   - Suiten (2 Zimmer) (Anzahl × Lohn pro Suite, standardmäßig 6,50 € statt 5,00 €)
   - Eine Gesamtzeile mit dem kompletten Verdienst

   Dadurch bleibt die Farb-Tabelle (Blau/Rot/Gelb) weiterhin für die Berechnung der gesamten Reinigungszeit erhalten, während der Verdienst separat und korrekt nach Zimmertyp (normal vs. Suite) berechnet wird – unabhängig vom Status (Blau/Rot/Gelb) des Zimmers.

## Warum zwei getrennte Tabellen?

- Die **Farb-Tabelle** beantwortet: Wie viele Zimmer welcher Kategorie wurden gereinigt und wie lange hat es gedauert?
- Die **Verdienst-Tabelle** beantwortet: Wie viel Geld wurde verdient – abhängig davon, ob ein Zimmer ein normales Zimmer oder eine Suite war (Suiten zahlen unabhängig von ihrer Farbe immer den höheren Suite-Lohn).

## Installation

1. Alle Dateien in Ihr GitHub-Repository hochladen (bestehende Dateien überschreiben).
2. GitHub Pages aktualisiert sich automatisch nach ein bis zwei Minuten.
3. App auf dem Handy schließen und neu öffnen. Falls Änderungen nicht sofort sichtbar sind, Browser-/App-Cache leeren (Service Worker cached die Dateien).

## Frühere Änderungen (bereits enthalten)

- Alle Daten (Zimmer, Zeiten, Kommen/Gehen) sind jederzeit editierbar, auch an gesperrten Tagen.
- Start-/Endzeit der Reinigung manuell im Bearbeiten-Fenster editierbar.
- Kommen-/Gehen-Zeit über "Bearbeiten"-Link in der Arbeitszeit-Karte editierbar.
- WW-Zimmer haben keine eigene Zeile mehr in der Farb-Tabelle, sondern werden in ihrer jeweiligen Farbzeile mitgezählt (WW-Badge bleibt auf der Zimmerkarte sichtbar).
- Tagesbericht zeigt zusätzlich Anwesenheitszeit im Hotel, reine Reinigungszeit und automatisch berechnete Leerlauf-/Pausenzeit.

## Dateistruktur

- index.html, app.js, styles.css, manifest.json, sw.js, icon-192.png, icon-512.png, README.md
