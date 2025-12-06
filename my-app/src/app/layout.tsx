import "./globals.css";

export const metadata = {
  title: "Sistema",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>

      <body className="bg-gray-100 min-h-screen">{children}</body>
    </html>
  );
}
