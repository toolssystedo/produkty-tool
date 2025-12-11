export function DataQualityStats({ detailedStats }) {
  if (!detailedStats) return null;

  const {
    totalProducts,
    avgRelatedProducts,
    avgAlternativeProducts,
    fullRelatedPercent,
    fullAlternativePercent,
    lowRelatedCount,
    lowAlternativeCount,
    categoryAnalysis,
    smallCategories,
    productsWithoutCategoryText,
    singleProductSubcategories,
    topRelatedCategories,
    topConnectedSubcategories
  } = detailedStats;

  // Pomocná funkce pro ikonu stavu
  const getStatusIcon = (avg) => {
    if (avg >= 7) {
      return (
        <span className="text-green-600 font-bold">✓</span>
      );
    } else if (avg < 5) {
      return (
        <span className="text-amber-500 font-bold">⚠</span>
      );
    }
    return <span className="text-gray-400">–</span>;
  };

  // Má problémové oblasti?
  const hasProblems = smallCategories.length > 0 ||
                      productsWithoutCategoryText > 0 ||
                      singleProductSubcategories.length > 0;

  // Nepoužité proměnné (odstraněna sekce "Nejlépe propojené")
  void topRelatedCategories;
  void topConnectedSubcategories;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 space-y-6">
      {/* Hlavička */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#e6f2f1' }}>
          <svg className="w-5 h-5" style={{ color: '#005c54' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Kvalita dat a statistiky</h3>
          <p className="text-sm text-gray-500">Přehled zpracovaných dat a doporučení</p>
        </div>
      </div>

      {/* 1. ZÁKLADNÍ METRIKY */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Základní metriky</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold" style={{ color: '#005c54' }}>{totalProducts}</p>
            <p className="text-xs text-gray-500 mt-1">Zpracovaných produktů</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold" style={{ color: '#005c54' }}>{avgRelatedProducts}</p>
            <p className="text-xs text-gray-500 mt-1">Ø souvisejících</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold" style={{ color: '#005c54' }}>{avgAlternativeProducts}</p>
            <p className="text-xs text-gray-500 mt-1">Ø podobných</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold" style={{ color: '#005c54' }}>{fullRelatedPercent}%</p>
            <p className="text-xs text-gray-500 mt-1">s plným počtem (10)</p>
          </div>
        </div>

        {/* Varování */}
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className={`rounded-xl p-3 flex items-center gap-3 ${lowRelatedCount > 0 ? 'bg-amber-50 border border-amber-200' : 'bg-green-50 border border-green-200'}`}>
            <span className={`text-lg ${lowRelatedCount > 0 ? 'text-amber-500' : 'text-green-600'}`}>
              {lowRelatedCount > 0 ? '⚠' : '✓'}
            </span>
            <div>
              <p className={`text-sm font-medium ${lowRelatedCount > 0 ? 'text-amber-800' : 'text-green-800'}`}>
                {lowRelatedCount > 0 ? `${lowRelatedCount} produktů` : 'Všechny produkty OK'}
              </p>
              <p className={`text-xs ${lowRelatedCount > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                {lowRelatedCount > 0 ? 'má méně než 3 související' : 'mají 3+ souvisejících'}
              </p>
            </div>
          </div>
          <div className={`rounded-xl p-3 flex items-center gap-3 ${lowAlternativeCount > 0 ? 'bg-amber-50 border border-amber-200' : 'bg-green-50 border border-green-200'}`}>
            <span className={`text-lg ${lowAlternativeCount > 0 ? 'text-amber-500' : 'text-green-600'}`}>
              {lowAlternativeCount > 0 ? '⚠' : '✓'}
            </span>
            <div>
              <p className={`text-sm font-medium ${lowAlternativeCount > 0 ? 'text-amber-800' : 'text-green-800'}`}>
                {lowAlternativeCount > 0 ? `${lowAlternativeCount} produktů` : 'Všechny produkty OK'}
              </p>
              <p className={`text-xs ${lowAlternativeCount > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                {lowAlternativeCount > 0 ? 'má méně než 3 podobné' : 'mají 3+ podobných'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. ANALÝZA KATEGORIÍ */}
      {categoryAnalysis.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Analýza kategorií (TOP 5)</h4>
          <div className="overflow-hidden rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-2 px-3 font-medium text-gray-600">Kategorie</th>
                  <th className="text-center py-2 px-3 font-medium text-gray-600">Produktů</th>
                  <th className="text-center py-2 px-3 font-medium text-gray-600">Ø souvisejících</th>
                  <th className="text-center py-2 px-3 font-medium text-gray-600 w-12">Stav</th>
                </tr>
              </thead>
              <tbody>
                {categoryAnalysis.map((cat, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="py-2 px-3 text-gray-800 font-medium truncate max-w-[200px]" title={cat.name}>
                      {cat.name}
                    </td>
                    <td className="py-2 px-3 text-center text-gray-600">{cat.productCount}</td>
                    <td className="py-2 px-3 text-center text-gray-600">{cat.avgRelated}</td>
                    <td className="py-2 px-3 text-center">{getStatusIcon(cat.avgRelated)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. PROBLÉMOVÉ OBLASTI */}
      {hasProblems && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Problémové oblasti</h4>
          <div className="space-y-3">
            {/* Malé kategorie */}
            {smallCategories.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <span className="text-amber-500 text-lg">⚠</span>
                  <div className="flex-1">
                    <p className="font-medium text-amber-800">Kategorie s méně než 10 produkty</p>
                    <p className="text-xs text-amber-600 mt-1">Doporučujeme rozšířit pro lepší propojení</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {smallCategories.map((cat, i) => (
                        <span key={i} className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
                          {cat.name} <span className="text-amber-600">({cat.productCount})</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Produkty bez categoryText */}
            {productsWithoutCategoryText > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <span className="text-amber-500 text-lg">⚠</span>
                  <div>
                    <p className="font-medium text-amber-800">{productsWithoutCategoryText} produktů bez categoryText</p>
                    <p className="text-xs text-amber-600 mt-1">Tyto produkty nemají přiřazeny podobné produkty</p>
                  </div>
                </div>
              </div>
            )}

            {/* Podkategorie s 1 produktem */}
            {singleProductSubcategories.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <span className="text-amber-500 text-lg">⚠</span>
                  <div className="flex-1">
                    <p className="font-medium text-amber-800">Podkategorie s pouze 1 produktem</p>
                    <p className="text-xs text-amber-600 mt-1">Nelze přiřadit podobné produkty ve stejné podkategorii</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {singleProductSubcategories.map((sub, i) => (
                        <span key={i} className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full truncate max-w-[250px]" title={sub}>
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
