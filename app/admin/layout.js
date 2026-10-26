import "./admin.css";

export const metadata = {
  title: "Orilla admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  return (
    <html lang="en">
      <body className="admin">{children}</body>
    </html>
  );
}
