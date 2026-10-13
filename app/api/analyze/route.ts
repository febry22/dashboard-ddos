import { NextResponse } from "next/server";
import { analyze } from "@/lib/mock";

// Dummy analysis endpoint. It never contacts the target — it only runs the
// local mock() simulation and returns synthetic data for the demo UI.
export async function POST(request: Request) {
  let body: { target?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const target = (body.target ?? "").trim();
  if (!target) {
    return NextResponse.json({ error: "Please provide a website address." }, {
      status: 400,
    });
  }

  // Simulate the assistant "thinking" so the loading state is visible.
  await new Promise((r) => setTimeout(r, 900));

  return NextResponse.json(analyze(target));
}
