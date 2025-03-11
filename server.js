const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const crypto = require("crypto"); 

const app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let posts = []; 

// Generate a session ID only when visiting /login
app.get("/login", (req, res) => {
  res.clearCookie("sid");
  const sessionId = crypto.randomUUID(); 
  res.cookie("sid", sessionId, { httpOnly: false }); 
  res.send(`<h1>Welcome, User ${sessionId}</h1><a href="/">Home</a>`);
});

// Endpoints:

app.get("/", (req, res) => {
  res.send(`
    <h1>Welcome</h1>
    <p><strong>Instructions:</strong></p>
    <ol>
      <li><a href="/login">Click here to Login</a> and note your session ID.</li>
      <li>Return to this page (<a href="/">Home</a>) and try to steal it!!</li>   
    </ol>

    <form id="postForm1">
      <input type="text" id="input1" placeholder="Post something">
      <button type="submit">Submit</button>
    </form>

    <form id="postForm2">
      <input type="text" id="input2" placeholder="Post something">
      <button type="submit">Submit</button>
    </form>

    <form id="postForm3">
      <input type="text" id="input3" placeholder="Post something">
      <button type="submit">Submit</button>
    </form>

    <h3>Posts:</h3>
    <div id="posts"></div>

    <script>
      document.getElementById("postForm1").addEventListener("submit", function(event) {
        event.preventDefault();
        const inputField = document.getElementById("input1");

        fetch("/post1", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: inputField.value })
        }).then(() => {
          inputField.value = ""; // Clears input field
          loadPosts();
        });
      });

      document.getElementById("postForm2").addEventListener("submit", function(event) {
        event.preventDefault();
        const inputField = document.getElementById("input2");

        fetch("/post2", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: inputField.value })
        }).then(() => {
          inputField.value = ""; // Clears input field
          loadPosts();
        });
      });

      document.getElementById("postForm3").addEventListener("submit", function(event) {
        event.preventDefault();
        const inputField = document.getElementById("input3");

        fetch("/post3", {
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




app.post("/post1", (req, res) => {
  if (req.body.content) {
    const sanitizedContent = req.body.content
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    posts.push(sanitizedContent);
    res.send("Post saved!");
  } else {
    res.send("Error: Empty post!");
  }
});


app.post("/post2", (req, res) => {
  if (req.body.content) {
    posts.push(req.body.content); 
    res.send("Post saved!");
  } else {
    res.send("Error: Empty post!");
  }
});


app.post("/post3", (req, res) => {
  if (req.body.content) {
    const sanitizedContent = req.body.content
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    posts.push(sanitizedContent);
    res.send("Post saved!"); 
  } else {
    res.send("Error: Empty post!");
  }
});


app.get("/posts", (req, res) => {
  res.setHeader("Content-Type", "text/html"); 
  res.send(posts.join("<br>")); 
});


app.listen(3000, () =>
  console.log("Server running on http://localhost:3000")
);
