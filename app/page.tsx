import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function RootPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("pulse_gateway_user")?.value;

  if (sessionCookie) {
    redirect("/portal");
  } else {
    redirect("/login");
  }
}
