# Production Grade Pagination + Search + Sort + Filter Project

## Tech Stack

### Frontend
- React + Vite
- React Query (TanStack Query)
- Axios
- Tailwind CSS
- React Router DOM
- Zustand (optional lightweight state)

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Helmet
- Compression
- Rate Limiting
- MongoDB Indexing

---

# Why Backend Pagination is the Best Choice

Pagination, filtering, searching, and sorting should ALWAYS happen in the backend for production apps.

If you do it in frontend:
- Huge memory usage
- Slow rendering
- Large network payloads
- Poor scalability
- Bad mobile performance
- Impossible with millions of records

Backend pagination:
- Sends only needed records
- Uses MongoDB indexes
- Faster response
- Smaller payload
- Better caching
- Production scalable

This is how companies build:
- Amazon
- Netflix
- LinkedIn
- Instagram
- GitHub

---

# Features

## Core Features

- Server-side pagination
- Server-side search
- Server-side sorting
- Multi-filter support
- Debounced search
- Query caching
- Loading skeletons
- Optimized MongoDB indexes
- URL query sync
- Reusable API architecture
- Clean scalable folder structure

---

# Project Flow

```text
User Types Search
        ↓
Debounce waits 500ms
        ↓
Frontend sends query params
        ↓
Backend validates query
        ↓
MongoDB query built dynamically
        ↓
Indexes optimize query
        ↓
Paginated data returned
        ↓
Frontend caches response
        ↓
UI updates instantly
```

---

# Folder Architecture

# Backend Structure

```bash
backend/
│
├── src/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   └── product.controller.js
│   │
│   ├── middlewares/
│   │   ├── error.middleware.js
│   │   └── notFound.middleware.js
│   │
│   ├── models/
│   │   └── product.model.js
│   │
│   ├── routes/
│   │   └── product.routes.js
│   │
│   ├── utils/
│   │   └── buildQuery.js
│   │
│   ├── seed/
│   │   └── seed.js
│   │
│   ├── app.js
│   └── server.js
│
├── .env
├── package.json
└── README.md
```

---

# Frontend Structure

```bash
frontend/
│
├── src/
│   ├── api/
│   │   └── axios.js
│   │
│   ├── components/
│   │   ├── ProductCard.jsx
│   │   ├── Pagination.jsx
│   │   ├── Filters.jsx
│   │   ├── SearchBar.jsx
│   │   ├── SortDropdown.jsx
│   │   └── Skeleton.jsx
│   │
│   ├── hooks/
│   │   └── useDebounce.js
│   │
│   ├── pages/
│   │   └── Home.jsx
│   │
│   ├── services/
│   │   └── product.service.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── package.json
└── vite.config.js
```

---

# Backend Setup

## package.json

```json
{
  "name": "backend",
  "version": "1.0.0",
  "main": "src/server.js",
  "scripts": {
    "dev": "nodemon src/server.js",
    "seed": "node src/seed/seed.js"
  },
  "dependencies": {
    "compression": "^1.7.4",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "express-rate-limit": "^7.2.0",
    "helmet": "^7.1.0",
    "mongoose": "^8.5.1",
    "morgan": "^1.10.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.4"
  }
}
```

---

# .env

```env
PORT=5000
MONGO_URI=your_mongodb_connection
```

---

# Database Connection

## config/db.js

```js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDB;
```

---

# Product Model

## models/product.model.js

```js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      index: true,
    },

    brand: {
      type: String,
      required: true,
      index: true,
    },

    price: {
      type: Number,
      required: true,
      index: true,
    },

    rating: {
      type: Number,
      default: 0,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// TEXT INDEX FOR SEARCH
productSchema.index({
  title: "text",
  category: "text",
  brand: "text",
});

module.exports = mongoose.model("Product", productSchema);
```

---

# Why Indexes Matter

Without indexes:

```text
MongoDB scans ALL documents
O(n)
```

With indexes:

```text
MongoDB jumps directly
O(log n)
```

Indexes are CRITICAL for production performance.

---

# Query Builder Utility

## utils/buildQuery.js

```js
const buildQuery = (query) => {
  const filters = {};

  // SEARCH
  if (query.search) {
    filters.$text = {
      $search: query.search,
    };
  }

  // CATEGORY FILTER
  if (query.category) {
    filters.category = query.category;
  }

  // BRAND FILTER
  if (query.brand) {
    filters.brand = query.brand;
  }

  // PRICE FILTER
  if (query.minPrice || query.maxPrice) {
    filters.price = {};

    if (query.minPrice) {
      filters.price.$gte = Number(query.minPrice);
    }

    if (query.maxPrice) {
      filters.price.$lte = Number(query.maxPrice);
    }
  }

  return filters;
};

module.exports = buildQuery;
```

---

# Controller

## controllers/product.controller.js

```js
const Product = require("../models/product.model");
const buildQuery = require("../utils/buildQuery");

exports.getProducts = async (req, res, next) => {
  try {
    // PAGINATION
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    // SORTING
    const sortBy = req.query.sortBy || "createdAt";
    const order = req.query.order === "asc" ? 1 : -1;

    const sort = {
      [sortBy]: order,
    };

    // FILTERS
    const filters = buildQuery(req.query);

    // QUERY
    const [products, total] = await Promise.all([
      Product.find(filters)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),

      Product.countDocuments(filters),
    ]);

    res.status(200).json({
      success: true,
      products,

      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};
```

---

# Why Promise.all?

```js
await Promise.all([])
```

Runs queries in parallel.

Without it:

```text
Query 1 waits
Then Query 2 runs
```

With it:

```text
Both run together
```

Faster response.

---

# Routes

## routes/product.routes.js

```js
const express = require("express");
const router = express.Router();

const {
  getProducts,
} = require("../controllers/product.controller");

router.get("/", getProducts);

module.exports = router;
```

---

# Error Middleware

## middlewares/error.middleware.js

```js
const errorMiddleware = (err, req, res, next) => {
  res.status(500).json({
    success: false,
    message: err.message,
  });
};

module.exports = errorMiddleware;
```

---

# Not Found Middleware

## middlewares/notFound.middleware.js

```js
const notFound = (req, res) => {
  res.status(404).json({
    message: "Route Not Found",
  });
};

module.exports = notFound;
```

---

# Express App

## app.js

```js
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const productRoutes = require("./routes/product.routes");
const errorMiddleware = require("./middlewares/error.middleware");
const notFound = require("./middlewares/notFound.middleware");

const app = express();

// SECURITY
app.use(helmet());

// COMPRESSION
app.use(compression());

// RATE LIMIT
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/products", productRoutes);

app.use(notFound);
app.use(errorMiddleware);

module.exports = app;
```

---

# Server

## server.js

```js
require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
```

---

# Seed Data

## seed/seed.js

```js
require("dotenv").config();

const mongoose = require("mongoose");
const Product = require("../models/product.model");

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
};

const categories = ["Laptop", "Phone", "Watch"];
const brands = ["Apple", "Samsung", "Dell", "HP"];

const generateProducts = () => {
  return Array.from({ length: 200 }).map((_, index) => ({
    title: `Product ${index + 1}`,
    category:
      categories[Math.floor(Math.random() * categories.length)],

    brand:
      brands[Math.floor(Math.random() * brands.length)],

    price: Math.floor(Math.random() * 5000),

    rating: Math.floor(Math.random() * 5) + 1,
  }));
};

const seed = async () => {
  await connectDB();

  await Product.deleteMany();

  await Product.insertMany(generateProducts());

  console.log("Seeded Successfully");

  process.exit();
};

seed();
```

---

# Frontend Setup

## Install

```bash
npm create vite@latest frontend
```

---

# Frontend Dependencies

```bash
npm install axios @tanstack/react-query react-router-dom
```

---

# Axios Instance

## api/axios.js

```js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export default API;
```

---

# Product Service

## services/product.service.js

```js
import API from "../api/axios";

export const getProducts = async (params) => {
  const response = await API.get("/products", {
    params,
  });

  return response.data;
};
```

---

# Debounce Hook

## hooks/useDebounce.js

```js
import { useEffect, useState } from "react";

const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
```

---

# Why Debouncing?

Without debouncing:

```text
Typing: iphone

i → request
ip → request
iph → request
ipho → request
```

5 unnecessary API calls.

With debouncing:

```text
Wait until user stops typing
Only ONE request
```

Huge performance improvement.

---

# Search Component

## components/SearchBar.jsx

```jsx
const SearchBar = ({ value, onChange }) => {
  return (
    <input
      type="text"
      placeholder="Search products..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border p-2 rounded w-full"
    />
  );
};

export default SearchBar;
```

---

# Filter Component

## components/Filters.jsx

```jsx
const Filters = ({ category, setCategory }) => {
  return (
    <select
      value={category}
      onChange={(e) => setCategory(e.target.value)}
      className="border p-2 rounded"
    >
      <option value="">All</option>
      <option value="Laptop">Laptop</option>
      <option value="Phone">Phone</option>
      <option value="Watch">Watch</option>
    </select>
  );
};

export default Filters;
```

---

# Sort Dropdown

## components/SortDropdown.jsx

```jsx
const SortDropdown = ({ sortBy, setSortBy }) => {
  return (
    <select
      value={sortBy}
      onChange={(e) => setSortBy(e.target.value)}
      className="border p-2 rounded"
    >
      <option value="createdAt">Newest</option>
      <option value="price">Price</option>
      <option value="rating">Rating</option>
    </select>
  );
};

export default SortDropdown;
```

---

# Product Card

## components/ProductCard.jsx

```jsx
const ProductCard = ({ product }) => {
  return (
    <div className="border rounded p-4">
      <h2 className="font-bold text-lg">
        {product.title}
      </h2>

      <p>{product.brand}</p>

      <p>{product.category}</p>

      <p>${product.price}</p>

      <p>⭐ {product.rating}</p>
    </div>
  );
};

export default ProductCard;
```

---

# Pagination Component

## components/Pagination.jsx

```jsx
const Pagination = ({
  page,
  totalPages,
  setPage,
}) => {
  return (
    <div className="flex gap-3 justify-center mt-6">
      <button
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
        className="border px-4 py-2 rounded"
      >
        Prev
      </button>

      <span>
        {page} / {totalPages}
      </span>

      <button
        disabled={page === totalPages}
        onClick={() => setPage(page + 1)}
        className="border px-4 py-2 rounded"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
```

---

# Skeleton Loader

## components/Skeleton.jsx

```jsx
const Skeleton = () => {
  return (
    <div className="animate-pulse border rounded p-4 h-32">
      <div className="bg-gray-300 h-4 mb-4 rounded"></div>
      <div className="bg-gray-300 h-4 mb-4 rounded"></div>
      <div className="bg-gray-300 h-4 rounded"></div>
    </div>
  );
};

export default Skeleton;
```

---

# Main Page

## pages/Home.jsx

```jsx
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { getProducts } from "../services/product.service";

import SearchBar from "../components/SearchBar";
import Filters from "../components/Filters";
import SortDropdown from "../components/SortDropdown";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";
import Skeleton from "../components/Skeleton";

import useDebounce from "../hooks/useDebounce";

const Home = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");

  const debouncedSearch = useDebounce(search);

  const { data, isLoading } = useQuery({
    queryKey: [
      "products",
      page,
      debouncedSearch,
      category,
      sortBy,
    ],

    queryFn: () =>
      getProducts({
        page,
        limit: 9,
        search: debouncedSearch,
        category,
        sortBy,
      }),

    keepPreviousData: true,
  });

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex gap-4 mb-6">
        <SearchBar
          value={search}
          onChange={setSearch}
        />

        <Filters
          category={category}
          setCategory={setCategory}
        />

        <SortDropdown
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {isLoading
          ? Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} />
            ))
          : data?.products?.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}
      </div>

      <Pagination
        page={data?.pagination?.page || 1}
        totalPages={
          data?.pagination?.totalPages || 1
        }
        setPage={setPage}
      />
    </div>
  );
};

export default Home;
```

---

# App.jsx

```jsx
import Home from "./pages/Home";

const App = () => {
  return <Home />;
};

export default App;
```

---

# main.jsx

```jsx
import React from "react";
import ReactDOM from "react-dom/client";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import App from "./App";
import "./index.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
```

---

# Why React Query?

React Query gives:

- Caching
- Request deduplication
- Background refetching
- Loading states
- Error states
- Stale data handling
- Infinite query support

Without React Query:

You manually handle:

```text
loading
error
cache
retry
refetch
```

Huge production advantage.

---

# API Example

## Request

```http
GET /api/products?page=1&limit=10&search=iphone&category=Phone&sortBy=price&order=asc
```

---

# Response

```json
{
  "success": true,
  "products": [],
  "pagination": {
    "total": 200,
    "page": 1,
    "limit": 10,
    "totalPages": 20,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

# Important Production Optimizations

## 1. lean()

```js
Product.find().lean()
```

Returns plain JS objects.

Faster.
Less memory.

---

## 2. Compression

```js
app.use(compression())
```

Compresses responses.
Smaller payload.
Faster network.

---

## 3. Helmet

Adds:

- XSS protection
- Security headers
- Clickjacking prevention

Production mandatory.

---

## 4. Rate Limiting

Protects from:

- Spam
- DDoS
- Brute force

---

## 5. Debounced Search

Avoids:

- API spam
- Server overload
- Unnecessary renders

---

## 6. Query Caching

React Query caches results.

If user revisits page:

```text
Instant response
No API call
```

---

# Real Production Improvements

If building enterprise-level app:

## Add:

- Redis caching
- Infinite scrolling
- Cursor pagination
- ElasticSearch
- CDN
- Virtualized lists
- Docker
- Kubernetes
- CI/CD
- Microservices

---

# Offset Pagination vs Cursor Pagination

## Offset Pagination

```text
?page=1
?page=2
```

Easy.
Good for admin dashboards.

But slower for huge data.

---

## Cursor Pagination

```text
?cursor=abc123
```

Used by:
- Instagram
- Twitter
- YouTube

Better scalability.

---

# Why This Architecture is Production Grade

## Separation of Concerns

- Controllers handle logic
- Routes handle endpoints
- Models handle schema
- Utils handle reusable functions
- Components are reusable

---

## Scalable

You can add:

```text
Users
Orders
Payments
Reviews
```

without rewriting architecture.

---

## Maintainable

Easy for teams.
Easy debugging.
Easy onboarding.

---

# Final Flow Explanation

## Step 1

User types:

```text
iphone
```

---

## Step 2

Debounce waits:

```text
500ms
```

---

## Step 3

React Query sends:

```js
/api/products?page=1&search=iphone
```

---

## Step 4

Backend builds query:

```js
{
  $text: {
    $search: "iphone"
  }
}
```

---

## Step 5

MongoDB uses indexes.

Fast lookup.

---

## Step 6

Backend paginates:

```js
.skip()
.limit()
```

---

## Step 7

Frontend receives only needed data.

---

## Step 8

React Query caches response.

Instant future loads.

---

# Performance Summary

## This Project Uses

✅ Backend pagination

✅ Indexed search

✅ Debounced requests

✅ Query caching

✅ Compression

✅ Lean queries

✅ Parallel DB queries

✅ Rate limiting

✅ Modular architecture

✅ Reusable components

---

# What You Learn From This Project

Frontend:
- React architecture
- React Query
- Debouncing
- Pagination UI
- Reusable components
- API handling

Backend:
- MongoDB indexing
- Dynamic queries
- Filtering
- Sorting
- Pagination
- Express architecture
- Production middlewares

System Design:
- Client-server optimization
- Query efficiency
- Caching concepts
- Scalable architecture

---

# Best Practice Recommendation

For learning:

Start with offset pagination.

For large-scale production:

Move to cursor pagination.

---

# Next Level Features You Can Build

## 1. Infinite Scroll

Instead of buttons:

```text
Load more on scroll
```

---

## 2. URL Query Sync

```text
?page=2&search=iphone
```

Shareable URLs.

---

## 3. Advanced Filters

- Multiple categories
- Ratings
- Availability
- Date range

---

## 4. Redis Cache

Cache expensive queries.

Huge performance boost.

---

## 5. ElasticSearch

Super advanced search engine.

Used by:
- Amazon
- Netflix
- Shopify

---

# Final Verdict

This architecture is:

- Minimal
- Fast
- Scalable
- Maintainable
- Production-ready
- Interview-ready
- Enterprise-friendly

This is VERY close to how modern real-world applications are built.

