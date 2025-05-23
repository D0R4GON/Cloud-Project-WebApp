import { Geist, Geist_Mono } from "next/font/google";
import "./css/globals.css";
import Auth from "./AuthClient";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "RentSpace",
  description: "Web app made in cloud made as an assignment of Cloud Systems",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Auth>
          {children}
        </Auth>
      </body>
    </html>
  );
}