const express = require("express");
const app = express();
const port = 3000;

const pool = require("./config/database");
app.use(express.static("static"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.get('/todo', (req, res, next) => {
//   res.status(404).json({mes:'eieร'})
// })

// app.post('/todo', async (req, res, next) => {
//   try{
//     const [rows, fields] = await pool.query("CREATE ")
//   }catch{

//   }
//   res.send('POST create a new ToDo')
// })

app.get("/todo/:id", async (req, res, next) => {
  try {
    const [rows, fields] = await pool.query("SELECT * FROM todo WHERE id=?", [
      req.params.id,
    ]);
    res.json(rows);
  } catch (err) {
    console.log(err);
    next(err);
  }
});
app.get("/todoall", async (req, res, next) => {
  try {
    const [rows, fields] = await pool.query(
      "SELECT *, DATE_FORMAT(due_date, '%Y-%m-%d') as due_date  FROM todo"
    );
    res.json(rows);
  } catch (err) {
    console.log(err);
    next(err);
  }
});
app.get("/todo", async (req, res, next) => {
  const start = req.body.start_date;
  const end = req.body.end_date;
  try {
    if (!start && !end) {
      const [time] = await pool.query(
        "SELECT *, DATE_FORMAT(due_date, '%Y-%m-%d') as due_date from todo WHERE due_date >= ? and due_date <= ?",
        [start, end]
      );
      res.status(200).json(time);
      // console.log(time)
    } else {
      const [data] = await pool.query(
        "SELECT *, DATE_FORMAT(due_date, '%Y-%m-%d') as due_date  FROM todo",
        []
      );
      res.status(200).json(data);
    }
  } catch (error) {
    res.status(404).json(error);
    console.log("fail");
  }
});
app.post("/todo", async (req, res, next) => {
  const title = req.body.title;
  const description = req.body.description;
  var due_date = req.body.due_date;
  if (due_date == null) {
    due_date = new Date();
  }
  if (!title) {
    res.status(400).json({ message: "กรอกtitleด้วยอีเวน" });
  } else if (!description) {
    res.status(400).json({ message: "กรอกdescriptionด้วยอีเวน" });
  } else {
    try {
      const [getOrder] = await pool.query(
        "SELECT MAX(`order`) as mak from todo"
      );
      // console.log(getOrder)
      // console.log(getOrder[0])
      // console.log(getOrder[0].mak)
      const numOrder = getOrder[0].mak + 1;
      const [add] = await pool.query(
        "INSERT INTO todo (title, description, due_date, `order`) VALUES (?, ?, ?, ?)",
        [title, description, due_date, numOrder]
      );
      const [date, bae] = await pool.query(
        "SELECT *, DATE_FORMAT(due_date, '%Y-%m-%d') as due_date from todo where id = ?",
        [add.insertId]
      );
      // const [data] = await pool.query("SELECT * from todo where id = ?", [add.insertId])
      res.send("eiei");
    } catch (er) {
      console.log(er);
      next(er);
    }
  }
});

app.delete("/tododel/:id", async (req, res, next) => {
  try {
    const [rows, fields] = await pool.query("SELECT * FROM todo WHERE id=?", [
      req.params.id,
    ]);
    console.log(rows);
    if (rows[0] == null) {
      res.send("data is empty");
    } else {
      await pool.query("DELETE FROM todo where id=?", [req.params.id]);
      res.send(`DELETE a ToDo with id = ${req.params.id}`);
    }
    res.status(200);
  } catch (e) {
    // log the error and send error status in response
    console.log(e);
    res.status(500);
  }
});

app.get("/blogs/:id", async (req, res, next) => {
  try {
    const [like] = await pool.query("SELECT * FROM blogs WHERE id=?", [
      req.params.id,
    ]);
    res.json(like)
  } catch (error) {
    console.log(e);
    res.status(500);
  }
});
app.put("/addLike/:id",async (req, res, next) => {
  try {
    const [numlike] = await pool.query("SELECT `like` FROM blogs WHERE id=?", [
      req.params.id,
    ]);
    const addlike = numlike[0].like+1
    const [added] = await pool.query("UPDATE blogs SET `like` = ? WHERE id = ?", [
      addlike ,req.params.id
    ]);
    const [liked] = await pool.query("SELECT * FROM blogs WHERE id=?", [
      req.params.id,
    ]);
    res.json({mesg: liked})
  } catch (error) {
    console.log("eoeo");
    res.status(404).json("oror");
  }
})

module.exports = app;
