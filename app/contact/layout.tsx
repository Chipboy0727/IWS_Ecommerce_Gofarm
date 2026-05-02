import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Contact Us | gofarm",
  description: "Get in touch with the GoFarm team for support, questions, or feedback.",
};

export default function ContactLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
