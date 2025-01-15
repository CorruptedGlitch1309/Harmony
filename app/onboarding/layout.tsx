import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

async function layout({ children }: Readonly<{ children: React.ReactNode }>) {
  if ((await auth()).sessionClaims?.metadata.onboardingComplete === true) {
    redirect("/");
  }

  return <>{children}</>;
}

export default layout;
