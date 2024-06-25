import { NextResponse } from "next/server";
import connectDb from "../../../../libs/connect_db";
import fs from "node:fs/promises";
import { revalidatePath } from "next/cache";
import { format } from "date-fns";
import formatFileSize from '@/app/utils/filter';

export async function GET(request) {
    const itemPerPage = 10
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const search = searchParams.get('search') 
    const categories_id = searchParams.get('categories_id') 
    const authors_id = searchParams.get('authors_id') 

    const offset = (itemPerPage * (page - 1))
    try {
        const db = await connectDb.getConnection()
       
        let filterQuery = ''
        if (search && search !== '') {
            filterQuery += ` AND (title LIKE "%${search}%" OR book_categories.category_name LIKE "%${search}%" OR author_name LIKE "%${search}%" OR description LIKE "%${search}%" ) `
        }
        if (categories_id && categories_id !== 'undefined') {
            filterQuery += ` AND categories_id = ${categories_id}`
        }
        if (authors_id && authors_id !== 'undefined') {
            filterQuery += ` AND authors_id = ${authors_id}`
        }

        let bookQuery = `SELECT DISTINCT books.id, books.* ,author_name, category_name
        FROM books 
        JOIN book_categories ON books.categories_id=book_categories.id
        JOIN book_authors ON books.authors_id=book_authors.id
        WHERE is_show=1 ` + filterQuery + `
        ORDER BY books.id DESC 
        LIMIT ${itemPerPage} offset ${offset}`

        const totalQuery = `SELECT count(books.id) as total 
        FROM books 
        JOIN book_categories ON books.categories_id=book_categories.id
        JOIN book_authors ON books.authors_id=book_authors.id
        WHERE is_show=1 ` + filterQuery

        const [data] = await db.execute(bookQuery )
        const [dataCount] = await db.execute(totalQuery)
        db.release()

        return NextResponse.json({ books: data, total: dataCount[0].total })
    } catch (error) {
        return NextResponse.json({
            error: error
        }, { status: 500 })
    }
}

export async function POST(request) {
    const db = await connectDb.getConnection()
    const formData = await request.formData();
    const title = formData.get("title");
    const description = formData.get("description");
    const categories_id = formData.get("categories_id");
    const authors_id = formData.get("authors_id");
    const createdAt = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

    try {
        //upload cover photo
        const coverPhoto = formData.get("coverPhoto");
        const arrayBuffer = await coverPhoto.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);
        const coverPhotoName = Date.now()+'-'+coverPhoto.name
        await fs.writeFile(`./public/uploads/${coverPhotoName}`, buffer);

         //upload pdf file
         const file = formData.get("file");
         const arrayFileBuffer = await file.arrayBuffer();
         const fileBuffer = new Uint8Array(arrayFileBuffer);
         const fileName = Date.now()+'-'+file.name
         const fileSize = formatFileSize(file.size)
         await fs.writeFile(`./public/uploads/files/${fileName}`, fileBuffer);
    
        revalidatePath("/");
        const [result] = await db.query("INSERT INTO books (title, description, file, categories_id, authors_id, cover_photo, download_size, created_at) VALUES (?,?,?,?,?,?,?, ?)",
            [title, description, fileName, categories_id, authors_id, coverPhotoName, fileSize, createdAt])
            
        db.release()
        return NextResponse.json({ 'message': 'Book was created' })
        
    } catch (error) {
    
        return NextResponse.json({
            error: error
        }, { status: 500 })
        
    }

}

export async function UPDATE(request) {
    const db = await connectDb.getConnection()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id') 
    const [result] = await db.query(`UPDATE books SET is_show=1 WHERE id=${id}`)
            
        db.release()
        return NextResponse.json({ 'message': 'Book was created' })
}