export default function LoadingScreen({ mensaje }: { mensaje: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="text-xl font-semibold text-gray-700">
        {mensaje}
      </div>
      <div className="mt-4 border-4 border-blue-600 border-t-transparent rounded-full w-12 h-12 animate-spin"></div>
    </div>
  );
}
