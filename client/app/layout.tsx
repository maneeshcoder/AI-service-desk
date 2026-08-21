import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Providers } from "./providers";


export default function RootLayout(
  { children }: LayoutProps<"/">) {
  return (
    <html
      lang="en" 
    >

      <body> 
        <Providers>
         <AuthProvider>{children}</AuthProvider> </Providers> </body>
    </html>
  );
}
