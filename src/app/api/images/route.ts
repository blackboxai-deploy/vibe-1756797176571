import { NextRequest, NextResponse } from "next/server";

// Simple health check endpoint for images
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const action = searchParams.get("action");

  if (action === "health") {
    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      service: "Image Management API"
    });
  }

  return NextResponse.json({
    message: "Image management API",
    endpoints: [
      "GET /api/images?action=health - Health check"
    ]
  });
}

// Handle unsupported methods
export async function POST() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}