const express = require("express");
const path = require("path");
const { faker } = require("@faker-js/faker");
const connection = require("mysql2");

const port = 5000;
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

const createUser = () => {
  return {
    userId: faker.string.uuid(),
    username: faker.internet.username(), // before version 9.1.0, use userName()
    email: faker.internet.email(),
    avatar: faker.image.avatar(),
    password: faker.internet.password(),
    birthdate: faker.date.birthdate(),
    registeredAt: faker.date.past(),
  };
};

connect

let arr = [];

for (let i = 1; i <= 100; i++) {
  arr.push(createUser());
}

console.log(arr);

app.get("/", (req, res) => {
  // res.send(arr);
  res.render("index", { arr });
});

app.post("/post/edit/:id", (req, res)=>{
  console.log(req.params.id);
  res.send('request recieved')
})

app.listen(port, () => {
  console.log(`website is running on http://localhost:${port}`);
});




