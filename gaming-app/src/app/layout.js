import "./globals.css";

export const metadata = {
  title: "GameZone",
  description: "Моят гейминг портал",
};

export default function RootLayout({ children }) {
  return (
    <html lang="bg">
      <body>
        {children}
        {/* Footer */}
        <footer className="text-center text-gray-500 mt-16 border-t border-gray-800 pt-6">
          🎮 GameZone | Създаден с Next.js
        </footer>
      </body>
    </html>
  );
}