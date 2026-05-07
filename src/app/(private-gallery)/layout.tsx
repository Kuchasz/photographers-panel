import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { Hanken_Grotesk, Oranienbaum } from "next/font/google";
import "~/styles/globals.css";

const hankenGrotesk = Hanken_Grotesk({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-hanken-grotesk',
});

const oranienbaum = Oranienbaum({
    weight: ['400'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-oranienbaum',
});

export const metadata: Metadata = {
    title: "PyszStudio - fotografia i film",
    description: "Fotografia i film na ślub, sesję zdjęciową, portret, zwierzęta, produkt, krajobraz",
    icons: [{ rel: "icon", url: "/favicon.ico" }],
    viewport: {
        width: 'device-width',
        initialScale: 1,
        maximumScale: 1,
        userScalable: false,
    },
};

export default async function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {

    return (
        <html lang="en" className={`${GeistSans.variable} ${hankenGrotesk.variable} ${oranienbaum.variable}`}>
            <body>
                {children}
            </body>
        </html>
    );
}
