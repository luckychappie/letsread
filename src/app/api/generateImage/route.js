import { createCanvas } from 'canvas';
import { NextResponse } from "next/server";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const text = searchParams.get('text');
    try {
        if (!text) {
            return res.status(400).json({ error: 'Text query parameter is required' });
          }
        
          const width = 800;
          const height = 200;
          const canvas = createCanvas(width, height);
          const context = canvas.getContext('2d');
        

        return NextResponse.json({ categories: text })
    } catch (error) {
        return NextResponse.json({
            error: error
        }, { status: 500 })
    }
}
