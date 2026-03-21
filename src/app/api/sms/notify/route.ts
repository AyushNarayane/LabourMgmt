import { NextRequest, NextResponse } from "next/server";

// POST /api/sms/notify
// Sends an SMS notification to a matched worker when a new job is posted.
// In production, this would use Twilio. For the MVP demo, we mock the response.

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { workerPhone, jobTitle, distance, wage, duration } = body;

    if (!workerPhone || !jobTitle) {
      return NextResponse.json(
        { error: "workerPhone and jobTitle are required." },
        { status: 400 }
      );
    }

    // In hackathon demo: mock the Twilio response
    // In production: uncomment the Twilio block below
    /*
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;
    const client = require('twilio')(accountSid, authToken);

    const message = await client.messages.create({
      body: `Shramik Setu: New job! ${jobTitle}, ${distance}km away, ₹${wage}/day, ${duration} days. Reply ACCEPT to apply.`,
      from: fromNumber,
      to: workerPhone,
    });

    return NextResponse.json({ success: true, sid: message.sid });
    */

    // --- MOCK RESPONSE FOR DEMO ---
    const mockSmsBody = `Shramik Setu: New job! ${jobTitle}, ${distance || "?"}km away, ₹${wage || "?"}/day, ${duration || "?"} days. Reply ACCEPT to apply.`;

    console.log(`[MOCK SMS] To: ${workerPhone}`);
    console.log(`[MOCK SMS] Body: ${mockSmsBody}`);

    return NextResponse.json({
      success: true,
      mock: true,
      sid: `MOCK_${Date.now()}`,
      preview: mockSmsBody,
    });
  } catch (error) {
    console.error("SMS API error:", error);
    return NextResponse.json({ error: "Failed to send SMS" }, { status: 500 });
  }
}
