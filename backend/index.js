require('dotenv').config()
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { UserModel, TodoModel } = require("./db");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const app = express();
const JWT_SECRET = process.env.JWT_SECRET;
const { z } = require("zod");

mongoose.connect(
  process.env.MONGO_URL
);

app.use(cors())

app.use(express.json());

function auth(req, res, next) {
  console.log(req.headers.token);
  const user = jwt.verify(req.headers.token, JWT_SECRET);
  console.log(user);
  if (user) {
    next();
  } else {
    res.status(403).json({
      message: "you need to login first",
    });
  }
}

app.post("/signup", async (req, res) => {

  const requirebody = z.object({
    email: z.string().min(6).max(50).email(),
    name: z.string().min(3).max(100),
    password: z.string().min(4).max(40)
  })

  const parseDataWithSuccess = requirebody.safeParse(req.body);

  if(!parseDataWithSuccess.success) {
    res.json({
      message: "Incorrect format"
    })
    return
  }

  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;

  const hashedPassword = await bcrypt.hash(password, 5);

  console.log(hashedPassword);

  await UserModel.create({
    email: email,
    password: hashedPassword,
    name: name,
  });

  res.json({
    message: "You are logged in",
  });
});

app.post("/signin", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await UserModel.findOne({
    email: email,
  });

  console.log(user._id);

  const passwordMatch = await bcrypt.compare(password, user.password)

  if (passwordMatch) {
    const token = jwt.sign(
      {
        id: user._id,
      },
      JWT_SECRET
    );
    res.json({
      token,
    });
  } else {
    res.status(403).json({
      message: "Incorrect credentials",
    });
  }
});

app.post("/todo", auth, async (req, res) => {
  const title = req.body.title;
  const done = req.body.done;
  const verify = jwt.decode(req.headers.token, JWT_SECRET);

  await TodoModel.create({
    title: title,
    done: done,
    userId: verify.id,
  });

  res.json({
    id: verify.id,
  });
});

app.get("/todos", auth, async (req, res) => {
  const token = jwt.decode(req.headers.token, JWT_SECRET);
  const id = token.id;
  const todos = await TodoModel.find({
    userId: id
  });
  console.log(id);

  res.json({
    message: todos
  })
});

app.listen(3001);
