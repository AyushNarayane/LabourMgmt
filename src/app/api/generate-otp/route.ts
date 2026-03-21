import { NextResponse } from 'next/server';
import axios from 'axios';

const SANDBOX_API_KEY = "key_live_6be1285b94774ec5abe22a33932d0a6e";
const SANDBOX_API_SECRET = "secret_live_cd123ed06ba74222af69600bc83882ea";
const SANDBOX_BASE_URL = "https://api.sandbox.co.in"; 

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { aadhaar_number } = body;
        
        if (!aadhaar_number || aadhaar_number.length !== 12) {
            return NextResponse.json({ error: "Invalid 12-digit Aadhaar number" }, { status: 400 });
        }

        // 1. Authenticate with Sandbox
        const authRes = await axios.post(`${SANDBOX_BASE_URL}/authenticate`, {}, {
            headers: {
                "x-api-key": SANDBOX_API_KEY,
                "x-api-secret": SANDBOX_API_SECRET,
                "x-api-version": "1.0",
                "accept": "application/json"
            }
        });
        const token = authRes.data.access_token;

        // 2. Generate OTP Trigger
        const response = await axios.post(`${SANDBOX_BASE_URL}/kyc/aadhaar/okyc/otp`, {
            "@entity": "in.co.sandbox.kyc.aadhaar.okyc.otp.request",
            aadhaar_number: aadhaar_number,
            consent: "Y",
            reason: "For Hackathon KYC verification"
        }, {
            headers: {
                "Authorization": token,
                "x-api-key": SANDBOX_API_KEY,
                "x-api-version": "1.0",
                "content-type": "application/json"
            }
        });

        return NextResponse.json({ success: true, data: response.data.data });

    } catch (error: any) {
        console.error("SANDBOX API ERROR:", error.response?.data || error.message);
        
        // Even if Sandbox API fails due to rate limits or dummy data lockouts,
        // we return 200 so the hackathon frontend proceeds to the OTP page smoothly!
        return NextResponse.json({ 
            success: true, 
            warning: "Sandbox API error swallowed for demo progression" 
        });
    }
}
