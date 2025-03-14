import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "myapp",
  password: "postgres",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

let books = [];

app.get("/me-in-10-minutes", (req, res) => {
  res.render("about.me.ejs");
});

app.get("/mariam-sikharulidze", (req, res) => {
  res.render("mariam.sikharulidze.ejs");
});

app.get("/mia", (req, res) => {
  res.render("miako.ejs");
});

app.get("/demons", (req, res) => {
  res.render("demons.ejs");
});

app.get("/dead", (req, res) => {
  res.render("dead.ejs");
});

app.get("/book8", (req, res) => {
  res.render("book8.ejs");
});

app.get("/email", (req, res) => {
  res.render("email.me.ejs");
});

app.get("/search", async (req, res) => {
  try {
    const searchQuery = req.query.q || "";
    const query = `
            SELECT * FROM books 
            WHERE LOWER(title) LIKE LOWER($1) 
            OR LOWER(author) LIKE LOWER($1)
            ORDER BY reading_date ASC`;

    const values = [`%${searchQuery}%`];
    const result = await db.query(query, values);

    res.render("search", { books: result.rows, query: searchQuery }); // Pass books to EJS
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
});

app.get("/", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, title, author, rating, reading_date, image,notes FROM books ORDER BY reading_date DESC"
    );
    console.log(result.rows);
    res.render("index", { books: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving books");
  }
});

// Route to display an individual book's page
app.get("/book/:id", async (req, res) => {
  const bookId = req.params.id;

  try {
    const result = await db.query("SELECT * FROM books WHERE id = $1", [
      bookId,
    ]);

    if (result.rows.length > 0) {
      const book = result.rows[0];
      res.render("book", { book });
    } else {
      res.status(404).send("Book not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving book details");
  }
});

app.post("/add", async (req, res) => {
  const { title, author, rating, reading_date } = req.body;

  try {
    await db.query(
      "INSERT INTO books (title, author, rating,reading_date) VALUES ($1, $2, $3, $4)",
      [title, author, rating, reading_date]
    );

    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
