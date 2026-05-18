import { getServerSession } from "next-auth/next";
import { SiteHeaderChrome } from "@/components/site-header-chrome";
import { authOptions } from "@/lib/auth-options";

export async function SiteHeader() {
  const session = await getServerSession(authOptions);
  const isAuthenticated = Boolean(session?.user?.id);

  return <SiteHeaderChrome isAuthenticated={isAuthenticated} />;
}
