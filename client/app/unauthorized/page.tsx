export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-2 text-center px-4">
      <h1 className="text-xl font-semibold text-slate-900">Access denied</h1>
      <p className="text-sm text-slate-500">You don't have permission to view this page.</p>
      <a href="/" className="text-sm text-indigo-600 hover:underline mt-2">
        Go back home
      </a>
    </div>
  );
}