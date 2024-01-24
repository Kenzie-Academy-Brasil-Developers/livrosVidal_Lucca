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

app.post('/books', (req: Request, res: Response): Response => {
  const { name, pages, category } = req.body;

  // Validate 'name' field
  if (!name || typeof name !== 'string' || name.length < 3) {
    return res.status(400).json({ message: 'Name is required and must be a string with at least 3 characters.' });
  }

  // Validate 'pages' field
  if (!pages || typeof pages !== 'number' || pages < 1) {
    return res.status(400).json({ message: 'Pages is required and must be a number with a minimum value of 1.' });
  }

  // Validate 'category' field (optional)
  if (category && typeof category !== 'string') {
    return res.status(400).json({ message: 'Category, if provided, must be a string.' });
  }

  // Check if a book with the same name already exists
  const existingBook = booksDatabase.find((book) => book.name === name);
  if (existingBook) {
    return res.status(409).json({ error: 'Book already registered.' });
  }

  // Add the new book to the database
  const newBook = addBook(name, pages, category);
  return res.status(201).json(newBook);
});

app.patch('/books/:id', (req: Request, res: Response): Response => {
  // ... (mantenha o código existente para a rota PATCH)
  const bookId = parseInt(req.params.id);
  const { name, pages } = req.body;

  // Encontrar o livro a ser atualizado
  const bookToUpdate = booksDatabase.find((book) => book.id === bookId);

  // Verificar se o livro existe
  if (!bookToUpdate) {
    return res.status(404).json({ error: 'Book not found.' });
  }

  // Validar o campo 'name'
  if (name) {
    // Verificar se o novo nome já está registrado para outro livro
    const existingBook = booksDatabase.find(
      (book) => book.name === name && book.id !== bookId
    );
    if (existingBook) {
      return res.status(409).json({ error: 'Book already registered.' });
    }

    // Atualizar o nome do livro
    bookToUpdate.name = name;
  }

  // Validar o campo 'pages'
  if (pages !== undefined) {
    // Verificar se 'pages' é um número positivo
    if (typeof pages !== 'number' || pages < 1) {
      return res.status(400).json({ error: 'Pages must be a positive number.' });
    }

    // Atualizar o número de páginas do livro
    bookToUpdate.pages = pages;
  }

  // Retorna o livro atualizado
  return res.status(200).json(bookToUpdate);
});





export default app;


