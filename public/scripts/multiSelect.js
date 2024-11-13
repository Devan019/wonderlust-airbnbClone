const selectedOptions = new Set();

function toggleOptions() {
    const optionsContainer = document.getElementById("multiSelectOptions");
    optionsContainer.style.display = optionsContainer.style.display === "block" ? "none" : "block";
}

function selectOption(option) {
    if (selectedOptions.has(option)) {
        selectedOptions.delete(option);
    } else {
        selectedOptions.add(option);
    }
    updateSelectedOptions();
}

function updateSelectedOptions() {
    const selectedOptionsContainer = document.getElementById("selectedOptions");
    selectedOptionsContainer.innerHTML = "";

    if (selectedOptions.size > 0) {
        selectedOptions.forEach(option => {
            const optionElement = document.createElement("span");
            optionElement.classList.add("selected-option");
            optionElement.textContent = option;

            // Add an "X" icon for removal
            const removeIcon = document.createElement("i");
            removeIcon.classList.add("fas", "fa-times");
            removeIcon.onclick = (e) => {
                e.stopPropagation(); // Prevent dropdown toggle on click
                removeOption(option);
            };

            optionElement.appendChild(removeIcon);
            selectedOptionsContainer.appendChild(optionElement);
        });
    } else {
        selectedOptionsContainer.textContent = "Select options";
    }
}

function removeOption(option) {
    selectedOptions.delete(option);
    updateSelectedOptions();
}

// Close the dropdown when clicking outside
document.addEventListener("click", (e) => {
    const multiSelect = document.querySelector(".multi-select-container");
    if (!multiSelect.contains(e.target)) {
        document.getElementById("multiSelectOptions").style.display = "none";
    }
});