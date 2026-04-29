import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { location, severity, hash, reporterName, date, description, ward } = body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(getMockComplaint(location, severity, reporterName));
    }

    const severityText = severity === "L3" ? "Critical" : severity === "L2" ? "Moderate" : "Minor";
    const deadlineDays = severity === "L3" ? 7 : severity === "L2" ? 15 : 30;

    const prompt = `Generate a formal RTI-style complaint letter in English for reporting a pothole to the Nagpur Municipal Corporation (NMC).

Details:
- Location: ${location || "Not specified"}
- Ward: ${ward || "Not specified"}
- Severity: ${severityText} (${severity})
- Date of Report: ${date || new Date().toLocaleDateString("en-IN")}
- Reporter Name: ${reporterName || "Citizen of Nagpur"}
- Description: ${description || "Pothole detected by AI on public road"}
- Evidence Hash (SHA-256): ${hash || "Not available"}

Requirements:
1. Use formal government complaint language
2. Reference Motor Vehicles Act, Section 3 of Indian Highway Act
3. Reference NMC's obligations under Maharashtra Municipal Corporation Act
4. Demand repair within ${deadlineDays} days based on severity
5. Mention that evidence has been digitally hashed for tamper-proof record
6. Include a request for acknowledgment within 48 hours
7. Format as a proper letter with date, subject, body, and signature
8. Keep it professional, 300-400 words
9. Do NOT include any markdown formatting — just plain text with line breaks`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    if (!response.ok) {
      console.error("Gemini error:", response.status);
      return NextResponse.json(getMockComplaint(location, severity, reporterName));
    }

    const data = await response.json();
    const complaintText =
      data.candidates?.[0]?.content?.parts?.[0]?.text || "Failed to generate complaint";

    const year = new Date().getFullYear();
    const complaintNumber = `NN-${year}-${Math.floor(10000 + Math.random() * 90000)}`;

    return NextResponse.json({
      complaintText,
      complaintNumber,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Complaint generation error:", error);
    return NextResponse.json(
      getMockComplaint("Nagpur", "L2", "Citizen"),
    );
  }
}

function getMockComplaint(location: string, severity: string, name: string) {
  const year = new Date().getFullYear();
  const complaintNumber = `NN-${year}-${Math.floor(10000 + Math.random() * 90000)}`;
  const today = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });

  return {
    complaintText: `Date: ${today}

To,
The Municipal Commissioner,
Nagpur Municipal Corporation (NMC),
Nagpur, Maharashtra — 440001

Subject: Formal Complaint Regarding Hazardous Pothole at ${location || "Nagpur"} — Severity: ${severity}

Respected Sir/Madam,

I, ${name || "a concerned citizen of Nagpur"}, hereby bring to your urgent attention a dangerous pothole located at ${location || "the above-mentioned location"} within the jurisdiction of Nagpur Municipal Corporation.

This pothole has been classified as ${severity === "L3" ? "CRITICAL (L3)" : severity === "L2" ? "MODERATE (L2)" : "MINOR (L1)"} severity by AI-powered infrastructure analysis. The evidence has been digitally hashed (SHA-256) to ensure tamper-proof documentation.

Under Section 3 of the Indian Highway Act and the Maharashtra Municipal Corporation Act, it is the statutory obligation of the NMC to maintain public roads in a safe and motorable condition. The current state of this road poses a serious threat to:

1. Public safety and lives of commuters
2. Vehicle damage leading to financial loss
3. Potential accidents, especially during monsoon season

As per the Motor Vehicles Act, the municipal authority bears liability for accidents caused by poorly maintained roads.

I hereby demand:
1. Immediate inspection of the reported pothole within 48 hours
2. Repair completion within ${severity === "L3" ? "7" : severity === "L2" ? "15" : "30"} days
3. Written acknowledgment of this complaint

This complaint is filed under the Right to Information Act, 2005, and I request a formal response within the stipulated timeframe.

Thanking you,
${name || "Concerned Citizen"}
Nagpur, Maharashtra

Complaint Reference: ${complaintNumber}
Platform: NagarNetra — AI Civic Accountability Platform`,
    complaintNumber,
    generatedAt: new Date().toISOString(),
    mock: true,
  };
}
