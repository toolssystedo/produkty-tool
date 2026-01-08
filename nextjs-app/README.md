# Shoptet XLSX Processor

Nástroj pro automatické přiřazení souvisejících a podobných produktů pro Shoptet. Postaveno na Next.js 16, TypeScript, Tailwind CSS a Shadcn/ui.

## Funkce

- Nahrání XLSX souboru s produkty
- Automatické přiřazení souvisejících produktů (na základě kategorie)
- Automatické přiřazení podobných produktů (na základě podkategorie)
- Nastavitelný počet přiřazených produktů (1-10)
- Možnost vybrat typ produktů k přiřazení
- Statistiky kvality dat
- Export statistik do PDF
- Dark mode
- Historie zpracovaných souborů

## Požadavky

- Node.js 18+
- npm nebo yarn

## Instalace

```bash
# Klonování repozitáře
git clone <url-repozitare>
cd produkty-tool/nextjs-app

# Instalace závislostí
npm install
```

## Spuštění

### Vývojový server

```bash
npm run dev
```

Aplikace bude dostupná na [http://localhost:3000/produkty-tool](http://localhost:3000/produkty-tool)

### Build pro produkci

```bash
npm run build
```

Výstup bude ve složce `out/`.

## Struktura projektu

```
nextjs-app/
├── public/              # Statické soubory (obrázky, favicon)
├── src/
│   ├── app/             # Next.js App Router
│   │   ├── globals.css  # Globální styly + Tailwind
│   │   ├── layout.tsx   # Root layout
│   │   └── page.tsx     # Hlavní stránka
│   ├── components/      # React komponenty
│   │   ├── ui/          # Shadcn/ui komponenty
│   │   └── ...          # Vlastní komponenty
│   ├── hooks/           # Custom React hooks
│   └── lib/             # Utility funkce
│       ├── xlsx-processor.ts  # Zpracování XLSX
│       ├── pdf-export.ts      # Export do PDF
│       └── utils.ts           # Helper funkce
├── next.config.ts       # Next.js konfigurace
├── tailwind.config.ts   # Tailwind konfigurace
└── tsconfig.json        # TypeScript konfigurace
```

## Deploy na Vercel

### Automatický deploy

1. Nahrajte repozitář na GitHub
2. Přejděte na [vercel.com](https://vercel.com) a přihlaste se
3. Klikněte na "Add New Project"
4. Importujte repozitář z GitHubu
5. Nastavte:
   - **Framework Preset**: Next.js
   - **Root Directory**: `nextjs-app`
   - **Build Command**: `npm run build`
   - **Output Directory**: `out`
6. Klikněte na "Deploy"

### Manuální deploy

```bash
# Instalace Vercel CLI
npm install -g vercel

# Deploy
cd nextjs-app
vercel
```

### Nastavení pro subdomain/subfolder

Aplikace je nakonfigurována s `basePath: '/produkty-tool'`. Pokud chcete změnit cestu:

1. Upravte `next.config.ts`:
   ```typescript
   const nextConfig: NextConfig = {
     basePath: '/vase-cesta',  // nebo '' pro root
     // ...
   };
   ```

2. Znovu sestavte aplikaci

## Konfigurace

### Barvy (Systedo brand)

Barvy jsou definovány v `src/app/globals.css`:

```css
:root {
  --primary: #005c54;
  --brand: #005c54;
  --brand-light: #007a70;
  --brand-lighter: #33afa3;
}
```

### Dark mode

Dark mode je automaticky nastaven podle systémových preferencí. Uživatel může přepínat v hlavičce aplikace.

## Technologie

- [Next.js 16](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS 4](https://tailwindcss.com/) - Styling
- [Shadcn/ui](https://ui.shadcn.com/) - UI komponenty
- [SheetJS (xlsx)](https://sheetjs.com/) - Práce s Excel soubory
- [jsPDF](https://github.com/parallax/jsPDF) - Generování PDF
- [next-themes](https://github.com/pacocoursey/next-themes) - Dark mode

## Licence

Interní nástroj Systedo
