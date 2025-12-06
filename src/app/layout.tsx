import "@/styles/globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <style>
        @import
        url('https://fonts.googleapis.com/css2?family=Barriecito&display=swap');
      </style>
      <body>{children}</body>
    </html>
  );
}
