
import { Book } from "./interface";  

export const db: Book [] =[];
  let currentId = 1;
  function generateId(): number {
    return currentId++;
  }
  

  const booksDatabase: Book[] = [];
  

  function addBook(name: string, pages: number, category?: string): Book {
    const newBook: Book = {
      id: generateId(),
      name,
      pages,
      category,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    booksDatabase.push(newBook);
    return newBook;
  }
  
  export { booksDatabase, addBook };
  
  