import { AntdRegistry } from "@ant-design/nextjs-registry";
import type { Metadata } from "next";
import { ThemeProvider } from "./ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
    title: "Wordle",
    description: "Guess the hidden word in six tries.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
    return (
        <html lang="en" className="h-full">
            <body className="min-h-full">
                <AntdRegistry>
                    <ThemeProvider>{children}</ThemeProvider>
                </AntdRegistry>
            </body>
        </html>
    );
}
