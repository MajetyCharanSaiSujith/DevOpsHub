import './globals.css';
import { AppProvider } from '@/context/AppContext';
import AppLayout from '@/components/layout/AppLayout';

export const metadata = {
  title: 'DevOpsHub — Developer Collaboration Platform',
  description: 'Manage projects, track tasks, monitor team activity, visualize deployment status, and view GitHub repository information from one place.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans antialiased transition-colors duration-150">
        <AppProvider>
          <AppLayout>{children}</AppLayout>
        </AppProvider>
      </body>
    </html>
  );
}
