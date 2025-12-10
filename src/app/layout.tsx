import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { Inter } from 'next/font/google'
import { FirebaseClientProvider } from '@/firebase';
import { Header } from '@/components/layout/header';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'Thread Weaver - A High-Performance Threading Simulator',
  description: 'An interactive dashboard to simulate and visualize the behavior of a multi-threaded application, demonstrating concepts like workload distribution, mutex locks, and thread synchronization.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        <FirebaseClientProvider>
          <div className="flex min-h-screen w-full flex-col bg-background">
            <Header />
            {children}
          </div>
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
