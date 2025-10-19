"use client";

import { useRegisterFeature } from "@/features/registerFeature";

export default function RegisterPage() {
  const {
    username,
    password,
    nombre,
    email,
    setUsername,
    setPassword,
    setNombre,
    setEmail,
    handleRegister,
    loading,
    error,
  } = useRegisterFeature();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Crear cuenta</h1>

      <form onSubmit={handleRegister} className="flex flex-col w-72 space-y-3">
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Nombre completo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
        >
          {loading ? "Creando..." : "Crear cuenta"}
        </button>

        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>

      <p className="text-sm mt-3">
        ¿Ya tenés una cuenta?{" "}
        <a href="/login" className="text-blue-600 underline">Iniciar sesión</a>
      </p>
    </div>
  );
}
