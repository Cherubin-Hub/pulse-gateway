import { redirect } from "next/navigation";

export default function RootPage() {
  // Automatically redirect visitors from root (http://localhost:3000) to the Login screen
  redirect("/login");
}
