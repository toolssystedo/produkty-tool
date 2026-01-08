# Shoptet XLSX Processor

Interní nástroj pro zpracování XLSX exportů z Shoptetu. Aplikace umožňuje nahrát Excel soubor, automaticky přiřadit související a podobné produkty a stáhnout upravený soubor zpět.

## Struktura projektu

Aplikace se nachází ve složce `nextjs-app/`. Podrobný návod na instalaci, spuštění a deploy najdete v [nextjs-app/README.md](./nextjs-app/README.md).

## Rychlý start

```bash
cd nextjs-app
npm install
npm run dev
```

Aplikace poběží na http://localhost:3000

## Funkce

- Nahrání XLSX souboru z exportu Shoptetu
- Automatické přiřazení souvisejících produktů (na základě kategorie)
- Automatické přiřazení podobných produktů (na základě podkategorie)
- Nastavitelný počet přiřazených produktů (1-10)
- Zobrazení statistik o kvalitě dat
- Export statistik do PDF
- Stažení zpracovaného XLSX souboru
- Historie zpracovaných souborů
- Tmavý/světlý režim

## Technologie

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS 4
- Shadcn/ui
- xlsx (SheetJS)
- jsPDF
