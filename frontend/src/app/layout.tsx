import type { Metadata } from 'next';
import { Cormorant_Garamond, Plus_Jakarta_Sans, DM_Sans } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { RoleProvider } from '@/components/role-context';
import { RouteGuard } from '@/components/route-guard';
import { EcoRedirectionModal } from '@/components/ui/eco-redirection-modal';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-serif',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
});

export const metadata: Metadata = {
  title: 'EcoHaven — A Cultural Ecotourism Journal & Sanctuaries',
  description:
    'Handcrafted travel stories, off-grid mangrove retreats, and sacred cloud forest stays operating within ecological carrying limits.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${jakarta.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1C242B]">
        <RoleProvider>
          <RouteGuard>
            <Navbar />
            <main className="flex-1">{children}</main>
            <EcoRedirectionModal />
            <Footer />
          </RouteGuard>
        </RoleProvider>
      </body>
    </html>
  );
}
