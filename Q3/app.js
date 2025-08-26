
const express = require("express");
const session = require("express-session");
const Redis = require("ioredis");
const connectRedis = require("connect-redis");

const app = express();
app.use(express.urlencoded({ extended: true }));

const redisClient = new Redis();
const RedisStore = connectRedis(session);

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: "mySuperStrongSecret123!@#",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 10 },
  })
);

app.use((req, res, next) => {
  // Log session existence and ID for debugging, not storing
  if (req.session.user) {
    console.log("Session ID:", req.sessionID, "User:", req.session.user);
  }
  next();
});

app.get("/login", (req, res) => {
  res.send(`
    <form method="POST" action="/login">
      <input type="text" name="username" placeholder="Enter Username" required />
      <input type="password" name="password" placeholder="Enter Password" required />
      <button type="submit">Login</button>
    </form>
  `);
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Static user/pass, add DB check here for real app
  if (username === "admin" && password === "1234") {
    req.session.user = username;
    req.session.views = 0;
    return res.redirect("/dashboard");
  } else {
    return res.send("Invalid credentials. <a href='/login'>Try again</a>");
  }
});

app.get("/dashboard", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  req.session.views = (req.session.views || 0) + 1;

  res.send(`
    <h1>Welcome ${req.session.user} 🎉</h1>
    <p>Views: ${req.session.views}</p>
    <a href="/logout">Logout</a>
  `);
});

app.get("/logout", (req, res) => {
  // Destroy session and remove cookie
  req.session.destroy(function (err) {
    res.clearCookie("connect.sid");
    res.redirect("/login");
  });
});

app.get("/", (req, res) => {
  res.send(`<a href="/login">Go to Login</a>`);
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});




// const express = require("express");
// const session = require("express-session");
// const Redis = require("ioredis");
// const connectRedis = require("connect-redis");

// const app = express();

// // Redis client
// const redisClient = new Redis();

// // Session store banane ka naya tarika
// const RedisStore = connectRedis(session);

// app.use(
//   session({
//     store: new RedisStore({ client: redisClient }),
//     secret: "mySuperStrongSecret123!@#",
//     resave: false,
//     saveUninitialized: false,
//     cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 10 }, // 10 minutes
//   })
// );
// app.use((req, res, next) => {
//   if (req.session) {
//     console.log("Session ID:", req.sessionID);
//   }
//   next();
// });

// app.get("/", (req, res) => {
//   if (req.session.views) {
//     req.session.views++;
//     res.send(`Views: ${req.session.views}`);
//   } else {
//     req.session.views = 1;
//     res.send("Welcome! Refresh to count views.");
//   }
// });

// app.listen(3000, () => {
//   console.log("✅ Server running on http://localhost:3000");
// });



// const express = require("express");
// const session = require("express-session");
// const Redis = require("ioredis");
// const connectRedis = require("connect-redis");

// const app = express();

// // Redis client
// const redisClient = new Redis();

// // Session store banane ka naya tarika
// const RedisStore = connectRedis(session);

// app.use(
//   session({
//     store: new RedisStore({ client: redisClient }),
//     secret: "mySuperStrongSecret123!@#",
//     resave: false,
//     saveUninitialized: false,
//     cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 10 }, // 10 minutes
//   })
// );
// app.use((req, res, next) => {
//   if (req.session) {
//     console.log("Session ID:", req.sessionID);
//   }
//   next();
// });


// app.get("/", (req, res) => {
//   if (req.session.views) {
//     req.session.views++;
//     res.send(`Views: ${req.session.views}`);
//   } else {
//     req.session.views = 1;
//     res.send("Welcome! Refresh to count views.");
//   }
// });

// app.listen(3000, () => {
//   console.log("✅ Server running on http://localhost:3000");
// });






// // const express = require('express');
// // const path = require('path');
// // const session = require("express-session");
// // const RedisStore = require("connect-redis")(session);
// // const { createClient } = require("redis");

// // let redisClient = createClient();
// // redisClient.connect().catch(console.error);

// // const app = express();

// // app.set('view engine', 'ejs');
// // app.set('views', path.join(__dirname, 'views'));
// // app.use(express.urlencoded({ extended: false }));

// // // Session middleware
// // app.use(
// //   session({
// //     store: new RedisStore({ client: redisClient }),
// //     secret: 'mySuperStrongSecret123!@#',
// //     resave: false,
// //     saveUninitialized: false,
// //     cookie: { maxAge: 60 * 60 * 1000 }, 
// //   })
// // );

// // app.get('/', (req, res) => {
// //   if (req.session.views) {
// //     req.session.views++;
// //     res.send(`Views: ${req.session.views}`);
// //   } else {
// //     req.session.views = 1;
// //     res.send('Welcome! Refresh page to increase view count.');
// //   }
// // });

// // app.listen(3000, () => {
// //   console.log('✅ Server running on http://localhost:3000');
// // });
