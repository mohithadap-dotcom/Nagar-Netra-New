import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { potholeId, afterImage } = await request.json();

    if (!afterImage) {
      return NextResponse.json(
        { error: "No after image provided" },
        { status: 400 }
      );
    }

    const apiKey = process.env.ROBOFLOW_API_KEY;

    if (apiKey) {
      try {
        const response = await fetch(
          `https://serverless.roboflow.com/pothole-detection-lzbpk/2?api_key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: afterImage,
          }
        );

        if (response.ok) {
          const data = await response.json();
          const hasPothole =
            data.predictions && data.predictions.length > 0;
          const topConfidence = hasPothole
            ? Math.max(...data.predictions.map((p: { confidence: number }) => p.confidence))
            : 0;

          let result: "approved" | "rejected" | "partial";
          if (!hasPothole || topConfidence < 0.3) {
            result = "approved";
          } else if (topConfidence < 0.6) {
            result = "partial";
          } else {
            result = "rejected";
          }

          return NextResponse.json({
            potholeId,
            verified: result === "approved",
            confidence: hasPothole ? topConfidence : 0,
            result,
            message:
              result === "approved"
                ? "Repair verified ✅ — Pothole no longer detected"
                : result === "partial"
                ? "Partial repair detected — Reinspection required"
                : "Repair rejected ❌ — Pothole still present",
          });
        }
      } catch (error) {
        console.error("Roboflow verify error:", error);
      }
    }

    // Mock fallback
    const mockResults = ["approved", "rejected", "partial"] as const;
    const result = mockResults[Math.floor(Math.random() * 3)];

    return NextResponse.json({
      potholeId,
      verified: result === "approved",
      confidence: result === "approved" ? 0.15 : result === "partial" ? 0.45 : 0.82,
      result,
      message:
        result === "approved"
          ? "Repair verified ✅ — Pothole no longer detected"
          : result === "partial"
          ? "Partial repair detected — Reinspection required"
          : "Repair rejected ❌ — Pothole still present",
      mock: true,
    });
  } catch (error) {
    console.error("Verify error:", error);
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}
