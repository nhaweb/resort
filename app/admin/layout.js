import "./admin.css";

export const metadata = {
  title: "PML Privilege Resort admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  return (
    <html lang="en">
      <body className="admin">{children}</body>
    </html>
  );
}
