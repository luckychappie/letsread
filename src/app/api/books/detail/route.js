import { NextResponse } from "next/server";
import connectDb from "../../../../../libs/connect_db";

export async function GET(request) {
    // const { id } = params
    
    
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id')
        const db = await connectDb.getConnection()
       
        let bookQuery = `SELECT books.*, book_categories.category_name,book_authors.author_name
        FROM books 
        JOIN book_categories ON books.categories_id=book_categories.id
        JOIN book_authors ON books.authors_id=book_authors.id
        WHERE is_show=1 AND books.id = ${id}`
        const [data] = await db.execute(bookQuery )
        
        db.release()

        return NextResponse.json({ book: data.length > 0 ? data[0] : null })
    } catch (error) {
        return NextResponse.json({
            error: error
        }, { status: 500 })
    }
}
