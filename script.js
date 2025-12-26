const text = "Hey 👋 Before we begin...";
let index = 0;

function typeText() {
  if (index < text.length) {
    document.getElementById("typingText").innerHTML += text.charAt(index);
    index++;
    setTimeout(typeText, 80);
  }
}
typeText();

function goNext() {
  const name = document.getElementById("username").value;
  const relation = document.getElementById("relation").value;

  if (!name || !relation) {
    alert("Please fill both fields 😄");
    return;
  }

  document.getElementById("bgMusic").play();

  alert(`Hey ${name}! (${relation}) 💖\nLet’s continue...`);
}

// Floating hearts
setInterval(() => {
  const heart = document.createElement("span");
  heart.innerHTML = "❤️";
  heart.style.left = Math.random() * 100 + "vw";
  document.querySelector(".hearts").appendChild(heart);

  setTimeout(() => heart.remove(), 6000);
}, 800);
