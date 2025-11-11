export default function ErrorScreen({ error }: { error: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg shadow-md">
        <h2 className="font-bold text-lg mb-2">Error</h2>
        <p>{error}</p>
      </div>
    </div>
  );
}
