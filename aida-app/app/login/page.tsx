"use client";

import { LoginFeature } from "@/features/loginFeature";

export default function LoginPage() {
  const { username, password, setUsername, setPassword, handleLogin, error, loading } = LoginFeature();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Iniciar sesión</h1>

      <form onSubmit={handleLogin} className="flex flex-col w-64 space-y-3">
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="border p-2 rounded"
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="border p-2 rounded"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>

        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>

      <p className="text-sm mt-4">
        ¿Como no vas a tener una cuenta putete? createla ya mismo {" "}
        <a
          href="/register"
          className="text-blue-600 hover:underline"
        >
          Registrate
        </a>
      </p>
    </div>
  );
}
