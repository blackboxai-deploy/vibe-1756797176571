import { NextRequest, NextResponse } from "next/server";
import { GenerationRequest, GenerationResponse } from "@/types/image";
import { generateImage } from "@/lib/api";

export async function POST(request: NextRequest) {
  try {
    const body: GenerationRequest = await request.json();

    // Validate the request
    if (!body.prompt || typeof body.prompt !== "string") {
      return NextResponse.json(
        { success: false, error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Generate the image
    const result = await generateImage(body);

    return NextResponse.json(result, {
      status: result.success ? 200 : 500,
      headers: {
        "Cache-Control": "no-cache",
        "Content-Type": "application/json"
      }
    });

  } catch (error) {
    console.error("API Route Error:", error);
    
    const errorResponse: GenerationResponse = {
      success: false,
      error: error instanceof Error ? error.message : "Internal server error"
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed. Use POST to generate images." },
    { status: 405 }
  );
}