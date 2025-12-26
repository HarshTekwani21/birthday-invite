let userName = "";

function goNext() {
  userName = document.getElementById("username").value;
  if (!userName) return alert("Naam likho pehle 😄");

  document.getElementById("page1").classList.remove("active");
  document.getElementById("page2").classList.add("active");
  document.getElementById("greet").innerText =
    "Hey " + userName + " 👀";
}

function answer(type) {
  let msg = "";
  if (type === "yes") msg = "Perfect! Party pakki 🎉";
  if (type === "no") msg = "Arre yaar 😒 aana padega!";
  if (type === "maybe") msg = "Maybe nahi chalega 😏";

  document.getElementById("page2").classList.remove("active");
  document.getElementById("page3").classList.add("active");
  document.getElementById("responseText").innerText = msg;
}

function showInvite() {
  document.getElementById("page3").classList.remove("active");
  document.getElementById("page4").classList.add("active");
}
