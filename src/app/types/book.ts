export interface Book {
    id: number
    title: string
    description: string
    cover_photo: string
    file: string
    download_size: string
    category_name: string
    author_name: string
}

export interface Category {
    id: number
    category_name: string
}


export interface Author {
    id: number
    author_name: string
}

