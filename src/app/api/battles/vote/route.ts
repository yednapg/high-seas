import { NextResponse } from "next/server";
import { submitVote } from "../../../../../lib/battles/airtable";
import { getSession } from "@/app/utils/auth";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const voteData = await request.json();
    const result = await submitVote(voteData);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error submitting vote:", error);
    return NextResponse.json(
      { error: "Failed to submit vote" },
      { status: 500 },
    );
  }
}