import type { NextConfig } from "next";

/**
 * Ρυθμίσεις Next.js για το Portal του EAP-Vibe Radio.
 * 
 * Σκοπός: Διαμόρφωση για static export (GitHub Pages).
 * Υποθέσεις: Το deployment γίνεται σε περιβάλλον χωρίς Node.js server.
 */
const nextConfig: NextConfig = {
  /* Ενεργοποίηση του React Compiler για βελτιστοποίηση επιδόσεων */
  reactCompiler: true,
  
  /* 
   * Ορίζουμε το output σε 'export' για να παραχθούν στατικά αρχεία HTML/CSS/JS.
   * Απαραίτητο για φιλοξενία στο GitHub Pages.
   */
  output: "export",

  /* 
   * Απενεργοποίηση του Image Optimization καθώς το GitHub Pages δεν υποστηρίζει 
   * το default optimization του Next.js (απαιτεί server-side logic).
   */
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
