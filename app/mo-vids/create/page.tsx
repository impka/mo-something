"use client";

import Link from "next/link";
import { useState } from "react";
import type { MoVid } from "@/types/file";

export default function MoVidsCreatePage() {
    const [title, setTitle] = useState("");
    const [prompt, setPrompt] = useState("");
    const [duration, setDuration] = useState<number>(30);
    const [resolution, setResolution] = useState<MoVid["resolution"]>("720p");

    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    function validate() {

        if (title.length == 0) {
            return "Title is required"
        };

        if (prompt.length == 0) {
            return "Prompt is required"
        };

        if (duration <= 0 || duration > 60) {
            return "Duration must be 1-60 seconds"
        };

        return null;
    }

    async function onSave() {
        setError(null);
        const valid = validate();

        if (valid) {
            setError(valid);
            return;
        }

        setSaving(true);

        try {
            const body = { title, prompt, durationSeconds: duration, resolution };
            
            const res = await fetch("/api/movids", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
      
        if (!res.ok) {
            throw new Error("Failed to save")
        }

        const saved = await res.json();
        alert("Saved, ID: " + saved.id);

        setTitle("");
        setPrompt("");

        } catch (err: any) {
            setError(err.message || "Save failed");
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4 text-center">Create a MoVid</h1>
            <div className="flex items-center justify-center text-moblue-500 hover:text-blue-900">
                <Link href="/mo-vids">Return Home</Link>
            </div>

            <div className="space-y-4">
                <label className="block">
                    <span className="text-sm font-medium">Title</span>
                    <input
                        className="mt-1 w-full border rounded p-2"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Short descriptive title"
                    />
                </label>

                <label className="block">
                    <span className="text-sm font-medium">Prompt / Description</span>
                    <textarea
                        className="mt-1 w-full border rounded p-2 h-28 font-mono"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Describe the video you want (this is a placeholder for AI prompt)"
                    />
                </label>

                <div className="flex items-center gap-4">
                    <label className="flex-1">
                            <span className="text-sm font-medium">Duration (seconds)</span>
                            <input
                            type="number"
                            min={1}
                            max={60}
                            value={duration}
                            onChange={(e) => setDuration(Number(e.target.value))}
                            className="mt-1 w-full border rounded p-2"
                            />
                    </label>

                    <label>
                        <span className="flex flex-col text-sm font-medium">Resolution</span>
                        <select
                        value={resolution}
                        onChange={(e) => setResolution(e.target.value as any)}
                        className="mt-1 border rounded p-2"
                        >
                            <option value="480p">480p</option>
                            <option value="720p">720p</option>
                            <option value="1080p">1080p</option>
                        </select>
                    </label>
                </div>

                {error && <div className="text-red-600">{error}</div>}

                <div className="flex gap-2">
                <button
                    onClick={onSave}
                    disabled={saving}
                    className="bg-moblue-500 hover:bg-blue-900 text-white px-4 py-2 rounded"
                >
                    {saving ? "Saving..." : "Save MoVid"}
                </button>
                <a href="/mo-vids/view" className="px-4 py-2 rounded border hover:bg-gray-300">View my movids</a>
                </div>
            </div>
        </div>
    );
}
