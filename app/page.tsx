import { redirect } from "next/navigation";

export default function RootPage() {
  // Hard redirect to your default locale
  redirect("/en");
}