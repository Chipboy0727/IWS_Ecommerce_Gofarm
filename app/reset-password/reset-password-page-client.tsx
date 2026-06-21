import ResetPasswordForm from "./reset-password-form";

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const emailParam = searchParams?.email;
  const tokenParam = searchParams?.token;
  const initialEmail = Array.isArray(emailParam) ? emailParam[0] ?? "" : emailParam ?? "";
  const initialToken = Array.isArray(tokenParam) ? tokenParam[0] ?? "" : tokenParam ?? "";

  return <ResetPasswordForm initialEmail={initialEmail} initialToken={initialToken} />;
}
