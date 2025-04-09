import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { headers } from "next/headers";
import { registerVisit } from "~/collections/site/site-visit-actions";
import { Footer } from "~/components/footer";
import { Header } from "~/components/header";
import { Headers } from "~/components/headers";
import "~/styles/globals.css";

export const metadata: Metadata = {
  title: "PyszStudio - fotografia i film",
  description: "Fotografia i film na ślub, sesję zdjęciową, portret, zwierzęta, produkt, krajobraz",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const headersList = await headers();

  const ip = headersList.get('x-forwarded-for') ?? '';
  const userAgent = headersList.get('user-agent') ?? '';
  const referer = headersList.get('referer') ?? '';

  await registerVisit(ip, userAgent, referer);

  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <Headers />
        <Header />
        <span>
          {children}
        </span>
        <Footer />
      </body>
    </html>
  );
}
