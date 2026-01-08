import { useState } from 'react';

export function InfoCard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isPathModalOpen, setIsPathModalOpen] = useState(false);

  return (
    <>
      <div className="info-card rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Jak to funguje?
        </h3>

        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full text-white flex items-center justify-center flex-shrink-0 text-sm font-bold bg-brand-green">
              1
            </div>
            <div>
              <p className="font-medium text-gray-700">Nahrajte XLSX export</p>
              <p className="text-sm text-gray-500">Soubor musí obsahovat pouze sloupce: code, defaultCategory, categoryText</p>
              <p className="text-sm text-gray-500 mt-1">
                Pro zobrazení cesty k exportu klikněte{' '}
                <button
                  onClick={() => setIsPathModalOpen(true)}
                  className="font-medium underline hover:no-underline cursor-pointer text-brand-green"
                >
                  zde
                </button>
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Pro zobrazení šablony exportu klikněte{' '}
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="font-medium underline hover:no-underline cursor-pointer text-brand-green"
                >
                  zde
                </button>
                . Další věci v exportu nepotřebujete, čím více věcí tam bude, tím více se toho může rozbít.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full text-white flex items-center justify-center flex-shrink-0 text-sm font-bold bg-brand-green">
              2
            </div>
            <div>
              <p className="font-medium text-gray-700">Automatické zpracování</p>
              <p className="text-sm text-gray-500">Pro každý produkt se přiřadí až 10 souvisejících a 10 podobných produktů</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full text-white flex items-center justify-center flex-shrink-0 text-sm font-bold bg-brand-green">
              3
            </div>
            <div>
              <p className="font-medium text-gray-700">Stáhněte upravený soubor</p>
              <p className="text-sm text-gray-500">Soubor obsahuje nové sloupce relatedProduct1-10 a alternativeProduct1-10</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full text-white flex items-center justify-center flex-shrink-0 text-sm font-bold bg-brand-green">
              4
            </div>
            <div>
              <p className="font-medium text-gray-700">Naimportujte upravený soubor</p>
              <p className="text-sm text-gray-500">1. V levém menu otevřete "Produkty" a "Import"</p>
              <p className="text-sm text-gray-500">
                2. V otevřeném importu v případě potřeby změňte nastavení{' '}
                <button
                  onClick={() => setIsImportModalOpen(true)}
                  className="font-medium underline hover:no-underline cursor-pointer text-brand-green"
                >
                  podle návodu
                </button>
              </p>
              <p className="text-sm text-gray-500">3. Vyberte nově stažený soubor a v horní části pomocí tlačítka "Import" naimportujte</p>
              <p className="text-sm text-gray-500 mt-1">
                Pro zobrazení návodu klikněte{' '}
                <button
                  onClick={() => setIsImportModalOpen(true)}
                  className="font-medium underline hover:no-underline cursor-pointer text-brand-green"
                >
                  zde
                </button>
              </p>
              {/* Varování o přepsání */}
              <div className="mt-3 ml-0 p-3 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg">
                <p className="text-xs text-amber-700 flex items-start gap-2">
                  <span className="flex-shrink-0">⚠️</span>
                  <span><strong>Upozornění:</strong> Pokud již máte u produktů nastavené související nebo podobné produkty, importem nového souboru se tyto hodnoty přepíší a nahradí novými.</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 info-card-footer">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-brand-green">Související produkty</p>
              <p className="text-gray-500">Doplňkové produkty ze stejné hlavní kategorie</p>
            </div>
            <div>
              <p className="font-medium text-brand-green">Podobné produkty</p>
              <p className="text-gray-500">Alternativy produktu ze stejné produktové skupiny</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal pro zobrazení obrázku šablony exportu */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
          onClick={() => setIsModalOpen(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            {/* Tlačítko zavřít */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Obrázek */}
            <img
              src="/sablona-exportu.jpg"
              alt="Šablona exportu"
              className="w-full h-auto rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      {/* Modal pro zobrazení cesty k exportu */}
      {isPathModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
          onClick={() => setIsPathModalOpen(false)}
        >
          <div className="relative max-h-[90vh]" style={{ width: '125%', maxWidth: '90vw' }}>
            {/* Tlačítko zavřít */}
            <button
              onClick={() => setIsPathModalOpen(false)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Obrázek */}
            <img
              src="/cesta-k-exportu.jpg"
              alt="Cesta k exportu"
              className="w-full h-auto rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      {/* Modal pro zobrazení návodu na import */}
      {isImportModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
          onClick={() => setIsImportModalOpen(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            {/* Tlačítko zavřít */}
            <button
              onClick={() => setIsImportModalOpen(false)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Obrázek */}
            <img
              src="/import-produktu.jpg"
              alt="Návod na import produktu"
              className="w-full h-auto rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  );
}
