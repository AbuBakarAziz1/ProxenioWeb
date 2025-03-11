import Providers from "./providers";
import ToastAlert from "@/components/ToastAlert";
import "./globals.css";

export const metadata = {
  title: "Proxenio",
  description: "Proxenio Web App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ToastAlert />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
