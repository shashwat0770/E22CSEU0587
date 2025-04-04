# 🧮 Average Calculator Microservice

This is a REST-based microservice that calculates the **average** of numbers obtained from various third-party sources like prime numbers, Fibonacci, even, and random numbers. The microservice maintains a **sliding window** of the latest unique numbers fetched and updates the average accordingly.

---

## 📌 Features

- REST API endpoint: `GET /numbers/{numberid}`
- Supported `numberid` types:
  - `p` - Prime Numbers
  - `f` - Fibonacci Numbers
  - `e` - Even Numbers
  - `r` - Random Numbers
- Only fetches numbers from third-party APIs (no internal number generation).
- Maintains a **unique number store** with a configurable window size (default: 10).
- Ignores:
  - Duplicate numbers
  - Slow responses (over 500ms)
  - API errors
- Returns the previous and current window state + updated average.

---

## 🛠️ Tech Stack

- Node.js / Express (or preferred web server)
- Axios / Fetch for HTTP requests
- In-memory storage for the sliding window
- Built with performance in mind — responses are sent in under **500ms**

---

## 📡 API Usage

### `GET /numbers/{numberid}`

- `{numberid}` → one of: `p`, `f`, `e`, `r`

### Example

```bash
curl http://localhost:9876/numbers/e
