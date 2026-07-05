import { login } from "../actions";
import { SubmitButton } from "@/components/SubmitButton";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-sm flex-1 flex-col justify-center px-4">
      <h1 className="mb-6 text-center text-2xl font-bold text-white">
        Ingreso Admin
      </h1>
      {error && (
        <p className="mb-4 rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-400">
          {error}
        </p>
      )}
      <form action={login} className="flex flex-col gap-4">
        <input
          name="email"
          type="email"
          required
          placeholder="Email"
          className="rounded-lg border border-white/10 bg-[#101a2c] px-4 py-2 text-white placeholder:text-neutral-500 focus:border-[#c9a961] focus:outline-none"
        />
        <input
          name="password"
          type="password"
          required
          placeholder="Contraseña"
          className="rounded-lg border border-white/10 bg-[#101a2c] px-4 py-2 text-white placeholder:text-neutral-500 focus:border-[#c9a961] focus:outline-none"
        />
        <SubmitButton
          pendingText="Entrando..."
          className="rounded-lg bg-[#c9a961] px-4 py-2 font-semibold text-[#0b1220] transition-colors hover:bg-[#d9bd7e]"
        >
          Entrar
        </SubmitButton>
      </form>
    </main>
  );
}
