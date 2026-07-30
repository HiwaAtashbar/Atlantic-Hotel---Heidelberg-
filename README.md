# Reinigungsplaner

Eine einfache Progressive Web App (PWA) zur täglichen Erfassung der Zimmerreinigung im Hotel. Läuft komplett offline auf dem Smartphone (getestet für Google Pixel 10 Pro), speichert alle Daten lokal im Browser und benötigt keinen Server.

## Funktionen

- **Nur Zimmer des aktuellen Tages** werden auf der Startseite angezeigt. Mit den Pfeilen ◀ ▶ oben kann man zwischen Tagen navigieren; ein Klick auf "Heute" springt sofort zurück zum aktuellen Tag.
- **Drei Zimmerstatus** mit Farbcode:
  - 🔵 **Blau** – Abreise, Zimmer bereits neu vermietet (höchste Priorität)
  - 🔴 **Rot** – Abreise, Zimmer noch nicht vermietet
  - 🟡 **Gelb** – Gast bleibt (Aufenthalt/Stayover)
- **WW-Kennzeichnung** für Zimmer mit komplettem Wäschewechsel (violette Umrandung der Karte).
- **Doppelzimmer-Suiten**: Ein Zimmer kann als Teil einer Suite markiert werden (mit optionaler zweiter Zimmernummer).
- **Start/Ende-Erfassung**: Für jedes Zimmer wird per Klick Start- und Endzeit der Reinigung erfasst; während der Reinigung läuft ein Live-Timer (mm:ss).
- **Arbeitszeit (Kommen/Gehen)**: Ein-/Ausstempeln der Schicht mit automatischer Berechnung der Gesamtarbeitszeit.
- **Tages-, Monats- und Jahresbericht**: Anzahl gereinigter Zimmer, Gesamtzeit, Durchschnittszeit pro Zimmer, Aufschlüsselung nach Farbkategorie (inkl. WW) sowie berechneter Verdienst.
- **Verdienstberechnung**:
  - **5,00 € pro normalem Zimmer**
  - **6,50 € pro Doppelzimmer-Suite** (die Suite wird als eine Einheit gezählt, nicht doppelt)
  - Beide Beträge können jederzeit unter dem Zahnrad-Symbol ⚙️ (Einstellungen) angepasst werden.
- **Sperre des Tages**: Nach Schichtende kann der Tag über das Schloss-Symbol 🔒 gesperrt werden; danach sind Start/Ende, Hinzufügen und Bearbeiten deaktiviert. Über den Link "Bearbeitung entsperren" im gelben Banner kann bei Bedarf wieder freigeschaltet werden. Jeder Tag hat seinen eigenen Sperrstatus – ein neuer Tag ist automatisch entsperrt.
- **Duplikat-Schutz**: Dieselbe Zimmernummer kann nicht zweimal am selben Tag angelegt werden.
- **Datensicherung**: Unter Einstellungen ⚙️ können alle Daten als JSON-Datei exportiert (heruntergeladen) und später wieder importiert werden.
- **Offline-fähig**: Durch den Service Worker funktioniert die App auch ohne Internetverbindung, sobald sie einmal geladen wurde.

## Installation auf GitHub Pages

1. Alle Dateien dieses Ordners in ein **öffentliches (Public)** GitHub-Repository hochladen.
2. Im Repository zu **Settings → Pages** gehen.
3. Unter **Branch** die Option **main** und den Ordner **/ (root)** auswählen, dann **Save** klicken.
4. Nach ein bis zwei Minuten zeigt GitHub den Link zur Live-Seite an (z. B. `https://benutzername.github.io/repositoryname/`).

## Installation auf dem Smartphone (Google Pixel 10 Pro)

1. Den Link der Seite in Chrome öffnen.
2. Über das Drei-Punkte-Menü **"Zum Startbildschirm hinzufügen"** auswählen.
3. Die App erscheint danach wie eine normale App auf dem Startbildschirm und lässt sich offline nutzen.

## Anpassung / Erweiterung

- Alle Statusfarben und Bezeichnungen befinden sich zentral in der Konstante `STATUS_CONFIG` am Anfang von `app.js` – neue Kategorien lassen sich dort einfach ergänzen.
- Die Lohnsätze (`wageNormal` = 5,00 € und `wageSuite` = 6,50 €) lassen sich direkt in der App über **Einstellungen ⚙️** ändern, ohne den Code zu bearbeiten.
- Alle Daten werden im `localStorage` des Browsers gespeichert (Schlüssel beginnend mit `clean_`). Über die Export-Funktion lässt sich jederzeit eine Sicherungskopie als JSON-Datei erstellen.

## Dateien

| Datei | Zweck |
|---|---|
| `index.html` | Struktur der App (Seiten, Modale) |
| `styles.css` | Gesamtes Design und Layout |
| `app.js` | Anwendungslogik, Datenspeicherung, Berichte |
| `manifest.json` | PWA-Konfiguration (Name, Icons, Startmodus) |
| `sw.js` | Service Worker für Offline-Funktion |
| `icon-192.png`, `icon-512.png` | App-Icons |
