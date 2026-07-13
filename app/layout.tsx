import type { Metadata } from "next";
import { Manrope, Newsreader } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const newsreader = Newsreader({
	subsets: ["latin", "vietnamese"],
	variable: "--font-newsreader",
});
  
const manrope = Manrope({
	subsets: ["latin", "vietnamese"],
	variable: "--font-manrope",
});

export const metadata: Metadata = {
	title: "IELTS Startup",
	description: "",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en" className={`${newsreader.variable} ${manrope.variable} h-full antialiased`}>
			<body className="bg-cream min-h-screen flex flex-col">
				<Providers>
					<Header/>

					<div className="flex-1 flex flex-col">
						{children}
					</div>

					<Footer/>
				</Providers>
			</body>
		</html>
	);
}
