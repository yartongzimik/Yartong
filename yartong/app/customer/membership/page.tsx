const pageTitle = "Customer / Membership";
const routePath = "/customer/membership";

export default function PlaceholderPage() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-16">
      <p className="text-sm font-semibold uppercase tracking-wide text-green-700">
        Yartong milestone 0 placeholder
      </p>
      <h1 className="mt-3 text-3xl font-bold text-gray-950">{pageTitle}</h1>
      <p className="mt-4 max-w-2xl text-gray-600">
        The {routePath} route is reserved for a future Yartong workflow.
        Product features for this page have not been implemented yet.
      </p>
    </main>
  );
}
