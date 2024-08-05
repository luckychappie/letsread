import { NextResponse } from "next/server";
import connectDb from "../../../../../libs/connect_db";

export async function GET() {
    try {
        const db = await connectDb.getConnection()
        const query = 'select * from books ORDER BY favourite_count DESC limit 4'
        const [data] = await db.execute(query)
        db.release()

        return NextResponse.json({ books: data })
    } catch (error) {
        return NextResponse.json({
            error: error
        }, { status: 500 })
    }
}