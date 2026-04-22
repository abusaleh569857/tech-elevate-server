# 🚀 TechElevate - Product Discovery and Role-Based Moderation Platform

A production-oriented **full-stack web application** built with **React + Vite** (frontend), **Tailwind CSS** (UI), **Redux Toolkit** (state management), **Firebase Auth + JWT** (authentication), and **Express + MongoDB** (backend) for tech product publishing, moderation workflow, admin governance, coupons, and Stripe membership payments.

---

## Live Demo

- Visit Live Website: [TechElevate](https://tech-elevate.web.app)

---

## Quick Navigation

- [Setup and Run](#setup-and-run)
- [Architecture Overview](#architecture-overview)
- [API Overview](#api-overview)
- [Technical Decisions](#technical-decisions)
- [Challenges Faced](#challenges-faced)
- [Current Completion Snapshot](#current-completion-snapshot)
- [User Flow (Quick Manual)](#user-flow-quick-manual)
- [Screenshots](#screenshots)

---

## Setup and Run

Follow these steps to run the full project locally (frontend + backend).

### 1. Prerequisites

Before you begin, make sure these are installed:

- **Node.js** (v18+ recommended)
- **npm**
- **MongoDB Atlas URI** (or local MongoDB)
- (Optional) **Git**

### 2. Installation Steps

Clone and install dependencies for both apps:

- Frontend Repo: [tech-elevate-client](https://github.com/abusaleh569857/tech-elevate-client)

```bash
# Clone
git clone <your-repo-url>

# Frontend deps
cd Tech-Elevate-Frontend
npm install

# Backend deps
cd ../tech-elevate-server
npm install
```

### 3. Environment Variables

This project requires separate environment files for frontend and backend.

#### Frontend (`Tech-Elevate-Frontend/.env`)

```env
VITE_API_BASE_URL=http://localhost:5000

VITE_apiKey=
VITE_authDomain=
VITE_projectId=
VITE_storageBucket=
VITE_messagingSenderId=
VITE_appId=

VITE_Payment_Gateway_PK=
```

#### Backend (`tech-elevate-server/.env`)

```env
PORT=
MONGODB_URI=
DB_USER=
DB_PASS=
ACCESS_TOKEN_SECRET=
STRIPE_SECRET_KEY=
CLIENT_ORIGIN=
```

**For actual environment variable values, please contact the project author.**

### 4. How to Run the Project

Run backend and frontend in separate terminals:

```bash
# Terminal 1 (Backend)
cd tech-elevate-server
npm run dev
```

```bash
# Terminal 2 (Frontend)
cd Tech-Elevate-Frontend
npm run dev
```

Open:

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend: [http://localhost:5000](http://localhost:5000)

---

## Architecture Overview

### 1. Folder Structure

The codebase is split into two deployable apps.

#### Frontend (`Tech-Elevate-Frontend`)

```text
Tech-Elevate-Frontend/
|-- src/
|   |-- app/
|   |   |-- App.jsx -> RouterProvider mount point.
|   |   |-- hooks.js -> Typed/useful Redux hooks.
|   |   |-- store.js -> Redux Toolkit store configuration.
|   |   `-- providers/
|   |       `-- AuthProvider.jsx -> Firebase auth session bootstrap + sync to Redux.
|   |-- layouts/
|   |   `-- RootLayout.jsx -> Global shell with NavBar, Footer, and route outlet.
|   |-- routes/
|   |   |-- routes.jsx -> createBrowserRouter entry.
|   |   |-- appRoutes.jsx -> Main route tree composition.
|   |   |-- publicRoutes.jsx -> Home/login/register route group.
|   |   |-- userRoutes.jsx -> Authenticated user routes.
|   |   |-- moderatorRoutes.jsx -> Moderator dashboard route group.
|   |   |-- adminRoutes.jsx -> Admin dashboard route group.
|   |   `-- guards/
|   |       |-- PrivateRoute.jsx -> Auth guard.
|   |       `-- RoleRoute.jsx -> Role-based guard.
|   |-- pages/
|   |   |-- auth/
|   |   |   |-- Login.jsx -> Email/password + Google login.
|   |   |   `-- Register.jsx -> Registration + Google signup.
|   |   |-- home/
|   |   |   |-- Home.jsx -> Landing/home data flow and CTA blocks.
|   |   |   `-- components/
|   |   |       `-- HomeHeroSlider.jsx -> Lazy slider hero section.
|   |   |-- product/
|   |   |   |-- ProductsPage.jsx -> Accepted products listing + search/pagination.
|   |   |   `-- AcceptedProductDetails.jsx -> Product detail, vote, report, reviews.
|   |   |-- dashboard/
|   |   |   |-- user/
|   |   |   |   |-- UserDashboard.jsx -> User dashboard shell.
|   |   |   |   |-- MyProfile.jsx -> Profile + membership state.
|   |   |   |   |-- PaymentStripe.jsx -> Stripe Elements wrapper.
|   |   |   |   |-- PaymentModal.jsx -> Coupon + payment intent + card flow.
|   |   |   |   |-- AddProduct.jsx -> Product creation form.
|   |   |   |   `-- MyProduct.jsx -> User product update/delete.
|   |   |   |-- moderator/
|   |   |   |   |-- ModeratorDashboard.jsx -> Moderator shell.
|   |   |   |   |-- ProductReviewQueue.jsx -> Accept/reject/feature actions.
|   |   |   |   |-- ReportedContents.jsx -> Reported products management.
|   |   |   |   `-- ProductDetails.jsx -> Moderator product inspection detail.
|   |   |   `-- admin/
|   |   |       |-- AdminDashboard.jsx -> Admin shell.
|   |   |       |-- Statistics.jsx -> Analytics cards + custom charts.
|   |   |       |-- ManageUsers.jsx -> Role assignment.
|   |   |       `-- ManageCoupons.jsx -> Coupon CRUD.
|   |   `-- system/
|   |       `-- ErrorPage.jsx -> Fallback/error route page.
|   |-- features/
|   |   |-- auth/
|   |   |   |-- auth.slice.js -> Auth state machine.
|   |   |   |-- auth.thunks.js -> Firebase auth + profile sync thunks.
|   |   |   |-- auth.selectors.js -> Auth selectors.
|   |   |   `-- index.js -> Public exports.
|   |   |-- products/
|   |   |   |-- products.slice.js -> Product domain state.
|   |   |   |-- products.thunks.js -> Product/review/moderation async logic.
|   |   |   |-- products.selectors.js -> Product selectors.
|   |   |   `-- index.js -> Public exports.
|   |   `-- admin/
|   |       |-- admin.slice.js -> Admin domain state.
|   |       |-- admin.thunks.js -> Users/coupons/stats async logic.
|   |       |-- admin.selectors.js -> Admin selectors.
|   |       `-- index.js -> Public exports.
|   |-- services/
|   |   `-- api/
|   |       |-- axiosInstance.js -> API client + auth header interceptor.
|   |       |-- authApi.js -> JWT endpoint requests.
|   |       |-- userApi.js -> User/profile/subscription requests.
|   |       |-- productApi.js -> Product + moderation + report requests.
|   |       |-- couponApi.js -> Coupon CRUD + validation requests.
|   |       |-- paymentApi.js -> Payment intent request.
|   |       `-- statisticsApi.js -> Dashboard statistics request.
|   |-- lib/
|   |   `-- firebase/
|   |       `-- firebaseClient.js -> Lazy Firebase auth module loader.
|   |-- shared/
|   |   |-- components/
|   |   |   |-- NavBar.jsx -> Global top navigation.
|   |   |   `-- Footer.jsx -> Global footer.
|   |   |-- hooks/
|   |   |   `-- useDocumentTitle.jsx -> Route-aware title helper.
|   |   |-- lib/
|   |   |   `-- alert.js -> Lazy SweetAlert utility wrapper.
|   |   `-- ui/
|   |       |-- Button.jsx, FormInput.jsx, FormTextarea.jsx, FormCheckbox.jsx -> Shared form primitives.
|   |       |-- Panel.jsx, SectionHeader.jsx -> Shared layout blocks.
|   |       |-- LazyRoute.jsx, PageLoader.jsx -> Lazy loading wrappers.
|   |       |-- charts/
|   |       |   |-- DonutChart.jsx -> Lightweight custom SVG donut chart.
|   |       |   `-- MetricBarChart.jsx -> Metric bar visualization.
|   |       `-- form/
|   |           `-- TagInputField.jsx -> Lightweight tag entry field.
|   |-- main.jsx -> App bootstrap with Redux Provider + AuthProvider.
|   `-- index.css -> Global Tailwind-driven styles.
|-- public/
|   |-- _redirects -> SPA redirect rules.
|   `-- vite.svg
|-- vite.config.js -> Alias + vendor chunk strategy.
|-- tailwind.config.js -> Tailwind theme config.
|-- jsconfig.json -> Path alias mapping.
|-- firebase.json -> Firebase hosting config.
`-- README.md
```

#### Backend (`tech-elevate-server`)

```text
tech-elevate-server/
|-- index.js -> Server entrypoint, MongoDB startup check, and local listener.
|-- src/
|   |-- app.js -> Express bootstrap, middleware pipeline, and route registration.
|   |-- config/
|   |   |-- cors.js -> Allowed origins + credential settings.
|   |   |-- db.js -> MongoDB client/db/collection exports + connect helper.
|   |   |-- env.js -> Environment variable loading + centralized config export.
|   |   `-- stripe.js -> Stripe SDK initialization.
|   |-- constants/
|   |   |-- product.js -> Product status constants.
|   |   `-- user.js -> User role constants.
|   |-- controllers/
|   |   |-- auth.controller.js
|   |   |-- coupon.controller.js
|   |   |-- payment.controller.js
|   |   |-- product.controller.js
|   |   |-- review.controller.js
|   |   |-- statistics.controller.js
|   |   `-- user.controller.js
|   |-- middleware/
|   |   |-- authenticateToken.js
|   |   |-- errorHandler.js
|   |   `-- notFound.js
|   |-- routes/
|   |   |-- auth.routes.js
|   |   |-- coupon.routes.js
|   |   |-- payment.routes.js
|   |   |-- product.routes.js
|   |   |-- review.routes.js
|   |   |-- statistics.routes.js
|   |   |-- user.routes.js
|   |   `-- index.js
|   |-- services/
|   |   |-- auth.service.js
|   |   |-- coupon.service.js
|   |   |-- payment.service.js
|   |   |-- product.service.js
|   |   |-- review.service.js
|   |   |-- statistics.service.js
|   |   `-- user.service.js
|   `-- utils/
|       |-- asyncHandler.js
|       |-- httpError.js
|       `-- objectId.js
|-- vercel.json
|-- package.json
`-- README.md
```

### 2. State Management Approach

Frontend uses **Redux Toolkit** with domain-based slices:

- **`auth`**: Firebase auth session, JWT sync, user profile, and role state.
- **`products`**: Home feeds, accepted products, detail, review, upvote/report, moderation queue.
- **`admin`**: users, coupons, and statistics management state.

Why this approach:

- predictable async lifecycles with `createAsyncThunk`,
- clear separation by domain,
- scalable selector-driven rendering.

### 3. Route and Access Model

- Public routes: `/`, `/login`, `/register`
- Auth-only routes: `/products`, `/products/:id`, `/user-dashboard/*`
- Moderator routes: `/moderator-dashboard/*` (moderator/admin)
- Admin routes: `/admin-dashboard/*` (admin only)

Guards are implemented through `PrivateRoute` and `RoleRoute`.

### 4. API Client Pattern

- Centralized Axios client with base URL + JWT header interceptor.
- Service modules isolate endpoint calls (`authApi`, `productApi`, `couponApi`, `userApi`, `paymentApi`, `statisticsApi`).
- Components dispatch thunks or call service wrappers instead of embedding raw HTTP logic.

### 5. Performance Strategy (Current)

- Route-level lazy loading for all major pages.
- Lazy SweetAlert loader (`shared/lib/alert.js`) to avoid eager alert bundle load.
- Home slider extracted into lazy chunk.
- Stripe payment flow loaded on demand from profile modal.
- Manual vendor chunking in `vite.config.js` (`react`, `router`, `firebase`, `stripe`, `alerts`, `slider`, etc.).

---

## API Overview

Base URL (frontend default): `https://tech-elevate-server.vercel.app`

Current frontend integration endpoints:

- **Auth**
  - `POST /jwt`

- **Users**
  - `POST /users`
  - `GET /users?email=`
  - `GET /all-users`
  - `PUT /users/:userId/role`
  - `PUT /update-subscription`

- **Products and Reviews**
  - `GET /products-featured`
  - `GET /products-trending`
  - `GET /accepted-products?page=&search=`
  - `GET /products/:id`
  - `GET /products/:id/reviews`
  - `POST /products/:id/upvote`
  - `POST /products/:id/report`
  - `POST /reviews`
  - `POST /add-products`
  - `GET /products?ownerEmail=`
  - `PUT /products/:id`
  - `DELETE /products/:id`
  - `GET /all-products`
  - `PATCH /update-products/:id`
  - `GET /reported-products`
  - `DELETE /reported/products/:id`

- **Coupons**
  - `GET /coupons`
  - `POST /coupons`
  - `PUT /coupons/:id`
  - `DELETE /coupons/:id`
  - `POST /validate-coupon`

- **Payments**
  - `POST /create-payment-intent`

- **Statistics**
  - `GET /site-statistics`

---

## Technical Decisions

### 1. Libraries and Patterns

- **React + Vite** for fast SPA development and optimized production bundles.
- **Redux Toolkit** for scalable async state orchestration.
- **React Router** for grouped route modules and role-based guards.
- **Tailwind CSS + daisyUI utilities** for responsive UI implementation.
- **Firebase Auth** for identity (email/password + Google).
- **JWT** for backend authorization in API requests.
- **Stripe Elements** for membership payment flow.
- **Axios interceptor architecture** for centralized API concerns.

### 2. Trade-offs Made

- Firebase SDK remains a significant vendor dependency due to auth-first UX.
- Stripe flow is production-ready in code, but requires valid publishable and secret keys.
- Coupon, payment, and moderation reliability depends on backend deployment/env parity.

### 3. Future Improvements

- Add automated test coverage (unit + integration + e2e).
- Add request-level observability (structured logs + monitoring).
- Add optimistic UI + cache invalidation strategy for dashboards.
- Add CI gates for lint, build, and API contract checks.

---

## Challenges Faced

### 1. Bundle Size and Startup Cost

- **Problem:** Eager imports for charts, slider, alerts, and payment stack inflated route chunks.
- **Solution:** Applied route-level lazy loading, manual vendor chunking, lazy alert utility, and on-demand Stripe module loading.

### 2. Auth Session Synchronization

- **Problem:** Keeping Firebase auth state, backend JWT, and profile role aligned without race conditions.
- **Solution:** `AuthProvider` + `syncAuthSession` thunk pipeline with centralized state and guarded routing.

### 3. Role-Based Navigation Consistency

- **Problem:** Deep dashboard paths needed safe role enforcement and fallback behavior.
- **Solution:** Route grouping + `RoleRoute` guard with explicit allowed roles and redirects.

---

## Current Completion Snapshot

- Public/auth/product/user/moderator/admin route groups are implemented.
- Redux domain split (`auth/products/admin`) with modular slice/thunk/selector structure is complete.
- Stripe membership payment flow with coupon application is implemented.
- Statistics visualization is implemented with lightweight custom chart components.
- Core performance optimizations and vendor chunk strategy are active.

---

## User Flow (Quick Manual)

1. User lands on home and explores featured/trending products.
2. User signs up or logs in (email/password or Google).
3. Session sync completes and role-based dashboard access is applied.
4. User can upvote/report products and submit reviews.
5. User adds/manages own products from User Dashboard.
6. Moderator reviews pending products and handles reported content.
7. Admin manages users/coupons and monitors platform statistics.
8. User can subscribe via Stripe payment modal and activate membership.

---

## Screenshots

- `images/home.png`
- `images/user-dashboard.png`
- `images/moderator-dashboard.png`
- `images/admin-dashboard.png`
- `images/payment-modal.png`

---

**TechElevate**: Innovating the Future of Technology.

**Developed by Abusaleh Alam Khan (🚀 TechElevate - Product Discovery and Role-Based Moderation Platform)**
