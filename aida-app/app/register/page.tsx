"use client";

import { useRegisterFeature } from "@/features/registerFeature";

export default function RegisterPage() {
  const {
    username,
    password,
    nombre,
    email,
    esAlumno,
    esProfesor,
    setUsername,
    setPassword,
    setNombre,
    setEmail,
    setEsAlumno,
    setEsProfesor,
    handleRegister,
    loading,
    error,
  } = useRegisterFeature();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Crear cuenta</h1>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <input
              type="text"
              placeholder="Nombre completo"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Checkboxes de roles */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Selecciona tu rol:</label>
            
            <div className="flex items-center space-x-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={esAlumno}
                  onChange={(e) => setEsAlumno(e.target.checked)}
                  className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="ml-2 text-sm text-gray-700">Soy alumno</span>
              </label>
            </div>
            
            <div className="flex items-center space-x-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={esProfesor}
                  onChange={(e) => setEsProfesor(e.target.checked)}
                  className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="ml-2 text-sm text-gray-700">Soy profesor</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          ¿Ya tenés una cuenta?{" "}
          <a href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
            Iniciar sesión
          </a>
        </p>
      </div>
    </div>
  );
}
