"use client";

import { HomeLanguageModal } from "@/components/home/home-language-modal";
import { HomeLocaleProvider } from "@/components/home/home-locale-provider";
import { HomePageContent } from "@/components/home/home-page-content";

export function HomePageShell() {
  return (
    <HomeLocaleProvider>
      <HomeLanguageModal />
      <HomePageContent />
    </HomeLocaleProvider>
  );
}
