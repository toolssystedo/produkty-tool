'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Info, AlertTriangle } from 'lucide-react';

export function InfoCard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isPathModalOpen, setIsPathModalOpen] = useState(false);

  return (
    <>
      <div className="info-card rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Info className="w-5 h-5 text-primary" />
          Jak to funguje?
        </h3>

        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full text-primary-foreground flex items-center justify-center flex-shrink-0 text-sm font-bold bg-primary">
              1
            </div>
            <div>
              <p className="font-medium text-foreground">Nahrajte XLSX export</p>
              <p className="text-sm text-muted-foreground">Soubor musí obsahovat pouze sloupce: code, defaultCategory, categoryText</p>
              <p className="text-sm text-muted-foreground mt-1">
                Pro zobrazení cesty k exportu klikněte{' '}
                <button
                  onClick={() => setIsPathModalOpen(true)}
                  className="font-medium underline hover:no-underline cursor-pointer text-primary"
                >
                  zde
                </button>
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Pro zobrazení šablony exportu klikněte{' '}
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="font-medium underline hover:no-underline cursor-pointer text-primary"
                >
                  zde
                </button>
                . Další věci v exportu nepotřebujete, čím více věcí tam bude, tím více se toho může rozbít.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full text-primary-foreground flex items-center justify-center flex-shrink-0 text-sm font-bold bg-primary">
              2
            </div>
            <div>
              <p className="font-medium text-foreground">Automatické zpracování</p>
              <p className="text-sm text-muted-foreground">Pro každý produkt se přiřadí až 10 souvisejících a 10 podobných produktů</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full text-primary-foreground flex items-center justify-center flex-shrink-0 text-sm font-bold bg-primary">
              3
            </div>
            <div>
              <p className="font-medium text-foreground">Stáhněte upravený soubor</p>
              <p className="text-sm text-muted-foreground">Soubor obsahuje nové sloupce relatedProduct1-10 a alternativeProduct1-10</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full text-primary-foreground flex items-center justify-center flex-shrink-0 text-sm font-bold bg-primary">
              4
            </div>
            <div>
              <p className="font-medium text-foreground">Naimportujte upravený soubor</p>
              <p className="text-sm text-muted-foreground">1. V levém menu otevřete &quot;Produkty&quot; a &quot;Import&quot;</p>
              <p className="text-sm text-muted-foreground">
                2. V otevřeném importu v případě potřeby změňte nastavení{' '}
                <button
                  onClick={() => setIsImportModalOpen(true)}
                  className="font-medium underline hover:no-underline cursor-pointer text-primary"
                >
                  podle návodu
                </button>
              </p>
              <p className="text-sm text-muted-foreground">3. Vyberte nově stažený soubor a v horní části pomocí tlačítka &quot;Import&quot; naimportujte</p>
              <p className="text-sm text-muted-foreground mt-1">
                Pro zobrazení návodu klikněte{' '}
                <button
                  onClick={() => setIsImportModalOpen(true)}
                  className="font-medium underline hover:no-underline cursor-pointer text-primary"
                >
                  zde
                </button>
              </p>
              {/* Warning about overwriting */}
              <div className="mt-3 ml-0 p-3 bg-amber-50 dark:bg-amber-950/50 border-l-4 border-amber-400 rounded-r-lg">
                <p className="text-xs text-amber-700 dark:text-amber-400 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span><strong>Upozornění:</strong> Pokud již máte u produktů nastavené související nebo podobné produkty, importem nového souboru se tyto hodnoty přepíší a nahradí novými.</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 info-card-footer">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-primary">Související produkty</p>
              <p className="text-muted-foreground">Doplňkové produkty ze stejné hlavní kategorie</p>
            </div>
            <div>
              <p className="font-medium text-primary">Podobné produkty</p>
              <p className="text-muted-foreground">Alternativy produktu ze stejné produktové skupiny</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for export template image */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <img
            src="/sablona-exportu.jpg"
            alt="Šablona exportu"
            className="w-full h-auto"
          />
        </DialogContent>
      </Dialog>

      {/* Modal for export path image */}
      <Dialog open={isPathModalOpen} onOpenChange={setIsPathModalOpen}>
        <DialogContent className="max-w-5xl p-0 overflow-hidden">
          <img
            src="/cesta-k-exportu.jpg"
            alt="Cesta k exportu"
            className="w-full h-auto"
          />
        </DialogContent>
      </Dialog>

      {/* Modal for import guide image */}
      <Dialog open={isImportModalOpen} onOpenChange={setIsImportModalOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <img
            src="/import-produktu.jpg"
            alt="Návod na import produktu"
            className="w-full h-auto"
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
