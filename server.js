const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const crypto = require("crypto"); 

const app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


let profiles = [];
let posts = [];
let comments = [];


app.get("/login", (req, res) => {
  res.clearCookie("sid");
  const sessionId = crypto.randomUUID(); 
  res.cookie("sid", sessionId, { httpOnly: false }); 
  res.send(`<h1>Welcome, User ${sessionId}</h1><a href="/">Home</a>`);
});

//Endpoints
app.get("/", (req, res) => {
  res.send(`
    <h1>Welcome</h1>
    <p><strong>Instructions:</strong></p>
    <ol>
      <li><a href="/login">Click here to Login</a> and note your session ID.</li>
      <li>Return to this page (<a href="/">Home</a>) and try to steal it!!</li>   
    </ol>

    <h3>Profile</h3>
    <form id="profileForm">
      <input type="text" id="profileInput" placeholder="Update Profile">
      <button type="submit">Submit</button>
    </form>

    <h3>Posts</h3>
    <form id="postForm">
      <input type="text" id="postInput" placeholder="Write a Post">
      <button type="submit">Submit</button>
    </form>

    <h3>Comments</h3>
    <form id="commentForm">
      <input type="text" id="commentInput" placeholder="Leave a Comment">
      <button type="submit">Submit</button>
    </form>

    <h3>Submitted Content:</h3>
    <div id="posts"></div>

    <script>
      document.getElementById("profileForm").addEventListener("submit", function(event) {
        event.preventDefault();
        const inputField = document.getElementById("profileInput");

        fetch("/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: inputField.value })
        }).then(() => {
          inputField.value = ""; // Clears input field
          loadPosts();
        });
      });

      document.getElementById("postForm").addEventListener("submit", function(event) {
        event.preventDefault();
        const inputField = document.getElementById("postInput");

        fetch("/post", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: inputField.value })
        }).then(() => {
          inputField.value = ""; // Clears input field
          loadPosts();
        });
      });

      document.getElementById("commentForm").addEventListener("submit", function(event) {
        event.preventDefault();
        const inputField = document.getElementById("commentInput");

        fetch("/comment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: inputField.value })
        }).then(() => {
          inputField.value = ""; // Clears input field
          loadPosts();
        });
      });

      function loadPosts() {
        fetch('/posts')
          .then(res => res.text())
          .then(html => {
            document.getElementById("posts").innerHTML = html;

            // Ensure scripts inside posts execute
            let scripts = document.getElementById("posts").getElementsByTagName("script");
            for (let i = 0; i < scripts.length; i++) {
              eval(scripts[i].innerText); // Executes stored JavaScript
            }
          });
      }
      
      loadPosts();
    </script>
  `);
});


app.post("/profile", (req, res) => {
  if (req.body.content) {
    const sanitizedContent = req.body.content
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    profiles.push(`<p><strong>Profile:</strong> ${sanitizedContent}</p>`);
    res.send("Profile updated!");
  } else {
    res.send("Error: Empty input!");
  }
});

app.post("/post", (req, res) => {
  if (req.body.content) {
    posts.push(`<p><strong>Post:</strong> ${req.body.content}</p>`);
    res.send("Post saved!");
  } else {
    res.send("Error: Empty input!");
  }
});

app.post("/comment", (req, res) => {
  if (req.body.content) {
    const sanitizedContent = req.body.content
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    comments.push(`<p><strong>Comment:</strong> ${sanitizedContent}</p>`);
    res.send("Comment saved!");
  } else {
    res.send("Error: Empty input!");
  }
});


app.get("/posts", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.send([...profiles, ...posts, ...comments].join("<br>"));
});


app.listen(3000, () =>
  console.log("Server running on http://localhost:3000")
);
