import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import { v4 as uuidv4 } from "uuid";

import path from "path";
import type { MoVidFile, MoVid } from "@/types/file";

const filePath = path.join(process.cwd(), "data", "data.txt");

async function readFile(): Promise<MoVidFile> {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    const json : MoVidFile= JSON.parse(data)
    return json;
  } catch (err: any) {
      throw err;
  }
}

async function writeFile(data: MoVidFile) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}


export async function GET() {
  try {
    const data = await readFile();
    return NextResponse.json(data);
  } catch (err) {
    console.error("GET error", err);
    return new NextResponse("Failed to read movids", { status: 500 });
  }
}

// create new movid 
export async function POST(req: Request) {
  try {
    const payload = (await req.json()) as Partial<MoVid> | MoVidFile;
    const file = await readFile();

    if ("movids" in payload) {
      // Entire file overwrite (used by your save button if you want)
      await writeFile(payload as MoVidFile);
      return NextResponse.json({ message: "Saved file" });
    }

    // Single new movid
    const incoming = payload as Partial<MoVid>;
    const newMoVid: MoVid = {
      id: uuidv4(),
      title: incoming.title ?? "Untitled MoVid",
      prompt: incoming.prompt ?? "",
      durationSeconds: incoming.durationSeconds ?? 30,
      resolution: (incoming.resolution as any) ?? "720p",
      generatedPreviewUrl: incoming.generatedPreviewUrl ?? "/placeholder-preview.png",
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      tags: incoming.tags ?? [],
      status: "placeholder",
    };

    file.movids.push(newMoVid);
    await writeFile(file);
    return NextResponse.json(newMoVid);
  } catch (err) {
    console.error("POST error", err);
    return new NextResponse("Failed to write movid", { status: 500 });
  }
}

// update an existing movid 
export async function PUT(req: Request) {
  try {
    const incoming = (await req.json()) as MoVid;
    const file = await readFile();
    const idx = file.movids.findIndex((m) => m.id === incoming.id);
    if (idx === -1) return new NextResponse("Not found", { status: 404 });
    incoming.lastModified = new Date().toISOString();
    file.movids[idx] = incoming;
    await writeFile(file);
    return NextResponse.json(incoming);
  } catch (err) {
    console.error("PUT error", err);
    return new NextResponse("Failed to update movid", { status: 500 });
  }
}

// delete an id via query .
export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) return new NextResponse("Missing id", { status: 400 });

    const file = await readFile();
    const newList = file.movids.filter((m) => m.id !== id);
    if (newList.length === file.movids.length) {
      return new NextResponse("Not found", { status: 404 });
    }
    file.movids = newList;
    await writeFile(file);
    return NextResponse.json({ message: "Deleted" });
  } catch (err) {
    console.error("DELETE error", err);
    return new NextResponse("Failed to delete", { status: 500 });
  }
}
