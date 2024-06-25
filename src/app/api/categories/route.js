import { NextResponse } from "next/server";
import connectDb from "../../../../libs/connect_db";

export async function GET() {
    try {
        const db = await connectDb.getConnection()
        const query = 'select * from book_categories'
        const [data] = await db.execute(query)
        db.release()

        return NextResponse.json({ categories: data })
    } catch (error) {
        return NextResponse.json({
            error: error
        }, { status: 500 })
    }
}