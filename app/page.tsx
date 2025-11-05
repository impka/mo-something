import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center font-sans">
      <Link className="" href="/mo-vids">
        Link to MoVids
      </Link>
    </div>
  );
}
