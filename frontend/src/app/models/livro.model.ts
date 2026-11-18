export interface Livro {
    id: string;
    titulo: string;
    autor: string;
    preco: string;
    precoOriginal?: string;
    emPromocao?: boolean;
    capa: string;
    categoria: string;
    sinopse: string;
}