// Google OAuth configuration
const configureGoogleSignIn = () => {
  window.google.accounts.id.initialize({
    client_id: "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com",
    callback: handleCredentialResponse,
    auto_select: false,
    prompt_parent_id: "googleSignInContainer"
  });
  
  window.google.accounts.id.renderButton(
    document.getElementById("googleSignInBtn"),
    { 
      theme: "outline", 
      size: "large",
      text: "signin_with",
      shape: "rectangular",
      logo_alignment: "left"
    }
  );
};

function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  return JSON.parse(atob(base64));
}

const handleCredentialResponse = (response) => {
  const responsePayload = parseJwt(response.credential);
  
  console.log("User ID: " + responsePayload.sub);
  console.log("Full Name: " + responsePayload.name);
  console.log("Email: " + responsePayload.email);
  
  // Verify it's the authorized email
  if(responsePayload.email === "bytechainubd@gmail.com") {
    localStorage.setItem("userToken", response.credential);
    window.location.href = "/dashboard.html";
  } else {
    alert("Unauthorized email. Please use bytechainubd@gmail.com");
    window.google.accounts.id.prompt();
  }
};

// Check if user is already logged in
const checkAuth = () => {
  const token = localStorage.getItem("userToken");
  if(token) {
    const payload = parseJwt(token);
    document.getElementById("userEmail").textContent = payload.email;
    document.getElementById("authSection").classList.add("hidden");
    document.getElementById("profileSection").classList.remove("hidden");
  }
};

document.addEventListener("DOMContentLoaded", () => {
  checkAuth();
  if(typeof google !== 'undefined') {
    configureGoogleSignIn();
  }
});
