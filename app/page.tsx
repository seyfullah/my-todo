import Link from "next/link";

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <h1>Merhaba Dünya</h1>
      <p>
        <Link href="/todo" style={{ fontSize: "1.2rem", color: "#0070f3" }}>
          Go to Todo Page
        </Link>
      </p>
    </div>
  );
}