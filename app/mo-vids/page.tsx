import Link from "next/link";

export default function Homepage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold">Mo<span className="text-moblue-500">Vids</span></h1>
        <nav className="space-x-3">
          <Link href="/mo-vids/create" className="px-3 py-2 bg-moblue-500 text-white rounded hover:bg-blue-800">Create</Link>
          <Link href="/mo-vids/view" className="px-3 py-2 border rounded hover:bg-gray-300">My Movids</Link>
        </nav>
      </header>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">Activity</h2>
        <div className="mt-3 border rounded p-4">
          <ul className="list-disc ml-5">
            <li>Placeholder: "Promo Teaser" created — Jan 1, 2025</li>
            <li>Placeholder: "Social Square" completed — Jan 2, 2025</li>
          </ul>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Key insights</h2>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="border rounded p-4">
            <div className="text-sm font-medium">Total Movids</div>
            <div className="text-2xl font-bold">4</div>
          </div>
          <div className="border rounded p-4">
            <div className="text-sm font-medium">Avg Duration</div>
            <div className="text-2xl font-bold">18s</div>
          </div>
        </div>
      </section>
    </div>
  );
}
