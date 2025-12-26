let userName = "";
let relation = "";

const typingText = "Hey 👋 Before we begin...";
let index = 0;

function typeEffect() {
  if (index < typingText.length) {
    document.getElementById("typingText").innerHTML += typingText.charAt(index);
    index++;
    setTimeout(typeEffect, 80);
  }
}
typeEffect();

function goNext() {
  userName = document.getElementById("username").value.trim();
  relation = document.getElementById("relation").value.trim();

  if (!userName || !relation) {
    alert("Please fill both fields 😄");
    return;
  }

  document.getElementById("page1").classList.remove("active");
  document.getElementById("page2").classList.add("active");

  document.getElementById("greetText").innerText =
    `Hey ${userName} 👀 (${relation})`;
}

function answer(type) {
  let msg = "";
  if (type === "yes") msg = "Perfect! Party confirmed 🎉";
  if (type === "no") msg = "Arre yaar 😒 You have to come!";
  if (type === "maybe") msg = "Maybe nahi chalega 😏";

  document.getElementById("page2").classList.remove("active");
  document.getElementById("page3").classList.add("active");
  document.getElementById("finalText").innerText = msg;
}

function showInvite() {
  document.getElementById("page3").classList.remove("active");
  document.getElementById("page4").classList.add("active");

  const music = document.getElementById("bgMusic");
  music.play();
}
