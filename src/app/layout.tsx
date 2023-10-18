import './globals.css';
import type { Metadata } from 'next';
import { Inter, Poppins, Roboto_Slab, Nunito } from 'next/font/google';
import TopHeadPage from '@/components/TopHead';
import { Providers } from './providers';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { AppContextProvider } from '@/context/contextConfig';
import StyledComponentsRegistry from '../lib/AntdRegistry';
const poppins = Poppins({ subsets: ['latin'], weight: '400' });
const inter = Inter({ subsets: ['latin'] });
const robotoSlab = Roboto_Slab({ subsets: ['latin'] });
const nunito = Nunito({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Putaxa - Art Toys',
  description: 'Shop Art toys, blind box',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <head>
        <link
          rel='icon'
          href='/assets/header/logoMetadata.png'
        />
      </head>
      <body
        className={nunito.className}
        suppressHydrationWarning>
        <Providers>
          <AppContextProvider>
            <TopHeadPage />
            <StyledComponentsRegistry>
              <div className=''>{children}</div>
            </StyledComponentsRegistry>
          </AppContextProvider>
        </Providers>
      </body>
    </html>
  );
}
