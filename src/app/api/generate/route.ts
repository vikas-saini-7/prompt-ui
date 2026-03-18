/**
 * Code Generation API Endpoint
 * Handles streaming code generation from user prompts
 * Supports multiple LLM providers (OpenAI, Claude, etc.)
 */

import { getLLMProvider } from "@/lib/llm/provider-factory";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/generate
 * Generate code from a prompt using streaming
 *
 * Request body:
 * {
 *   prompt: string (required) - The component description
 *   modelId: string (required) - The AI model to use
 * }
 *
 * Response:
 * Server-Sent Events stream with chunks:
 * - {"type": "content", "content": "...code chunk..."}
 * - {"type": "done"}
 * - {"type": "error", "error": "...error message..."}
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication (optional - for rate limiting)
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { prompt, modelId } = body;

    if (!prompt || !modelId) {
      return NextResponse.json(
        { error: "Missing required fields: prompt, modelId" },
        { status: 400 },
      );
    }

    // Validate prompt
    if (prompt.trim().length === 0) {
      return NextResponse.json(
        { error: "Prompt cannot be empty" },
        { status: 400 },
      );
    }

    if (prompt.length > 2000) {
      return NextResponse.json(
        { error: "Prompt exceeds maximum length (2000 characters)" },
        { status: 400 },
      );
    }

    // Get LLM provider instance
    let provider;
    try {
      provider = getLLMProvider(modelId);
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Invalid model selected";
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    // Validate provider credentials
    const isValid = await provider.validateProvider();
    if (!isValid) {
      return NextResponse.json(
        {
          error: `Failed to authenticate with ${modelId}. Check API credentials.`,
        },
        { status: 401 },
      );
    }

    // Create streaming response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Generate code stream from provider
          for await (const chunk of provider.generateCodeStream(prompt)) {
            // Send chunk as Server-Sent Event
            const data = JSON.stringify(chunk);
            controller.enqueue(`data: ${data}\n\n`);
          }

          // Signal completion
          controller.close();
        } catch (error) {
          const errorMsg =
            error instanceof Error ? error.message : "Streaming error occurred";
          const errorChunk = JSON.stringify({
            type: "error",
            error: errorMsg,
          });
          controller.enqueue(`data: ${errorChunk}\n\n`);
          controller.close();
        }
      },
    });

    // Return streaming response
    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("API error:", error);
    const errorMsg =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

/**
 * OPTIONS /api/generate
 * CORS and preflight support
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
