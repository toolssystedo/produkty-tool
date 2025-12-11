import * as XLSX from 'xlsx';

/**
 * Náhodně zamíchá pole (Fisher-Yates shuffle)
 */
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Extrahuje hlavní kategorii z defaultCategory
 * Např. "Elektronika > Telefony > Příslušenství" -> "Elektronika"
 */
function getMainCategory(defaultCategory) {
  if (!defaultCategory) return null;
  const parts = defaultCategory.split('>').map(p => p.trim());
  return parts[0] || null;
}

/**
 * Získá podkategorii (vše kromě hlavní kategorie)
 */
function getSubCategory(defaultCategory) {
  if (!defaultCategory) return null;
  const parts = defaultCategory.split('>').map(p => p.trim());
  return parts.slice(1).join(' > ') || null;
}

/**
 * Získá všechny categoryText hodnoty z produktu (categoryText, categoryText2, categoryText3, ...)
 */
function getAllCategoryTexts(product) {
  const categoryTexts = [];

  // Projdi všechny klíče produktu a najdi categoryText sloupce
  Object.keys(product).forEach(key => {
    if (key === 'categoryText' || /^categoryText\d+$/.test(key)) {
      const value = product[key];
      if (value && typeof value === 'string' && value.trim()) {
        categoryTexts.push(value.trim());
      }
    }
  });

  return categoryTexts;
}

/**
 * Zpracuje data z XLSX souboru a přidá související a podobné produkty
 * Zachovává původní pořadí sloupců a přidává nové na konec
 */
export function processData(data, originalColumns) {
  // Vytvoření indexů pro rychlé vyhledávání
  const productsByMainCategory = new Map(); // hlavní kategorie -> produkty
  const productsByCategoryText = new Map(); // kompletní categoryText -> produkty

  // Indexování produktů
  data.forEach((product) => {
    const mainCategory = getMainCategory(product.defaultCategory);

    // Index podle hlavní kategorie
    if (mainCategory) {
      if (!productsByMainCategory.has(mainCategory)) {
        productsByMainCategory.set(mainCategory, []);
      }
      productsByMainCategory.get(mainCategory).push(product);
    }

    // Index podle VŠECH categoryText sloupců (categoryText, categoryText2, categoryText3, ...)
    const allCategoryTexts = getAllCategoryTexts(product);
    allCategoryTexts.forEach(categoryText => {
      if (!productsByCategoryText.has(categoryText)) {
        productsByCategoryText.set(categoryText, []);
      }
      productsByCategoryText.get(categoryText).push(product);
    });
  });

  // Definice názvů nových sloupců
  const relatedColumns = ['relatedProduct', ...Array.from({ length: 9 }, (_, i) => `relatedProduct${i + 2}`)];
  const alternativeColumns = ['alternativeProduct', ...Array.from({ length: 9 }, (_, i) => `alternativeProduct${i + 2}`)];

  // Zpracování každého produktu
  const processedData = data.map((product) => {
    // Vytvoř nový objekt se zachováním původního pořadí sloupců
    const result = {};

    // Nejprve přidej všechny původní sloupce v původním pořadí
    originalColumns.forEach(col => {
      if (col in product) {
        result[col] = product[col];
      } else {
        result[col] = ''; // Zachovej sloupec i když je prázdný
      }
    });

    const mainCategory = getMainCategory(product.defaultCategory);
    const currentSubCategory = getSubCategory(product.defaultCategory);

    // SOUVISEJÍCÍ PRODUKTY (relatedProduct)
    // Vyber až 10 náhodných produktů se STEJNOU hlavní kategorií
    // Preferuj produkty s jinou podkategorií, ale pokud jich není dost, použij i produkty se stejnou podkategorií
    const selectedRelatedCodes = [];
    if (mainCategory) {
      const sameMainCategoryProducts = productsByMainCategory.get(mainCategory) || [];

      // Vyloučit sám sebe
      const allCandidates = sameMainCategoryProducts.filter(p => p.code !== product.code);

      // Rozděl kandidáty na ty s jinou podkategorií a ty se stejnou
      const differentSubCategory = [];
      const sameSubCategory = [];

      allCandidates.forEach(p => {
        const pSubCategory = getSubCategory(p.defaultCategory);
        // Porovnávej pouze pokud obě podkategorie existují
        if (currentSubCategory && pSubCategory && pSubCategory !== currentSubCategory) {
          differentSubCategory.push(p);
        } else if (!currentSubCategory || !pSubCategory || pSubCategory === currentSubCategory) {
          sameSubCategory.push(p);
        }
      });

      // Preferuj produkty s jinou podkategorií, ale doplň produkty se stejnou podkategorií pokud je potřeba
      const shuffledDifferent = shuffleArray(differentSubCategory);
      const shuffledSame = shuffleArray(sameSubCategory);

      // Nejdřív přidej produkty s jinou podkategorií
      shuffledDifferent.slice(0, 10).forEach(p => selectedRelatedCodes.push(p.code));

      // Pokud jich není 10, doplň produkty se stejnou podkategorií
      if (selectedRelatedCodes.length < 10) {
        const remaining = 10 - selectedRelatedCodes.length;
        shuffledSame.slice(0, remaining).forEach(p => selectedRelatedCodes.push(p.code));
      }

      // Debug výpis
      console.log(`[Related] Produkt ${product.code}: hlavní kategorie="${mainCategory}", podkategorie="${currentSubCategory || '(žádná)'}", ` +
        `kandidátů celkem=${allCandidates.length}, s jinou podkat.=${differentSubCategory.length}, ` +
        `se stejnou podkat.=${sameSubCategory.length}, vybráno=${selectedRelatedCodes.length}`);
    } else {
      console.log(`[Related] Produkt ${product.code}: NEMÁ hlavní kategorii (defaultCategory="${product.defaultCategory}")`);
    }

    // Přidej relatedProduct sloupce
    relatedColumns.forEach((colName, index) => {
      result[colName] = selectedRelatedCodes[index] || '';
    });

    // PODOBNÉ PRODUKTY (alternativeProduct)
    // Vyber až 10 náhodných produktů ze VŠECH categoryText kategorií produktu
    const selectedAlternativeCodes = [];
    const currentCategoryTexts = getAllCategoryTexts(product);

    if (currentCategoryTexts.length > 0) {
      // Sbírej kandidáty ze všech categoryText kategorií
      const allAlternativeCandidates = new Set();

      currentCategoryTexts.forEach(categoryText => {
        const sameCategoryTextProducts = productsByCategoryText.get(categoryText) || [];
        sameCategoryTextProducts.forEach(p => {
          if (p.code !== product.code) { // Vyloučit sám sebe
            allAlternativeCandidates.add(p);
          }
        });
      });

      // Převeď Set na pole a náhodně vyber až 10 produktů
      const candidatesArray = Array.from(allAlternativeCandidates);
      const shuffledAlternative = shuffleArray(candidatesArray);
      shuffledAlternative.slice(0, 10).forEach(p => selectedAlternativeCodes.push(p.code));
    }

    // Přidej alternativeProduct sloupce
    alternativeColumns.forEach((colName, index) => {
      result[colName] = selectedAlternativeCodes[index] || '';
    });

    return result;
  });

  // Souhrnný debug výpis
  const productsWithRelated = processedData.filter(p => p.relatedProduct && p.relatedProduct !== '').length;
  const productsWithAlternative = processedData.filter(p => p.alternativeProduct && p.alternativeProduct !== '').length;
  console.log(`\n=== SOUHRN ZPRACOVÁNÍ ===`);
  console.log(`Celkem produktů: ${processedData.length}`);
  console.log(`Produktů s alespoň 1 souvisejícím produktem: ${productsWithRelated} (${Math.round(productsWithRelated / processedData.length * 100)}%)`);
  console.log(`Produktů s alespoň 1 alternativním produktem: ${productsWithAlternative} (${Math.round(productsWithAlternative / processedData.length * 100)}%)`);
  console.log(`Počet hlavních kategorií: ${productsByMainCategory.size}`);
  console.log(`Počet unikátních categoryText: ${productsByCategoryText.size}`);
  console.log(`========================\n`);

  return processedData;
}

/**
 * Načte XLSX soubor a vrátí data jako pole objektů + původní pořadí sloupců
 */
export function readXlsxFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // Použij první list
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Získej původní pořadí sloupců z hlavičky
        const range = XLSX.utils.decode_range(worksheet['!ref']);
        const originalColumns = [];
        for (let col = range.s.c; col <= range.e.c; col++) {
          const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
          const cell = worksheet[cellAddress];
          if (cell && cell.v) {
            originalColumns.push(cell.v);
          }
        }

        // Převeď na JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        resolve({ data: jsonData, originalColumns });
      } catch (error) {
        reject(new Error('Nepodařilo se načíst soubor: ' + error.message));
      }
    };

    reader.onerror = () => {
      reject(new Error('Chyba při čtení souboru'));
    };

    reader.readAsArrayBuffer(file);
  });
}

/**
 * Vytvoří XLSX soubor z dat a stáhne ho
 * Zachovává původní pořadí sloupců a přidává nové na konec
 */
export function downloadXlsx(data, filename = 'processed_products.xlsx', originalColumns = []) {
  // Definuj nové sloupce
  const relatedColumns = ['relatedProduct', ...Array.from({ length: 9 }, (_, i) => `relatedProduct${i + 2}`)];
  const alternativeColumns = ['alternativeProduct', ...Array.from({ length: 9 }, (_, i) => `alternativeProduct${i + 2}`)];

  // Finální pořadí sloupců: původní + related + alternative
  const finalColumnOrder = [...originalColumns, ...relatedColumns, ...alternativeColumns];

  // Vytvoř data s garantovaným pořadím sloupců
  const orderedData = data.map(row => {
    const orderedRow = {};
    finalColumnOrder.forEach(col => {
      orderedRow[col] = row[col] !== undefined ? row[col] : '';
    });
    return orderedRow;
  });

  // Vytvoř list s explicitním pořadím sloupců
  const worksheet = XLSX.utils.json_to_sheet(orderedData, { header: finalColumnOrder });

  // Vytvoř workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');

  // Stáhni soubor
  XLSX.writeFile(workbook, filename);
}

/**
 * Validuje, zda data obsahují potřebné sloupce a neobsahují sloupce navíc
 */
export function validateData(data, originalColumns = []) {
  if (!data || data.length === 0) {
    return { valid: false, error: 'Soubor neobsahuje žádná data' };
  }

  const requiredColumns = ['code', 'pairCode', 'name', 'defaultCategory', 'categoryText'];

  // Použij originalColumns pro kontrolu - řeší problém s prázdnými buňkami
  // (XLSX knihovna nezahrnuje do JSON sloupce s prázdnou hodnotou v daném řádku)
  const columnsInFile = originalColumns.length > 0 ? originalColumns : Object.keys(data[0]);

  // Kontrola chybějících sloupců
  const missingColumns = requiredColumns.filter(col => !columnsInFile.includes(col));
  if (missingColumns.length > 0) {
    return {
      valid: false,
      error: `Chybějící sloupce: ${missingColumns.join(', ')}`
    };
  }

  // Kontrola sloupců navíc
  // Povolené jsou: code, pairCode, name, defaultCategory, categoryText, categoryText2, categoryText3, ...
  const extraColumns = columnsInFile.filter(col => {
    // Povolené základní sloupce
    if (['code', 'pairCode', 'name', 'defaultCategory', 'categoryText'].includes(col)) {
      return false;
    }
    // Povolené categoryText2, categoryText3, atd.
    if (/^categoryText\d+$/.test(col)) {
      return false;
    }
    // Vše ostatní je nepovolené
    return true;
  });

  if (extraColumns.length > 0) {
    return {
      valid: false,
      error: `Soubor obsahuje nepovolené sloupce: ${extraColumns.join(', ')}. Povolené sloupce jsou: code, pairCode, name, defaultCategory, categoryText (a categoryText2, categoryText3, ...)`
    };
  }

  return { valid: true };
}

/**
 * Získá statistiky o datech
 */
export function getStats(data) {
  const mainCategories = new Set();
  const categoryTexts = new Set();

  data.forEach(product => {
    const mainCat = getMainCategory(product.defaultCategory);
    if (mainCat) mainCategories.add(mainCat);

    // Počítej všechny categoryText sloupce
    getAllCategoryTexts(product).forEach(ct => categoryTexts.add(ct));
  });

  return {
    totalProducts: data.length,
    mainCategories: mainCategories.size,
    uniqueCategoryTexts: categoryTexts.size
  };
}

/**
 * Získá detailní statistiky o kvalitě dat po zpracování
 */
export function getDetailedStats(processedData) {
  const stats = {
    // Základní metriky
    totalProducts: processedData.length,
    avgRelatedProducts: 0,
    avgAlternativeProducts: 0,
    fullRelatedPercent: 0,
    fullAlternativePercent: 0,
    lowRelatedCount: 0,
    lowAlternativeCount: 0,

    // Analýza kategorií
    categoryAnalysis: [],

    // Problémové oblasti
    smallCategories: [],
    productsWithoutCategoryText: 0,
    singleProductSubcategories: [],

    // Top performers
    topRelatedCategories: [],
    topConnectedSubcategories: []
  };

  if (processedData.length === 0) return stats;

  // Pomocné struktury
  const categoryData = new Map(); // defaultCategory -> { products, relatedCounts, alternativeCounts }
  const subcategoryData = new Map(); // subcategory -> { products, relatedCounts }
  let totalRelated = 0;
  let totalAlternative = 0;
  let fullRelatedCount = 0;
  let fullAlternativeCount = 0;

  // Názvy sloupců pro related a alternative produkty
  const relatedColumns = ['relatedProduct', ...Array.from({ length: 9 }, (_, i) => `relatedProduct${i + 2}`)];
  const alternativeColumns = ['alternativeProduct', ...Array.from({ length: 9 }, (_, i) => `alternativeProduct${i + 2}`)];

  // Procházíme všechny produkty
  processedData.forEach(product => {
    // Počet related produktů
    const relatedCount = relatedColumns.filter(col => product[col] && product[col] !== '').length;
    // Počet alternative produktů
    const alternativeCount = alternativeColumns.filter(col => product[col] && product[col] !== '').length;

    totalRelated += relatedCount;
    totalAlternative += alternativeCount;

    if (relatedCount === 10) fullRelatedCount++;
    if (alternativeCount === 10) fullAlternativeCount++;

    if (relatedCount < 3) stats.lowRelatedCount++;
    if (alternativeCount < 3) stats.lowAlternativeCount++;

    // Kontrola categoryText
    const hasCategoryText = getAllCategoryTexts(product).length > 0;
    if (!hasCategoryText) stats.productsWithoutCategoryText++;

    // Analýza kategorií
    const mainCategory = getMainCategory(product.defaultCategory);
    if (mainCategory) {
      if (!categoryData.has(mainCategory)) {
        categoryData.set(mainCategory, { products: 0, relatedSum: 0, alternativeSum: 0 });
      }
      const catData = categoryData.get(mainCategory);
      catData.products++;
      catData.relatedSum += relatedCount;
      catData.alternativeSum += alternativeCount;
    }

    // Analýza podkategorií
    const subCategory = getSubCategory(product.defaultCategory);
    if (subCategory) {
      if (!subcategoryData.has(subCategory)) {
        subcategoryData.set(subCategory, { products: 0, relatedSum: 0 });
      }
      const subData = subcategoryData.get(subCategory);
      subData.products++;
      subData.relatedSum += relatedCount;
    }
  });

  // Výpočet průměrů
  stats.avgRelatedProducts = Math.round((totalRelated / processedData.length) * 10) / 10;
  stats.avgAlternativeProducts = Math.round((totalAlternative / processedData.length) * 10) / 10;
  stats.fullRelatedPercent = Math.round((fullRelatedCount / processedData.length) * 100);
  stats.fullAlternativePercent = Math.round((fullAlternativeCount / processedData.length) * 100);

  // Analýza kategorií (TOP 5 podle počtu produktů)
  const sortedCategories = Array.from(categoryData.entries())
    .map(([name, data]) => ({
      name,
      productCount: data.products,
      avgRelated: Math.round((data.relatedSum / data.products) * 10) / 10,
      avgAlternative: Math.round((data.alternativeSum / data.products) * 10) / 10
    }))
    .sort((a, b) => b.productCount - a.productCount);

  stats.categoryAnalysis = sortedCategories.slice(0, 5);

  // Malé kategorie (méně než 10 produktů)
  stats.smallCategories = sortedCategories
    .filter(cat => cat.productCount < 10)
    .slice(0, 5);

  // Top performers - kategorie s nejvyšším průměrem related
  stats.topRelatedCategories = [...sortedCategories]
    .filter(cat => cat.productCount >= 5) // Pouze kategorie s alespoň 5 produkty
    .sort((a, b) => b.avgRelated - a.avgRelated)
    .slice(0, 3);

  // Podkategorie s pouze 1 produktem
  const singleProductSubs = Array.from(subcategoryData.entries())
    .filter(([, data]) => data.products === 1)
    .map(([name]) => name);
  stats.singleProductSubcategories = singleProductSubs.slice(0, 5);

  // Top propojené podkategorie
  stats.topConnectedSubcategories = Array.from(subcategoryData.entries())
    .filter(([, data]) => data.products >= 3)
    .map(([name, data]) => ({
      name,
      productCount: data.products,
      avgRelated: Math.round((data.relatedSum / data.products) * 10) / 10
    }))
    .sort((a, b) => b.avgRelated - a.avgRelated)
    .slice(0, 3);

  return stats;
}
