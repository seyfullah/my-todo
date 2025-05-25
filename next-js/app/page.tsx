import Link from "next/link";

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <h1>Merhaba Dünya</h1>
      <p>
        <a href="/todo.html" style={{ fontSize: "1.2rem", color: "#0070f3", marginRight: 16 }}>
          Yapılacaklar (HTML) sayfasına git
        </a>
        <Link href="/todo" style={{ fontSize: "1.2rem", color: "#0070f3" }}>
          Yapılacaklar (Next.js) sayfasına git
        </Link>
      </p>
    </div>
  );
}