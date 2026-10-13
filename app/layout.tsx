import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Security Testing — Service Selector (Demo)",
  description:
    "Demo dashboard: analyze a target and get a recommended authorized security-testing service. All data is dummy.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t);}}catch(e){}})();",
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
