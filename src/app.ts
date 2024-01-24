import express, { Request, Response } from 'express';
import helmet from 'helmet'; 
import { addBook, booksDatabase } from './database/database';
import { IssuesResponse } from './database/interface';
import loggerMiddleware from './middlewares/books.middlewares';
export const app = express();
app.use(helmet());

app.use(loggerMiddleware);

app.use(express.json());

app.get('/books', (req: Request, res: Response): Response => {
  const {search} = req.query

  if(!search) {
    return res.json(booksDatabase);
  }

  const name = search.toString()
  const book = booksDatabase.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));

  return res.json(book);
});

app.get('/books/:id', (req: Request, res: Response): Response => {
  const bookId = parseInt(req.params.id);

  const book = booksDatabase.find((book) => book.id === bookId);

  if (!book) {
    return res.status(404).send({ error: 'Book not found.' });
  }

  return res.json(book);
});

app.post('/books', (req: Request, res: Response): Response => {
  const { name, pages, category } = req.body;  
  const issues: IssuesResponse = { issues: [] };


  if (!name) {
    issues.issues.push({message: 'Required'})
    
  } else if (typeof name !== 'string' || name.length < 3) {
    issues.issues.push({message: 'Expected string, received number'})
 
  }
 
 
  if (!pages) {
    issues.issues.push({message: 'Required'})
 
  } else if (typeof pages !== 'number' || pages < 1) {
    issues.issues.push({message: 'Expected number, received string'})
    
  }

  if(issues.issues.length > 0){
    return res.status(409).send(issues);
  }

  
  if (category && typeof category !== 'string') {
    return res.status(409).json({ message: 'Category, if provided, must be a string.' });
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
  const issues: IssuesResponse = { issues: [] };


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
    } else if (typeof name !== 'string' || name.length < 3) {
      issues.issues.push({message: 'Expected string, received number'})
    }

   
    bookToUpdate.name = name;
  }


  if (pages !== undefined) {

    if (typeof pages !== 'number' || pages < 1) {
      issues.issues.push({message: 'Expected number, received string'})
    }

    
    bookToUpdate.pages = pages;
  }

console.log('issues ', issues.issues)

  if(issues.issues.length > 0){
    return res.status(400).send(issues);
  }
  

  return res.status(200).json(bookToUpdate);
});


app.delete('/books/:id', (req: Request, res: Response): Response => {
  const bookId = parseInt(req.params.id);

  const updatedBooks = booksDatabase.filter((book) => book.id !== bookId);

  if (updatedBooks.length === booksDatabase.length) {
    return res.status(404).send({ error: 'Book not found.' });
  }

  return res.sendStatus(204);
});

export default app;


