import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Image Generator",
  description: "Create stunning AI-generated images with advanced models and customization options.",
  keywords: ["AI", "image generation", "artificial intelligence", "art", "creative tools"],
  authors: [{ name: "AI Image Generator" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "AI Image Generator",
    description: "Create stunning AI-generated images with advanced models and customization options.",
    type: "website",
    images: [
      {
        url: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/d3218ba1-b7c8-4a4f-b14f-026bdb2b073e.png",
        width: 1200,
        height: 630,
        alt: "AI Image Generator App Creative Tool Interface"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Image Generator",
    description: "Create stunning AI-generated images with advanced models and customization options.",
    images: ["https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/bbb8f8a9-27e3-458c-9675-635049b99a8c.png"]
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
          <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">AI</span>
                  </div>
                  <h1 className="text-xl font-bold text-gray-900">Image Generator</h1>
                </div>
                <nav className="hidden md:flex items-center space-x-6">
                  <a href="#generator" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Generator
                  </a>
                  <a href="#gallery" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Gallery
                  </a>
                  <a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">
                    About
                  </a>
                </nav>
              </div>
            </div>
          </header>

          <main className="container mx-auto px-4 py-8">
            {children}
          </main>

          <footer className="border-t bg-white/50 backdrop-blur-sm mt-16">
            <div className="container mx-auto px-4 py-8">
              <div className="text-center text-gray-600">
                <p className="text-sm">
                  Create stunning AI-generated images with advanced models and customization options.
                </p>
                <p className="text-xs mt-2">
                  © 2024 AI Image Generator. Built with Next.js and modern AI technology.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}