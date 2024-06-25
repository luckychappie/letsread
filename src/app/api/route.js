import { NextResponse } from "next/server";

export async function GET(request) {
    return new Response(JSON.stringify({ message: 'Hello, world!' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  // https://www.youtube.com/watch?v=kuV_iAIDT5Y