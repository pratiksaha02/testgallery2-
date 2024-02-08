const express = require("express");
const session = require("express-session");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const app = express();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

// Configure session middleware
app.use(session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
}));

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, "public")));

// Parse URL-encoded bodies for form data
app.use(express.urlencoded({ extended: true }));

// Set up routes
app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.post("/login", (req, res) => {
    // Handle login logic here
    // Check credentials and set session variables
    req.session.loggedIn = true; // Example: Set loggedIn session variable
    res.redirect("/dashboard");
});

app.get("/dashboard", (req, res) => {
    // Check if user is logged in
    if (!req.session.loggedIn) {
        return res.redirect("/");
    }
    res.render("dashboard.ejs");
});

app.post("/upload", upload.single("photo"), (req, res) => {
    // Handle file upload logic here
    // Save uploaded file details in database or store in a separate folder
    res.redirect("/dashboard");
});

app.get("/portfolio", (req, res) => {
    // Retrieve uploaded photos from the 'uploads' folder
    fs.readdir("./uploads", (err, files) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Internal Server Error");
        }
        // Render the portfolio view with the list of photos
        res.render("portfolio.ejs", { photos: files });
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
