# Week 3 Study Guide & Conversation Summary
**Subject:** Software System Architecture — DNS, HTTP, TLS, CDN, Reverse Proxy, and Docker Networking  
**Lab Scenario:** FoodHub Menu Page Architecture

---

## 1. Command-Line & Environment Fundamentals

### PowerShell `curl` vs `curl.exe`
* **The Issue:** Running `curl -v https://example.com -o /dev/null` in Windows PowerShell failed with `Could not find a part of the path 'C:\dev\null'`.
* **Why:** In Windows PowerShell 5.1, `curl` is an alias for `Invoke-WebRequest`, not the real `curl.exe`. Also, Windows uses `NUL` instead of `/dev/null`.
* **Solution:** Use the explicit binary with the Windows null device:
  ```powershell
  curl.exe -v https://example.com -o NUL
  ```

### What is TLS Renegotiation (`schannel`)?
* **Schannel:** Microsoft Windows' native SSL/TLS security provider.
* **Renegotiation:** A feature in **TLS 1.2** and older where either client or server requests a new handshake inside an already open encrypted session (commonly used for client certificate authentication or key refresh).
* **Note:** Renegotiation was completely removed in **TLS 1.3** for security.

### HTML5 Boilerplate
* Quick shortcut in VS Code / Antigravity: type `!` then press `Tab`.
* Provides standard metadata, UTF-8 encoding, viewport scaling, and body structure.

---

## 2. Docker & Lab Setup (Part C Hands-On)

### Docker Daemon Error
* `failed to connect to the docker API at npipe://...` means **Docker Desktop is not running**. Starting Docker Desktop resolves it.

### Nginx Startup Failure
* `[emerg] no "events" section in configuration` occurred when `nginx.conf` was originally 0 bytes during container initialization.
* Fixed by populating `nginx.conf` and recreating containers:
  ```powershell
  docker compose up -d --force-recreate
  ```

### Lab Part C Results Summary

| Question | Value / Result | Why It Happens |
| :--- | :--- | :--- |
| **Header `X-Served-By`** | `foodhub-proxy` | Injected by Nginx via `add_header X-Served-By "foodhub-proxy";`. |
| **`curl localhost:3000`** | **Connection Refused** | Port 3000 is **not published** in `docker-compose.yml`. Only port `8080:80` is exposed to the host machine. |
| **Client IP vs `X-Forwarded-For`** | Client: `172.18.0.3`<br>`X-Forwarded-For`: `172.18.0.1` | • **Client IP:** The internal Docker IP of the Nginx container (who made the direct TCP socket connection to Node).<br>• **`X-Forwarded-For`:** The true client IP forwarded by Nginx so the app knows who made the request. |
| **`docker compose stop app`** | **`502 Bad Gateway`** | Nginx cannot reach the upstream Node.js backend when it is stopped. |

---

## 3. Core Networking Concepts

### What Does "Private to Docker" Mean?
* **Allowed:** Other containers on the same Docker bridge network (`proxy` and `app`) can talk to each other freely using container service names and internal ports (`http://app:3000`).
* **Blocked:** Your laptop (host OS) and the outside world cannot reach port 3000.
* **Why:** **Defense in depth.** Attackers cannot directly target or exploit backend services; all traffic must pass through the proxy.

### What is a CDN (Content Delivery Network)?
* A globally distributed network of edge cache servers (e.g. Cloudflare, CloudFront, Fastly).
* **Primary Job:** Cache heavy static assets (food menu photos, CSS, JS) geographically close to the user (e.g. Phnom Penh or Singapore) to reduce latency from ~200ms to ~10ms.
* **Cache HIT vs MISS:**
  * **Cache HIT:** File served from CDN edge memory (`cf-cache-status: HIT`). The origin backend never sees the request.
  * **Cache MISS:** CDN fetches file from origin, caches it, and returns it.
* **DNS Integration:** The domain's DNS `A` record points to the **CDN Edge IP (via Anycast routing)**, keeping the real origin server IP masked/hidden from DDoS attacks.

---

## 4. Reverse Proxy & Dual-TLS Architecture

### What is the Job of a Reverse Proxy (Nginx)?
* **Receptionist Analogy:** Acts as the single public entry point for backend services.
* **Responsibilities:**
  1. **Security / Isolation:** Shields backend ports.
  2. **TLS Offloading:** Handles heavy cryptography so application servers do not waste CPU cycles.
  3. **Routing:** Directs paths (`/api` vs `/static`).
  4. **Header Injection:** Adds `X-Forwarded-For` and `X-Served-By`.
  5. **Load Balancing:** Distributes requests among multiple backend instances.

### Why Does Client TLS End at the CDN Edge?
1. **Caching Requirement:** A CDN cannot inspect URLs or cache responses if traffic remains encrypted end-to-end. Decrypting at the edge allows the CDN to read `GET /burger.jpg` and serve cached copies.
2. **Latency:** Handshaking with a nearby edge server takes 10–20 ms, whereas handshaking directly with an origin server across the globe takes 200–300 ms.

### Why Does Origin TLS Exist?
* After the CDN terminates client TLS, traffic from the CDN to your origin server (Nginx) still travels across the **public internet**.
* **Origin TLS** creates a second encrypted tunnel (CDN ↔ Nginx) to protect user credentials, session cookies, and payloads from public eavesdropping.

### What is the Connection Between Reverse Proxy and Backend?
* **Protocol:** Standard **HTTP/1.1** over **plain TCP**.
* **Port:** **TCP 3000** (`http://app:3000`).
* **Encryption:** **Unencrypted (No TLS)**.
* **Why No TLS Internally?**
  * **Network Isolation:** Runs entirely inside the private Docker bridge network (or private datacenter VPC).
  * **CPU Optimization (TLS Offloading):** Node.js runs on a single-threaded event loop. Offloading TLS to Nginx lets Node.js spend 100% of its CPU on business logic, database queries, and rendering pages.

---

## 5. End-to-End Request Flow (Part D)

```text
1. Customer Phone ──► DNS Resolver (Queries foodhub.com -> Returns CDN IP)
2. Customer Phone ──► CDN Edge Server (HTTPS / TLS 1.3 Handshake - Client TLS Ends)
3. CDN Edge ────────► [Cache HIT]: Serves food images & CSS directly (~10ms)
4. CDN Edge ────────► [Dynamic Request]: Origin TLS ──► Nginx Reverse Proxy (Port 8080)
5. Nginx ───────────► Plain HTTP (No TLS) ────────────► Node.js Backend (Port 3000)
6. Node.js ─────────► Database Query (SELECT * FROM dishes) ──► Database
7. Database ────────► Dishes Data ──► Node.js ──► Nginx ──► CDN ──► Customer Phone
```

### Key Artifacts Created for You
* **[Untitled Diagram.drawio](file:///d:/Year3/SoftwareSystemArchitecture/Untitled%20Diagram.drawio)**: Simplified, clean draw.io diagram with default styling, no emojis, and non-overlapping text boxes.
* **[PART_D.md](file:///d:/Year3/SoftwareSystemArchitecture/week3/PART_D.md)**: Full portfolio report with Mermaid diagram and tables.
* **[part_d_diagram.html](file:///d:/Year3/SoftwareSystemArchitecture/week3/part_d_diagram.html)**: Interactive visual diagram viewable in browser.
* **[REQUEST_LIFECYCLE_EXPLAINED.md](file:///d:/Year3/SoftwareSystemArchitecture/week3/REQUEST_LIFECYCLE_EXPLAINED.md)**: Comprehensive narrative explaining every single step from start to end and the technical reasoning behind it.
