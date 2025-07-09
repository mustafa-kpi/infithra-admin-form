
const steps = document.querySelectorAll(".step");
const circles = document.querySelectorAll(".step-circle");
const lines = document.querySelectorAll(".step-line");
const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");
const submitButton = document.getElementById("submitButton");
let currentStep = 0;

function updateStepIndicator(index) {
    circles.forEach((circle, i) => {
        circle.classList.toggle("active", i <= index);
    });
    lines.forEach((line, i) => {
        line.classList.toggle("active", i < index);
    });
}

function showStep(index) {
    steps.forEach((step, i) => {
        step.classList.toggle("step-hidden", i !== index);
    });
    updateStepIndicator(index);
    // prevButton.disabled = index === 0;
    nextButton.style.display = index === steps.length - 1 ? "none" : "inline-block";
    submitButton.style.display = index === steps.length - 1 ? "inline-block" : "none";
}

prevButton.addEventListener("click", () => {
    if( currentStep === 0 ){
        companyFormContainer.classList.add('hidden');
        companyList.classList.remove('hidden');
        resetForm();
    }

    if (currentStep > 0) {
        currentStep--;
        showStep(currentStep);
    }

    if (currentStep === 0){
        prevBtn.textContent = 'Cancel';
    }
});

nextButton.addEventListener("click", () => {
    if (currentStep < steps.length - 1) {
        currentStep++;
        prevBtn.textContent = 'Previous';
        showStep(currentStep);
    }
});

// document.getElementById("companyForm").addEventListener("submit", (e) => {
//     e.preventDefault();
//     alert("Form submitted successfully!");
// });


showStep(currentStep);