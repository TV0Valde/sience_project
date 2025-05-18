let mainContainer = document.getElementById('mainContainer');
let loadingScreen = document.getElementById('loadingScreen');
let progressBar = document.getElementById('progress');
let percentageText = document.getElementById('percentage');
let progressValue = 0;
let loadingInterval;

export function showLoadingScreen() {
    progressValue = 0;
    updateProgress();
    
    // Показываем экран загрузки
    loadingScreen.style.display = "flex";
    loadingScreen.classList.remove("hidden");
    
    loadingInterval = setInterval(() => {
        const increment = Math.floor(Math.random() * 5) + 1;
        progressValue = Math.min(progressValue + increment, 100);
        updateProgress();
        
        if (progressValue >= 100) {
            clearInterval(loadingInterval);
            
            setTimeout(() => {
               // loadingScreen.classList.add("hidden");
                loadingScreen.style.display = "none";
                mainContainer.style.display = "block";
            }, 100);
        }
    }, 100);
}

function updateProgress() {
    progressBar.style.width = progressValue + '%';
    percentageText.textContent = progressValue + '%';
}