import express from "express";
import path from "path";
import { faker } from "@faker-js/faker";
import mysql from "mysql2";
import { fileURLToPath } from "url";
import { dirname } from "path";
// var methodOverride = require('method-override')
import methodOverride from "method-override";

// ES module alternative to __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const port = 5000;
const app = express();

// MySQL connection
let connection;
try {
  connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "todos",
    password: "webskitters",
  });

  connection.connect((err) => {
    if (err) {
      console.log("Database connection failed:", err);
    } else {
      console.log("Connected to MySQL");
    }
  });
} catch (err) {
  console.log("MySQL Error:", err);
}

// Set EJS and static files
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));

// Faker user generator
// const createUser = () => {
//   return {
//     id: faker.string.uuid(),
//     userName: faker.internet.userName(),
//     email: faker.internet.email(),
//     password: faker.internet.password(),
//     // avatar: faker.image.avatar(),
//     // birthdate: faker.date.birthdate(),
//     // registeredAt: faker.date.past(),
//   };
// };

// function generateProperty() {
//   return {
//     id: faker.string.uuid(),
//     title: faker.lorem.words(3), // e.g., "Luxurious Family Home"
//     description: faker.lorem.sentences(2),
//     price: faker.commerce.price(50000, 500000, 0, "₹"),
//     location: faker.address.streetAddress() + ", " + faker.address.city(),
//     image_url: faker.image.urlPicsumPhotos(), // or faker.image.imageUrl()
//     listed_date: faker.date.past().toISOString().split("T")[0],
//   };
// }

// const addData = () => {
//   for (let i = 1; i <= 100; i++) {
//     let data = generateProperty();
//     console.log(data);
//     let userData = [data.id, data.userName, data.email, data.password];
//     arr.push(userData);
//   }

//   const query = "INSERT INTO TODOLIST (id, username, email, password) VALUES ?";
//   try {
//     connection.query(query, [arr], (err, result) => {
//       if (err) throw err;
//       console.log(result);
//     });
//   } catch (err) {
//     console.log(err);
//   }
// };

// addData();

// // Example route

app.get("/", (req, res) => {
  const query = "SELECT * FROM TODOLIST";
  const query2 = "SELECT COUNT(*) FROM TODOLIST";
  try {
    connection.query(query, (err, result) => {
      if (err) throw err;
      try {
        connection.query(query2, (err, result2) => {
          if (err) throw err;
          // console.log(result2[0]["COUNT(*)"]);
          res.render("index", { arr: result, count: result2[0]["COUNT(*)"] });
        });
      } catch (err) {
        console.log(err);
        res.send(404);
      }
    });
  } catch (err) {
    console.log(err);
  }
});

app.get("/post/edit/:id", (req, res) => {
  // console.log(req.params.id);
  const query = `SELECT * FROM TODOLIST WHERE ID = ?`;
  try {
    connection.query(query, [req.params.id], (err, result) => {
      if (err) throw err;
      console.log(result);
      res.render("edit", { elem: result[0] });
    });
  } catch (err) {
    console.log(err);
  }
});

app.put("/edit/:id", (req, res) => {
  console.log(req.body);
  // console.log(req.params.id);
  let query = "SELECT * FROM TODOLIST WHERE ID = ?";
  try {
    connection.query(query, [req.params.id], (err, result) => {
      if (err) throw err;
      console.log(result);
      if (req.body.password === result[0].password) {
        const query2 = `UPDATE TODOLIST SET username = '${req.body.username}', email = '${req.body.email}' WHERE  id = '${req.params.id}'`;
        try {
          connection.query(query2, (err, result) => {
            if (err) throw err;
            console.log(result);
            res.redirect("/");
          });
        } catch (err) {
          console.log(err);
          res.send(err);
        }
        // console.log(result)
      } else {
        res.send("password is incorrect");
      }
    });
  } catch (err) {
    res.send("404");
  }
  // res.send("recieved");
});

// Start server
app.listen(port, () => {
  console.log(`Website is running on http://localhost:${port}`);
});
