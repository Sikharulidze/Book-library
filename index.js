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

app.get("/ai", (req, res) => {
  res.render("ai.ejs");
});


app.get("/book1", (req, res) => {
  res.render("book1.ejs");
});

app.get("/book2", (req, res) => {
  res.render("book2.ejs");
});

app.get("/book3", (req, res) => {
  res.render("book3.ejs");
});

app.get("/book4", (req, res) => {
  res.render("book4.ejs");
});


app.get("/book5", (req, res) => {
  res.render("book5.ejs");
});


app.get("/book6", (req, res) => {
  res.render("book6.ejs");
});

app.get("/book7", (req, res) => {
  res.render("book7.ejs");
});

app.get("/book8", (req, res) => {
  res.render("book8.ejs");
});

app.get("/book9", (req, res) => {
  res.render("book9.ejs");
});

app.get("/book10", (req, res) => {
  res.render("book10.ejs");
});

app.get("/book11", (req, res) => {
  res.render("book11.ejs");
});

app.get("/book12", (req, res) => {
  res.render("book12.ejs");
});

app.get("/book13", (req, res) => {
  res.render("book13.ejs");
});


app.get("/email", (req, res) => {
  res.render("email.me.ejs");
});

app.get("/search", (req, res) => {
  res.render("search");
});


app.get('/api/search', async (req, res) => {
  const query = req.query.q;
  const page = parseInt(req.query.page) || 1; // Default to page 1 if no page query
  const resultsPerPage = 5; // Number of results per page

  if (!query) {
    return res.json([]);
  }

  try {
    const offset = (page - 1) * resultsPerPage; // Calculate the offset based on the page number
    const result = await db.query(
      'SELECT title, image, notes FROM books WHERE notes ILIKE $1 LIMIT $2 OFFSET $3',
      [`%${query}%`, resultsPerPage, offset]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error searching book notes:', err);
    res.status(500).json({ error: 'Internal Server Error' });
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
