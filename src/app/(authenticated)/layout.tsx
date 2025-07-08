import { AuthenticatedRoute } from "@/components/shared/auth/authenticated-route";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthenticatedRoute>{children}</AuthenticatedRoute>;
}
