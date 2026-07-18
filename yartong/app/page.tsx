import Link from "next/link";
import { ROUTES } from "@/lib/constants";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-green-700 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Yartong</h1>
        <div className="space-x-6">
          <Link href={ROUTES.home}>Home</Link>
          <Link href={ROUTES.workers}>Find Workers</Link>
          <Link href={ROUTES.quickJobs}>Quick Jobs</Link>
          <Link href={ROUTES.login}>Login</Link>
        </div>
      </nav>

      <section className="text-center py-20 px-6">
        <h2 className="text-5xl font-bold text-gray-900">
          Find Trusted Workers Near You
        </h2>

        <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
          Yartong connects customers with skilled tradespeople, labourers and
          local service providers in just a few clicks.
        </p>

        <div className="mt-10">
          <input
            type="text"
            placeholder="Search mason, plumber, carpenter, materials..."
            className="w-full max-w-2xl rounded-lg border p-4 text-lg"
          />
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-20">
        <h3 className="text-3xl font-bold mb-8">Popular Categories</h3>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {[
            "Mason",
            "Carpenter",
            "Electrician",
            "Plumber",
            "Painter",
            "Labour",
          ].map((item) => (
            <div
              key={item}
              className="rounded-xl bg-white shadow p-6 text-center font-semibold hover:shadow-lg transition"
            >
              {item}
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-gray-900 text-white text-center py-8">
        © 2026 Yartong. All rights reserved.
      </footer>
    </main>
  );
}
