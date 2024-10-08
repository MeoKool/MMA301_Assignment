export interface Comment {
    author: string,
    content: string,
    rating: number
}

export interface Products {
    id: string,
    artName: string,
    price: number,
    description: string,
    brand: string,
    glassSurface: boolean,
    image: string,
    limitedTimeDeal: number,
    comments: Comment[]
}