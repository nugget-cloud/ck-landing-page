import './globals.css';

export const metadata = {
  title: 'Culture Kitchen - AI-Powered Leadership Development Platform',
  description: 'Transform your organization\'s leadership capabilities with Culture Kitchen\'s intelligent platform that automates personalized learning programs and accelerates leadership growth at scale.',
  keywords: 'AI, Leadership Development, Corporate Training, Machine Learning, Leadership Programs',
  authors: [{ name: 'Culture Kitchen' }],
  openGraph: {
    title: 'Culture Kitchen - AI-Powered Leadership Development Platform',
    description: 'Transform your organization\'s leadership capabilities with Culture Kitchen\'s intelligent platform that automates personalized learning programs and accelerates leadership growth at scale.',
    type: 'website',
  },
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
