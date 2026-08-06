import type { Metadata } from "next";
import { Be_Vietnam_Pro, Roboto } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const beVietnamPro = Be_Vietnam_Pro({
	subsets: ["latin", "vietnamese"],
	weight: ["400", "600", "700"],
	variable: "--font-be-vietnam-pro",
});

const roboto = Roboto({
	subsets: ["latin", "vietnamese"],
	weight: ["400", "500", "700"],
	variable: "--font-roboto",
});


export const metadata: Metadata = {
	title: "IELTS by Phanh",
	description: "",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en" className={`${beVietnamPro.variable} ${roboto.variable} h-full antialiased`}>
			<body className="min-h-screen flex flex-col">
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
