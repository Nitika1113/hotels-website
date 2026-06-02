export default function Loading() {
  return (
    <section className="mx-auto max-w-7xl p-8">
      <div className="h-125 animate-pulse rounded-3xl bg-gray-200" />

      <div className="mt-8 space-y-4">
        <div className="h-12 w-96 animate-pulse rounded bg-gray-200" />

        <div className="h-6 w-64 animate-pulse rounded bg-gray-200" />

        <div className="h-24 animate-pulse rounded bg-gray-200" />
      </div>
    </section>
  );
}