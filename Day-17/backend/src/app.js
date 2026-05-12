const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const helmet = require('helmet')
const path = require('path')

const {errorHandler} = require('./middleware/error.middleware')
const authRoutes = require('./routes/auth.route')
const noteRoutes = require('./routes/note.route')


const app = express();

// ================= MIDDLEWARE =================
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
)
app.use(helmet());

// ================= STATIC FILES =================
app.use(
  express.static(
    path.join(
      __dirname,
      "public"
    )
  )
)

// ================= ROUTES =================
app.use('/auth', authRoutes);
app.use('/notes', noteRoutes);

// ================= DEFAULT ROUTE =================
app.get('/', (req, res) => {
  res.send("Backend is running 🚀")
})

// ================= FALLBACK ROUTE =================
// app.use((req, res) => {
//   res.sendFile(
//     path.join(
//       __dirname,
//       "public",
//       "index.html"
//     )
//   )
// })

// ================= ERROR HANDLER =================
app.use(errorHandler);






module.exports = app;

// 

// 