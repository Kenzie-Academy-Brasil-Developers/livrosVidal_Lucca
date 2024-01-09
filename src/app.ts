import express, { Request, Response } from 'express';
import { addBook, booksDatabase } from './database/database';

export const app = express();

app.use(express.json());



app.get('/books', (req: Request, res: Response): Response => {
  return res.json(booksDatabase);
});



app.get('/books/:id', (req: Request, res: Response): Response => {
  const bookId = parseInt(req.params.id);

  const book = booksDatabase.find((book) => book.id === bookId);

  if (!book) {
    return res.status(404).json({ message: 'Book not found.' });
  }

  return res.json(book);
});
let id = 1;

app.post('/books', (req: Request, res: Response): Response => {
  const { name, pages, category } = req.body;

  if (!name || !pages) {
    return res.status(400).json({ message: 'Name and pages are required to create a book.' });
  }


  const existingBook = booksDatabase.find((book) => book.name === name);
  if (existingBook) {
    return res.status(409).json({ error: 'Book already registered.' });
  }

  const newBook = addBook(name, pages, category);
  return res.status(201).json(newBook);
});

app.patch('/books/:id', (req: Request, res: Response): Response => {
  const bookId = parseInt(req.params.id);
  const { name, pages } = req.body;

  const bookToUpdate = booksDatabase.find((book) => book.id === bookId);

  if (!bookToUpdate) {
    return res.status(404).json({ error: 'Book not found.' });
  }


  if (name) {
    const existingBook = booksDatabase.find(
      (book) => book.name === name && book.id !== bookId
    );
    if (existingBook) {
      return res.status(409).json({ error: 'Book already registered.' });
    }
  }

  if (name) {
    bookToUpdate.name = name;
  }
  if (pages) {
    bookToUpdate.pages = pages;
  }

  return res.status(200).json(bookToUpdate);
});



export default app;
