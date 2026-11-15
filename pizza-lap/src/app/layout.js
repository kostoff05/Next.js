import "./globals.css";

export const metadata = {
  title: "PizzaLab",
  description: "Най-вкусните пици в града",
};

export default function RootLayout({ children }) {
  return (
    <html lang="bg">
      <body>
        {children}
        <footer className="text-center text-gray-500 mt-16 border-t border-orange-200 pt-6">
          🍕 PizzaLab | Създаден с Next.js
        </footer>
      </body>
    </html>
  );
}