import jsPDF from 'jspdf';

/**
 * Odstraní diakritiku z textu (pro jsPDF který ji nepodporuje)
 */
function removeDiacritics(str) {
  const diacriticsMap = {
    'á': 'a', 'č': 'c', 'ď': 'd', 'é': 'e', 'ě': 'e', 'í': 'i', 'ň': 'n',
    'ó': 'o', 'ř': 'r', 'š': 's', 'ť': 't', 'ú': 'u', 'ů': 'u', 'ý': 'y', 'ž': 'z',
    'Á': 'A', 'Č': 'C', 'Ď': 'D', 'É': 'E', 'Ě': 'E', 'Í': 'I', 'Ň': 'N',
    'Ó': 'O', 'Ř': 'R', 'Š': 'S', 'Ť': 'T', 'Ú': 'U', 'Ů': 'U', 'Ý': 'Y', 'Ž': 'Z'
  };
  return str.replace(/[áčďéěíňóřšťúůýžÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]/g, match => diacriticsMap[match] || match);
}

// Systedo brand colors
const COLORS = {
  primary: [0, 92, 84], // #005c54
  primaryLight: [230, 242, 241], // #e6f2f1
  text: [31, 41, 55], // #1f2937
  textMuted: [107, 114, 128], // #6b7280
  warning: [180, 83, 9], // amber-700
  warningBg: [254, 243, 199], // amber-100
  success: [22, 163, 74], // #16a34a
  white: [255, 255, 255],
  lightGray: [243, 244, 246], // #f3f4f6
};

// Logo as base64 (Systedo logo)
const LOGO_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAD3ElEQVRIibWWXWhcRRTH/2fmzr2b3bsfSRZTLLRptVQRi4rtiwpaWgXB4kNRtGJsEfEDX4QIQVTwQaR9qFgFKZZoEGmhFIIILW0fEvtSpdQvhEhp0waTkGw2u+nu5nbu3jk+bGy9uzebTUwPw8CdOTO/c8/854OwdQuIIMRCLQgkbn2GGqPqOs+GRoFmxk17W7KmAEO3DVABcpR1GAVCCTCrC8jRZz2+OTM3fbzIZ/In+8rQBG+1ANepv1e/3eORACoETU896pljub4nNabFCn6FQioigarg0xXcoDovJHjkT3v3wY4/JiVcWqmKAjy7xaBxaSWdH5ov5grDH4717y2hQPBbXf8wgAGqBRxyuTqqp3JBvE0y5CvPFIvfjD93r4+iAC+NaViDRukLunJVu65wHBFzCJpSrjn2wd/D703DAN4SjOYbDQBAKMwFbTGKOWQrAgMGmJePPVDiw1c+2llCXiL4PwADArtxijlkWf+Jt0oAvd8zMXrw2kMdASoicuO3AAjMRDE+Mp7oyDS4M+DJ9Wu8C/svHX15BuWIdLUAkHjjyJ27D2X3fXpHZV7AbojTEDz5/Pap0Y8LKK0AwIDFSPPARZV4sevoqRQcEzFOW+vXiQO7BPRyAfhXtzYjzS98mdr5btfsjIaisJ4lqtb2+21UlwUggOq3BTOfv1AeGiqZ4OYEDJKARSTBHHZfPGRjoDVXSsFCpJpwnb56qXDktbFsNqY1n/ihOJsPIGvdFpQ6+5sPFQrIikiF5nKZtc++z9pnsAETcrRvh//5W7NtTpDP2waBUuQ4dPbH0hOPuJ1ZAdsavUa9gzeQFosDAO1zPledK9UA0D5rHXz75uTmu9seftCDJwDRnoFSpFSgLFKKLv5e3vF08ruTyT0DQKpeqfWAwGByyi9VSPvG81j7vGmjs2ebBDTmF0IjQjIplCJHBWk3+OVyZltv98/jCi7Xn2P1AEbaFfG4GJuoxtvorg32hnU2JCFo0D4j5kJZsm+g+8BwGglG3CDqho9IUfc9se6NtVVmGETMLgAnGPop/fihLFjADSAWVWM9AAQYrtNyyGxTLFivfrLm+MUYMoCMSMviAKoTcdgkw+Kvv8/sPZxCipA2IGo+ewNAYvBXASRAGly9eQGBAMf8dcnZtb9jZEqinSGw5NQ1C+eOAJ/7TzhIZCCSoBhIQDEb9H3Rvvn1zpE5gru815jE2i4Q3SoxGjwddMbsrfe5lHBA6tQ5temd5LnLFjKAoJBzC4Wi36YeoUKZtbIwQ7AFXIJc4du0QUU1ixMSVNCMDEG0euZGWtOh4va9TVfP/gEMinKxZLwc7wAAAABJRU5ErkJggg==';

/**
 * Formatuje datum a cas
 */
function formatDateTime(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  return `${day}.${month}.${year} ${hour}:${minute}`;
}

/**
 * Generuje nazev souboru pro PDF
 */
function generateFileName() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  return `produkty-report-${year}-${month}-${day}-${hour}${minute}.pdf`;
}

/**
 * Exportuje statistiky do PDF
 */
export function exportStatsToPDF(detailedStats, fileName) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  const contentWidth = pageWidth - 2 * margin;
  let yPos = 20;

  // Helper pro pridani nove stranky pokud je potreba
  const checkPageBreak = (neededSpace = 30) => {
    if (yPos + neededSpace > 280) {
      doc.addPage();
      yPos = 20;
      return true;
    }
    return false;
  };

  // Helper pro text bez diakritiky
  const t = (text) => removeDiacritics(String(text));

  // === HLAVICKA ===
  // Logo
  try {
    doc.addImage(LOGO_BASE64, 'PNG', margin, yPos - 5, 12, 12);
  } catch {
    // Pokud logo selze, pokracujeme bez nej
  }

  // Nazev
  doc.setFontSize(18);
  doc.setTextColor(...COLORS.primary);
  doc.text(t('Report zpracovani produktu'), 32, yPos + 4);

  yPos += 18;

  // Datum a cas
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.textMuted);
  doc.text(t(`Vygenerovano: ${formatDateTime(new Date())}`), margin, yPos);

  if (fileName) {
    yPos += 5;
    doc.text(t(`Zdrojovy soubor: ${fileName}`), margin, yPos);
  }

  yPos += 12;

  // Oddelovaci cara
  doc.setDrawColor(...COLORS.lightGray);
  doc.setLineWidth(0.5);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 10;

  // === ZAKLADNI METRIKY ===
  doc.setFillColor(...COLORS.primary);
  doc.rect(margin, yPos, contentWidth, 8, 'F');
  doc.setFontSize(11);
  doc.setTextColor(...COLORS.white);
  doc.text(t('Zakladni metriky'), margin + 5, yPos + 5.5);
  yPos += 14;

  // Metriky - 2 sloupce
  doc.setFontSize(10);

  const metricsData = [
    [t('Zpracovanych produktu:'), String(detailedStats.totalProducts)],
    [t('Prumer souvisejicich:'), String(detailedStats.avgRelatedProducts)],
    [t('Prumer podobnych:'), String(detailedStats.avgAlternativeProducts)],
    [t('S plnym poctem (10) souvisejicich:'), `${detailedStats.fullRelatedPercent}%`],
    [t('S plnym poctem (10) podobnych:'), `${detailedStats.fullAlternativePercent}%`],
  ];

  metricsData.forEach((metric, index) => {
    const col = index % 2;
    const xOffset = margin + col * (contentWidth / 2);

    if (index % 2 === 0 && index > 0) {
      yPos += 7;
    }

    doc.setTextColor(...COLORS.textMuted);
    doc.text(metric[0], xOffset, yPos);

    doc.setTextColor(...COLORS.primary);
    doc.setFont(undefined, 'bold');
    doc.text(metric[1], xOffset + 55, yPos);
    doc.setFont(undefined, 'normal');
  });

  yPos += 12;

  // Varovani
  if (detailedStats.lowRelatedCount > 0 || detailedStats.lowAlternativeCount > 0) {
    const warningHeight = (detailedStats.lowRelatedCount > 0 && detailedStats.lowAlternativeCount > 0) ? 14 : 8;
    doc.setFillColor(...COLORS.warningBg);
    doc.rect(margin, yPos, contentWidth, warningHeight, 'F');
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.warning);

    let warningY = yPos + 5;
    if (detailedStats.lowRelatedCount > 0) {
      doc.text(t(`! ${detailedStats.lowRelatedCount} produktu ma mene nez 3 souvisejici`), margin + 5, warningY);
      warningY += 6;
    }
    if (detailedStats.lowAlternativeCount > 0) {
      doc.text(t(`! ${detailedStats.lowAlternativeCount} produktu ma mene nez 3 podobne`), margin + 5, warningY);
    }
    yPos += warningHeight + 6;
  }

  yPos += 5;
  checkPageBreak(50);

  // === ANALYZA KATEGORII ===
  if (detailedStats.categoryAnalysis && detailedStats.categoryAnalysis.length > 0) {
    doc.setFillColor(...COLORS.primary);
    doc.rect(margin, yPos, contentWidth, 8, 'F');
    doc.setFontSize(11);
    doc.setTextColor(...COLORS.white);
    doc.text(t('Analyza kategorii (TOP 5)'), margin + 5, yPos + 5.5);
    yPos += 14;

    // Hlavicka tabulky
    doc.setFillColor(...COLORS.lightGray);
    doc.rect(margin, yPos, contentWidth, 7, 'F');
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.text);
    doc.setFont(undefined, 'bold');
    doc.text(t('Kategorie'), margin + 3, yPos + 5);
    doc.text(t('Produktu'), margin + 95, yPos + 5);
    doc.text(t('Prumer'), margin + 125, yPos + 5);
    doc.text(t('Stav'), margin + 155, yPos + 5);
    doc.setFont(undefined, 'normal');
    yPos += 10;

    // Radky tabulky
    detailedStats.categoryAnalysis.forEach((cat, index) => {
      checkPageBreak(8);

      if (index % 2 === 1) {
        doc.setFillColor(249, 250, 251);
        doc.rect(margin, yPos - 4, contentWidth, 7, 'F');
      }

      doc.setFontSize(9);
      doc.setTextColor(...COLORS.text);

      // Zkratit nazev kategorie pokud je moc dlouhy
      let catName = t(cat.name);
      if (catName.length > 35) {
        catName = catName.substring(0, 32) + '...';
      }

      doc.text(catName, margin + 3, yPos);
      doc.text(String(cat.productCount), margin + 100, yPos);
      doc.text(String(cat.avgRelated), margin + 130, yPos);

      // Stav ikona - pouzijeme text misto unicode
      if (cat.avgRelated >= 7) {
        doc.setTextColor(...COLORS.success);
        doc.text('OK', margin + 155, yPos);
      } else if (cat.avgRelated < 5) {
        doc.setTextColor(...COLORS.warning);
        doc.text('!', margin + 158, yPos);
      } else {
        doc.setTextColor(...COLORS.textMuted);
        doc.text('-', margin + 158, yPos);
      }

      yPos += 7;
    });

    yPos += 8;
  }

  checkPageBreak(50);

  // === PROBLEMOVE OBLASTI ===
  const hasProblems = (detailedStats.smallCategories && detailedStats.smallCategories.length > 0) ||
                      detailedStats.productsWithoutCategoryText > 0 ||
                      (detailedStats.singleProductSubcategories && detailedStats.singleProductSubcategories.length > 0);

  if (hasProblems) {
    doc.setFillColor(...COLORS.primary);
    doc.rect(margin, yPos, contentWidth, 8, 'F');
    doc.setFontSize(11);
    doc.setTextColor(...COLORS.white);
    doc.text(t('Problemove oblasti'), margin + 5, yPos + 5.5);
    yPos += 14;

    // Male kategorie
    if (detailedStats.smallCategories && detailedStats.smallCategories.length > 0) {
      checkPageBreak(18);
      doc.setFillColor(...COLORS.warningBg);
      doc.rect(margin, yPos, contentWidth, 14, 'F');
      doc.setFontSize(9);
      doc.setTextColor(...COLORS.warning);
      doc.setFont(undefined, 'bold');
      doc.text(t('! Kategorie s mene nez 10 produkty:'), margin + 5, yPos + 5);
      doc.setFont(undefined, 'normal');

      doc.setFontSize(8);
      const catNames = detailedStats.smallCategories.map(c => `${t(c.name)} (${c.productCount})`).join(', ');
      const truncatedNames = catNames.length > 70 ? catNames.substring(0, 67) + '...' : catNames;
      doc.text(truncatedNames, margin + 5, yPos + 11);
      yPos += 18;
    }

    // Produkty bez categoryText
    if (detailedStats.productsWithoutCategoryText > 0) {
      checkPageBreak(12);
      doc.setFillColor(...COLORS.warningBg);
      doc.rect(margin, yPos, contentWidth, 8, 'F');
      doc.setFontSize(9);
      doc.setTextColor(...COLORS.warning);
      doc.text(t(`! ${detailedStats.productsWithoutCategoryText} produktu bez categoryText`), margin + 5, yPos + 5.5);
      yPos += 12;
    }

    // Podkategorie s 1 produktem
    if (detailedStats.singleProductSubcategories && detailedStats.singleProductSubcategories.length > 0) {
      checkPageBreak(18);
      doc.setFillColor(...COLORS.warningBg);
      doc.rect(margin, yPos, contentWidth, 14, 'F');
      doc.setFontSize(9);
      doc.setTextColor(...COLORS.warning);
      doc.setFont(undefined, 'bold');
      doc.text(t('! Podkategorie s pouze 1 produktem:'), margin + 5, yPos + 5);
      doc.setFont(undefined, 'normal');

      doc.setFontSize(8);
      const subNames = detailedStats.singleProductSubcategories.slice(0, 3).map(s => t(s)).join(', ');
      const truncatedSubs = subNames.length > 70 ? subNames.substring(0, 67) + '...' : subNames;
      doc.text(truncatedSubs, margin + 5, yPos + 11);
      yPos += 18;
    }
  }

  // === PATICKA ===
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.textMuted);
    doc.text(
      t(`Strana ${i} z ${totalPages} | Shoptet XLSX Processor | Systedo`),
      pageWidth / 2,
      290,
      { align: 'center' }
    );
  }

  // Ulozit PDF
  doc.save(generateFileName());
}
