"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { MoVid } from "@/types/file";

export default function MoVidsView() {
  const [movids, setMoVids] = useState<MoVid[]>([]);
  const [view, setView] = useState<"grid" | "table">("grid");
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);

  async function fetchList() {
    setLoading(true);
    try {
      const res = await fetch("/api/movids");
      const data = await res.json();
      setMoVids(data.movids || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchList();
  }, []);

  async function onDelete(id: string) {
    if (!confirm("Delete this movid?")) return;
    const res = await fetch(`/api/movids?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setMoVids((m) => m.filter((x) => x.id !== id));
    } else {
      alert("Delete failed");
    }
  }

  async function onUpdate(updated: MoVid) {
    const res = await fetch("/api/movids", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    if (res.ok) {
      const v = await res.json();
      setMoVids((m) => m.map((it) => (it.id === v.id ? v : it)));
    } else {
      alert("Update failed");
    }
  }

  const filtered = movids.filter((m) => m.title.toLowerCase().includes(filter.toLowerCase()) || (m.tags || []).some(t => t.includes(filter)));

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <Link href="/mo-vids" className="text-xl font-bold text-moblue-500 hover:text-blue-800">Back Home</Link>
        <div className="flex gap-2">
          <input className="border p-2 rounded" placeholder="Filter by title or tag" value={filter} onChange={(e)=>setFilter(e.target.value)} />
          <button onClick={()=>setView(view => view=="grid"?"table":"grid")} className="border px-3 py-2 rounded hover:bg-gray-300">
            {view === "grid" ? "Table" : "Grid"}
          </button>
        </div>
      </div>

      {loading ? <p>Loading...</p> : (
        view === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(m => (
              <div key={m.id} className="border rounded p-3 flex flex-col">
                <img src={m.generatedPreviewUrl} alt={m.title} className="h-36 w-full object-cover rounded mb-2" />
                <h2 className="font-semibold">{m.title}</h2>
                <p className="text-sm text-gray-600">{m.prompt}</p>
                <div className="mt-2 flex justify-between items-center">
                  <div className="text-xs text-gray-500">{m.resolution} • {m.durationSeconds}s</div>
                  <div className="flex gap-2">
                    <button onClick={() => {
                      const newTitle = prompt("New title", m.title) ?? m.title;
                      onUpdate({ ...m, title: newTitle });
                    }} className="text-sm px-2 py-1 border rounded hover:bg-gray-300">Edit</button>
                    <button onClick={() => onDelete(m.id)} className="text-sm px-2 py-1 border rounded text-red-600 hover:bg-red-100">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Title</th>
                <th className="p-2 text-left">Prompt</th>
                <th className="p-2">Duration</th>
                <th className="p-2">Resolution</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(m => (
                <tr key={m.id} className="border-t">
                  <td className="p-2">{m.title}</td>
                  <td className="p-2 text-sm text-gray-600 truncate max-w-xs">{m.prompt}</td>
                  <td className="p-2 text-center">{m.durationSeconds}s</td>
                  <td className="p-2 text-center">{m.resolution}</td>
                  <td className="p-2 text-center">
                    <button onClick={() => {
                      const newTitle = prompt("New title", m.title) ?? m.title;
                      onUpdate({ ...m, title: newTitle });
                    }} className="mr-2 hover:text-gray-500">Edit</button>
                    <button onClick={() => onDelete(m.id)} className="text-red-600 hover:text-red-800">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}
    </div>
  );
}
