import './global.css';
import HeaderWrapper from './HeaderWrapper';

export const metadata = {
  title: 'Travel Booking Website',
  description: 'Discover and book unique travel experiences with ease.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white min-h-screen text-gray-900">
        <HeaderWrapper />
        {children}
      </body>
    </html>
  );
}

