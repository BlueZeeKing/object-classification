import "./globals.css";

export const metadata = {
  title: "Object Classification",
  description: "Used by 9033 to train ML object detection models",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
