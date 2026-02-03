import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';
import { AuthProvider } from '../contexts/AuthContext';

export const metadata = {
  title: "Elementary & Secondary Report Card",
  description: "Student management system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
