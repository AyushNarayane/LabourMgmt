import { NextRequest, NextResponse } from "next/server";
import { mockJobs, mockSchemes } from "@/lib/mockData";

// POST /api/sms/commands
// Handles incoming SMS commands from feature-phone workers.
// This would be hooked up as a Twilio webhook in production.
// Commands: JOBS [district] [skill], CARD, SCHEMES, STATUS [job_id], HELP

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { from, body: smsBody } = body;
    const parts = (smsBody || "").toUpperCase().trim().split(/\s+/);
    const command = parts[0];

    let reply = "";

    switch (command) {
      case "JOBS": {
        const skill = parts[2] || null;
        const matched = mockJobs
          .filter(j => j.status === "open")
          .filter(j => !skill || j.skillsRequired.some(s => s.toUpperCase() === skill))
          .slice(0, 3);

        if (matched.length === 0) {
          reply = "No matching jobs found. Try: JOBS SURAT MASON";
        } else {
          reply = matched.map((j, i) =>
            `${i + 1}. ${j.title} - ${j.distanceKm}km, Rs.${j.wagePerDay}/day, ${j.durationDays}d`
          ).join("\n");
        }
        break;
      }

      case "CARD":
        reply = "Your Digital Labour Card: https://shramiksetu.in/card/worker-1001\nShow this link to verify your identity.";
        break;

      case "SCHEMES": {
        const eligible = mockSchemes.filter(s => s.isEligible).slice(0, 3);
        reply = eligible.map((s, i) =>
          `${i + 1}. ${s.title} - ${s.benefit}`
        ).join("\n");
        break;
      }

      case "STATUS": {
        const jobId = parts[1] ? `job-${parts[1]}` : null;
        const job = jobId ? mockJobs.find(j => j.id === jobId) : null;
        reply = job
          ? `Job: ${job.title}\nStatus: ${job.status}\nWage: Rs.${job.wagePerDay}/day`
          : "Job not found. Example: STATUS 1";
        break;
      }

      case "HELP":
      default:
        reply = [
          "Shramik Setu SMS Commands:",
          "JOBS [district] [skill] - Find jobs",
          "CARD - Get your digital card link",
          "SCHEMES - Top 3 govt schemes",
          "STATUS [job_id] - Check job status",
          "HELP - Show this message"
        ].join("\n");
        break;
    }

    console.log(`[SMS IN] From: ${from}, Command: ${command}`);
    console.log(`[SMS OUT] ${reply}`);

    return NextResponse.json({
      success: true,
      from,
      command,
      reply,
    });
  } catch (error) {
    console.error("SMS Command error:", error);
    return NextResponse.json({ error: "Failed to process SMS" }, { status: 500 });
  }
}
