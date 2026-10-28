/**
 * Helper utility to sanitize cloned DOM elements and styles for html2canvas.
 * Prevents "Error: Attempting to parse an unsupported color function oklch" when rendering PDFs.
 */
export const sanitizeClonedDocForCanvas = (clonedDoc: Document) => {
  try {
    // 1. Sanitize all <style> tags
    const styleElements = clonedDoc.querySelectorAll('style');
    styleElements.forEach((style) => {
      if (style.innerHTML) {
        style.innerHTML = style.innerHTML.replace(
          /oklch\([^)]+\)|oklab\([^)]+\)|color-mix\([^)]+\)|light-dark\([^)]+\)/gi,
          '#1e293b'
        );
      }
    });

    // 2. Sanitize inline style attributes on all DOM elements
    const allElements = clonedDoc.querySelectorAll('*');
    allElements.forEach((el) => {
      const htmlEl = el as HTMLElement;
      if (htmlEl.getAttribute) {
        const styleAttr = htmlEl.getAttribute('style');
        if (
          styleAttr &&
          (styleAttr.toLowerCase().includes('oklch') ||
            styleAttr.toLowerCase().includes('color-mix') ||
            styleAttr.toLowerCase().includes('oklab'))
        ) {
          htmlEl.setAttribute(
            'style',
            styleAttr.replace(
              /oklch\([^)]+\)|oklab\([^)]+\)|color-mix\([^)]+\)|light-dark\([^)]+\)/gi,
              '#1e293b'
            )
          );
        }
      }
    });
  } catch (err) {
    console.warn('Aviso ao sanitizar cores oklch para PDF:', err);
  }
};
