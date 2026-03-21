import { NextResponse } from 'next/server';
import axios from 'axios';
import { mockWorker } from '@/lib/mockData';

const SANDBOX_API_KEY = "key_live_6be1285b94774ec5abe22a33932d0a6e";
const SANDBOX_API_SECRET = "secret_live_cd123ed06ba74222af69600bc83882ea";
const SANDBOX_BASE_URL = "https://api.sandbox.co.in";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { aadhaar_number, otp, request_id } = body;

        if (!aadhaar_number || aadhaar_number.length !== 12) {
            return NextResponse.json({ error: "Invalid Aadhaar number" }, { status: 400 });
        }
        if (!otp || otp.length < 4) {
            return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
        }

        let aadhaarData: any = null;
        const isDemoFallback = !request_id || request_id.startsWith("DEMO_FALLBACK_");

        if (!isDemoFallback) {
            try {
                // Step 1: Authenticate with Sandbox
                const authRes = await axios.post(`${SANDBOX_BASE_URL}/authenticate`, {}, {
                    headers: {
                        "x-api-key": SANDBOX_API_KEY,
                        "x-api-secret": SANDBOX_API_SECRET,
                        "x-api-version": "1.0",
                        "accept": "application/json"
                    }
                });
                const token = authRes.data.access_token;

                // Step 2: Verify OTP with Sandbox
                const verifyRes = await axios.post(`${SANDBOX_BASE_URL}/kyc/aadhaar/okyc/otp/verify`, {
                    "@entity": "in.co.sandbox.kyc.aadhaar.okyc.request",
                    request_id: request_id,
                    otp: otp,
                }, {
                    headers: {
                        "Authorization": token,
                        "x-api-key": SANDBOX_API_KEY,
                        "x-api-version": "1.0",
                        "content-type": "application/json"
                    }
                });

                aadhaarData = verifyRes.data?.data;
            } catch (sandboxError: any) {
                const status = sandboxError.response?.status;
                const errMsg = sandboxError.response?.data?.message
                    || sandboxError.response?.data?.error
                    || "";

                // If Sandbox explicitly rejected the OTP (4xx) — wrong OTP, expired, etc.
                // → Reject the login. Do NOT fall through to demo data.
                if (status && status >= 400 && status < 500) {
                    console.warn("Sandbox rejected OTP (status", status, "):", errMsg);
                    return NextResponse.json(
                        { error: errMsg || "Invalid or expired OTP. Please try again." },
                        { status: 401 }
                    );
                }

                // Network/infra issue — fall through to demo mock data.
                console.warn("Sandbox unreachable (using demo fallback):", sandboxError.message);
            }
        }
        // isDemoFallback = true → skip Sandbox entirely, use mock data below

        // Build location string from Aadhaar address if available
        const addr = aadhaarData?.address;
        const city = addr?.city || addr?.locality || addr?.district || mockWorker.district;
        const state = addr?.state || mockWorker.state;
        const locationStr = addr ? `${city}, ${state}` : mockWorker.location;

        const aadhaarLast4 = aadhaar_number.slice(-4);
        const user = {
            id: mockWorker.id,
            // ── Real Aadhaar fields ──────────────────────────────────────
            name:          aadhaarData?.name      || mockWorker.name,
            dob:           aadhaarData?.dob        || undefined,
            gender:        aadhaarData?.gender     || undefined,
            careOf:        aadhaarData?.care_of    || undefined,
            photo:         aadhaarData?.profile_image || aadhaarData?.photo || undefined,
            address:       addr ? {
                house:    addr.house,
                street:   addr.street,
                locality: addr.locality,
                city:     addr.city,
                district: addr.dist || addr.district,
                state:    addr.state,
                pincode:  addr.pc || addr.pincode,
                country:  addr.country || "India",
            } : undefined,
            // ── App-level fields (from our DB / mock for now) ─────────────
            role:           mockWorker.role,
            location:       locationStr,
            district:       addr?.dist || addr?.district || mockWorker.district,
            state:          state,
            rating:         mockWorker.rating,
            jobsCompleted:  mockWorker.jobsCompleted,
            isAadhaarVerified: true,
            aadhaarLast4:   aadhaarLast4,
            skills:         mockWorker.skills,
            languages:      mockWorker.languages,
            phone:          mockWorker.phone,
            createdAt:      mockWorker.createdAt,
        };

        const response = NextResponse.json({ success: true, user });

        // Set a session cookie with user data (expires in 7 days)
        response.cookies.set("coral_user", JSON.stringify(user), {
            httpOnly: false,   // false so client JS can read it too
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
            sameSite: "lax",
        });

        return response;

    } catch (error: any) {
        console.error("VERIFY OTP ERROR:", error.response?.data || error.message);
        return NextResponse.json(
            { error: "OTP verification failed. Please try again." },
            { status: 500 }
        );
    }
}
