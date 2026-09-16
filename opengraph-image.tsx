import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "BDE Éco-Gestion Caen";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0b132b 0%, #1c2541 50%, #1e3a8a 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          position: "relative",
          padding: "40px",
        }}
      >
        {/* Cercles de flou en arrière-plan */}
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "15%",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "rgba(59, 130, 246, 0.25)",
            filter: "blur(80px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "10%",
            right: "15%",
            width: "250px",
            height: "250px",
            borderRadius: "50%",
            background: "rgba(245, 158, 11, 0.2)",
            filter: "blur(80px)",
          }}
        />

        {/* Badge supérieur */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            padding: "10px 24px",
            borderRadius: "9999px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            marginBottom: "30px",
          }}
        >
          <span style={{ fontSize: "28px" }}>🎓</span>
          <span
            style={{
              color: "#e2e8f0",
              fontSize: "20px",
              fontWeight: 600,
              letterSpacing: "1px",
            }}
          >
            UNIVERSITÉ DE CAEN NORMANDIE
          </span>
        </div>

        {/* Titre Principal */}
        <div
          style={{
            display: "flex",
            fontSize: "68px",
            fontWeight: 900,
            color: "#ffffff",
            textAlign: "center",
            letterSpacing: "-1px",
            marginBottom: "16px",
          }}
        >
          BDE ÉCO-GESTION
        </div>

        {/* Sous-titre */}
        <div
          style={{
            display: "flex",
            fontSize: "28px",
            color: "#93c5fd",
            textAlign: "center",
            maxWidth: "800px",
            marginBottom: "36px",
            fontWeight: 500,
          }}
        >
          Cours & Drives complets • Événements • Réductions
        </div>

        {/* Fausse pilule bouton */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#f59e0b",
            color: "#0b132b",
            padding: "14px 32px",
            borderRadius: "14px",
            fontSize: "22px",
            fontWeight: "bold",
            boxShadow: "0 10px 25px rgba(245, 158, 11, 0.3)",
          }}
        >
          Adhésions ouvertes 2026 - 2027 🚀
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}