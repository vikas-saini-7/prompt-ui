import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/auth";
import { getAvailableModelsByProvider } from "@/lib/llm/provider-factory";

export async function GET() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get available models grouped by provider
    const availableByProvider = getAvailableModelsByProvider();

    // Build response with metadata
    const models = {
      openai: availableByProvider.openai || [],
      anthropic: availableByProvider.anthropic || [],
      all: [
        ...(availableByProvider.openai || []),
        ...(availableByProvider.anthropic || []),
      ],
    };

    return new Response(JSON.stringify(models), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
