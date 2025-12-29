export default async function AdminApplicationDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900">Application Details</h2>
      <p className="mt-2 text-gray-700">Placeholder details page for application:</p>

      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6">
        <p className="text-sm font-semibold text-gray-900">ID</p>
        <p className="mt-1 text-sm text-gray-800">{id}</p>
      </div>
    </div>
  );
}
