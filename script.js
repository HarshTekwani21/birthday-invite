// Global variables
let userName = "";
let relation = "";
let availability = "";
let personalizedMessage = "";

// Typing effect for the first page
const typingText = "Hey 👋 Before we begin...";
let index = 0;

function typeEffect() {
  if (index < typingText.length) {
    document.getElementById("typingText").innerHTML += typingText.charAt(index);
    index++;
    setTimeout(typeEffect, 80);
  }
}

// Initialize typing effect when page loads
window.addEventListener('load', () => {
  typeEffect();
  
  // Add music control
  const musicControl = document.createElement('div');
  musicControl.className = 'music-control';
  musicControl.onclick = toggleMusic;
  document.body.appendChild(musicControl);
  
  // Try to play music with user interaction
  document.addEventListener('click', function initAudio() {
    const music = document.getElementById("bgMusic");
    music.volume = 0.3;
    music.play().catch(e => console.log('Audio play failed:', e));
    document.removeEventListener('click', initAudio);
  }, { once: true });
});

// Toggle background music
function toggleMusic() {
  const music = document.getElementById("bgMusic");
  if (music.paused) {
    music.play();
  } else {
    music.pause();
  }
}

// Navigate to next page
function goNext() {
  userName = document.getElementById("username").value.trim();
  relation = document.getElementById("relation").value.trim();

  if (!userName || !relation) {
    showNotification("Please fill both fields 😄");
    return;
  }

  // Add transition effect
  const currentPage = document.querySelector('.page.active');
  currentPage.style.opacity = '0';
  currentPage.style.transform = 'translateY(20px)';
  
  setTimeout(() => {
    document.getElementById("page1").classList.remove("active");
    document.getElementById("page2").classList.add("active");
    
    // Update greeting text
    document.getElementById("greetText").innerText = 
      `Hey ${userName} 👀 (${relation})`;
    
    // Animate new page
    const newPage = document.getElementById("page2");
    newPage.style.opacity = '1';
    newPage.style.transform = 'translateY(0)';
  }, 300);
}

// Handle availability answer
function answer(type) {
  availability = type;
  let msg = "";
  
  if (type === "yes") {
    msg = "Perfect! Party confirmed 🎉";
  } else if (type === "no") {
    msg = "Arre yaar 😒 You have to come!";
  } else if (type === "maybe") {
    msg = "Maybe nahi chalega 😏";
  }

  // Add transition effect
  const currentPage = document.querySelector('.page.active');
  currentPage.style.opacity = '0';
  currentPage.style.transform = 'translateY(20px)';
  
  setTimeout(() => {
    document.getElementById("page2").classList.remove("active");
    document.getElementById("page3").classList.add("active");
    document.getElementById("finalText").innerText = msg;
    
    // Animate new page
    const newPage = document.getElementById("page3");
    newPage.style.opacity = '1';
    newPage.style.transform = 'translateY(0)';
    
    // Show loading and generate personalized message
    generatePersonalizedMessage();
  }, 300);
}

// Generate personalized message from HuggingFace API
async function generatePersonalizedMessage() {
  const loadingIndicator = document.getElementById("loadingIndicator");
  const continueBtn = document.getElementById("continueBtn");
  
  loadingIndicator.style.display = "flex";
  continueBtn.style.display = "none";
  
  try {
    // Call the serverless function
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: userName,
        relation: relation,
        availability: availability
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to generate message');
    }
    
    const data = await response.json();
    personalizedMessage = data.message;
    
    // Animate the message
    animateText(personalizedMessage);
    
  } catch (error) {
    console.error('Error generating message:', error);
    // Fallback message
    personalizedMessage = `Hey ${userName}! Your presence would make my birthday special. Looking forward to celebrating with you on 18th January! 🎂🎉`;
    animateText(personalizedMessage);
  } finally {
    loadingIndicator.style.display = "none";
    continueBtn.style.display = "inline-block";
  }
}

// Animate text typing effect
function animateText(text) {
  const messageElement = document.getElementById("personalizedMessage");
  messageElement.innerHTML = '';
  messageElement.style.opacity = '0';
  
  let i = 0;
  function typeWriter() {
    if (i < text.length) {
      messageElement.innerHTML += text.charAt(i);
      i++;
      setTimeout(typeWriter, 30);
    } else {
      // Fade in the complete message
      setTimeout(() => {
        messageElement.style.opacity = '1';
      }, 100);
    }
  }
  
  typeWriter();
}

// Show final invitation
function showInvite() {
  // Add transition effect
  const currentPage = document.querySelector('.page.active');
  currentPage.style.opacity = '0';
  currentPage.style.transform = 'translateY(20px)';
  
  setTimeout(() => {
    document.getElementById("page3").classList.remove("active");
    document.getElementById("page4").classList.add("active");
    
    // Animate new page
    const newPage = document.getElementById("page4");
    newPage.style.opacity = '1';
    newPage.style.transform = 'translateY(0)';
    
    // Play background music
    const music = document.getElementById("bgMusic");
    music.play();
    
    // Add celebration effect
    createConfetti();
  }, 300);
}

// Show notification instead of alert
function showNotification(message) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(255, 77, 109, 0.9);
    color: white;
    padding: 15px 25px;
    border-radius: 25px;
    font-size: 16px;
    z-index: 1000;
    animation: slideDown 0.3s ease;
  `;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideUp 0.3s ease';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Create confetti effect
function createConfetti() {
  const colors = ['#ff4d6d', '#ff9a9e', '#fad0c4', '#fff', '#ffeb3b'];
  const confettiCount = 50;
  
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.style.cssText = `
      position: fixed;
      width: 10px;
      height: 10px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      top: -10px;
      left: ${Math.random() * 100}%;
      z-index: 999;
      animation: fall ${Math.random() * 3 + 2}s linear forwards;
      transform: rotate(${Math.random() * 360}deg);
    `;
    
    document.body.appendChild(confetti);
    
    setTimeout(() => {
      document.body.removeChild(confetti);
    }, 5000);
  }
}

// Add CSS animations for notifications and confetti
const style = document.createElement('style');
style.textContent = `
  @keyframes slideDown {
    from {
      transform: translate(-50%, -100%);
      opacity: 0;
    }
    to {
      transform: translate(-50%, 0);
      opacity: 1;
    }
  }
  
  @keyframes slideUp {
    from {
      transform: translate(-50%, 0);
      opacity: 1;
    }
    to {
      transform: translate(-50%, -100%);
      opacity: 0;
    }
  }
  
  @keyframes fall {
    to {
      transform: translateY(100vh) rotate(360deg);
    }
  }
`;
document.head.appendChild(style);
