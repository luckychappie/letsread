import { NextResponse } from "next/server";
import connectDb from "../../../../libs/connect_db";
import { format } from "date-fns";

export async function POST(request) {
    const db = await connectDb.getConnection()
    const formData = await request.formData();
    const name = formData.get("name");
    const email = formData.get("email");
    const message = formData.get("message");
    const createdAt = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

    try {
        const [result] = await db.query("INSERT INTO contact_messages (name, email, message, created_at) VALUES (?,?,?,?,?)",
            [name, email, message, createdAt])
            
        db.release()
        return NextResponse.json({ 'message': 'Message has been sent.' })
        
    } catch (error) {
    
        return NextResponse.json({
            error: error
        }, { status: 500 })
        
    }

}
