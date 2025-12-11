# Shoptet XLSX Processor

Interní nástroj pro zpracování XLSX exportů z Shoptetu. Aplikace umožňuje nahrát Excel soubor, zpracovat data a stáhnout upravený soubor zpět.

## Funkce

- Nahrání XLSX souboru z exportu Shoptetu
- Automatické zpracování a validace dat
- Zobrazení statistik o kvalitě dat
- Export statistik do PDF
- Stažení zpracovaného XLSX souboru
- Historie zpracovaných souborů
- Tmavý/světlý režim

## Požadavky

- [Node.js](https://nodejs.org/) verze 18 nebo novější
- [Git](https://git-scm.com/) (pro stažení projektu)

## Instalace a spuštění

### 1. Stažení projektu

Otevřete terminál (Command Prompt, PowerShell nebo Git Bash) a spusťte:

```bash
git clone https://github.com/toolssystedo/produkty-tool.git
cd produkty-tool
```

### 2. Instalace závislostí

```bash
npm install
```

### 3. Spuštění vývojového serveru

```bash
npm run dev
```

Po spuštění se v terminálu zobrazí URL adresa (obvykle `http://localhost:5173`). Otevřete ji v prohlížeči.

## Další příkazy

| Příkaz | Popis |
|--------|-------|
| `npm run dev` | Spustí vývojový server |
| `npm run build` | Vytvoří produkční build |
| `npm run preview` | Spustí náhled produkčního buildu |
| `npm run lint` | Spustí kontrolu kódu (ESLint) |

## Jak používat aplikaci

1. Otevřete aplikaci v prohlížeči
2. Přetáhněte XLSX soubor do upload zóny nebo klikněte pro výběr souboru
3. Počkejte na zpracování dat
4. Prohlédněte si statistiky kvality dat (volitelné)
5. Stáhněte zpracovaný soubor nebo PDF se statistikami

## Technologie

- React 19
- Vite 7
- Tailwind CSS 4
- xlsx (SheetJS) - zpracování Excel souborů
- jsPDF + html2canvas - export do PDF
