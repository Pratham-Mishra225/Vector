/**
 * Design System Tokens - Nova Preset
 * Style: Sharp, High-Contrast, Geist-Powered
 */

export const colors = {
  // Nova uses a sharp indigo and deep zincs
  primary: "indigo-600",
  primaryForeground: "white",
  
  // Nova specific backgrounds (Geist aesthetic)
  bg: "bg-background",
  surface: "bg-card",
  
  text: "text-foreground",
  muted: "text-muted-foreground",
  border: "border-border",
};

export const spacing = {
  // Nova favors precise, tighter padding
  pagePadding: "px-6 md:px-12",
  container: "max-w-6xl mx-auto", // Slightly tighter container for readability
  
  sectionGap: "space-y-8", 
  elementGap: "space-y-3",
  
  cardPadding: "p-5", // Sharp, consistent padding
};

export const typography = {
  // Nova uses Geist Sans, which looks best with tighter tracking
  title: "text-2xl md:text-4xl font-bold tracking-tighter leading-none",
  subtitle: "text-lg md:text-xl font-normal text-muted-foreground tracking-tight",
  
  // Body is optimized for Geist Mono or Sans
  body: "text-base leading-7 antialiased",
  caption: "font-mono text-xs uppercase tracking-wider text-muted-foreground",
};

export const layout = {
  // High-end tech feel: Subtle borders and slight shadows
  pageWrapper: `${colors.bg} ${colors.text} ${spacing.pagePadding} min-h-screen py-12`,
  cardWrapper: `${colors.surface} ${spacing.cardPadding} rounded-md border ${colors.border} backdrop-blur-sm`,
};