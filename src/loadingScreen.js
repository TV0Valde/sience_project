export function showLoadingScreen () {
    let mainContent = document.getElementById('mainContainer');
    let loadingScreen = document.getElementById('loadingScreen');
    loadingScreen.style.display = "flex";
    
    setTimeout(() => {
        loadingScreen.classList.add("hidden");
    
        loadingScreen.addEventListener("transitionend", () => {
            loadingScreen.style.display = "none";
            mainContent.style.display = "block";
        }, { once: true });
    }, 2000);
    }