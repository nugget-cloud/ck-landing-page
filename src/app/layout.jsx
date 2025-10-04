import './globals.css';

export const metadata = {
  title: 'Space Port - NASA Exoplanet Data Pipeline Documentation',
  description: 'Simplify NASA exoplanet data access with Space Port. Build queries, access TAP services, and migrate astronomical data with just a few lines of code. Transform thousands of lines into elegant solutions.',
  keywords: 'NASA, Exoplanet, Data Pipeline, TAP, ADQL, Query Builder, Astronomy, Space Data, DuckDB',
  authors: [{ name: 'Space Port' }],
  openGraph: {
    title: 'Space Port - NASA Exoplanet Data Pipeline Documentation',
    description: 'Simplify NASA exoplanet data access with Space Port. Build queries, access TAP services, and migrate astronomical data with just a few lines of code.',
    type: 'website',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=JetBrains+Mono:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased font-inter bg-black text-white overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
