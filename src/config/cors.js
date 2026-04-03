const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://tech-elevate-server.vercel.app",
    "https://tech-elevate.web.app",
    "https://tech-elevate.firebaseapp.com",
  ],
  credentials: true,
};

export default corsOptions;
