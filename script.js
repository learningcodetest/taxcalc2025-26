document.addEventListener("DOMContentLoaded", function() {
  const calculateBtn = document.getElementById("calculateBtn");
  const explainBtn = document.getElementById("explainBtn");
  const incomeInput = document.getElementById("incomeInput");
  const taxOutput = document.getElementById("taxOutput");
  const modal = document.getElementById("modal");
  const modalBody = document.getElementById("modalBody");
  const closeModal = document.getElementById("closeModal");
  const modeToggle = document.getElementById("modeToggle");
  const modeIcon = document.getElementById("modeIcon");

  // Load saved mode from localStorage if available.
  let darkMode = localStorage.getItem("darkMode") === "true";

  function updateMode() {
    if (darkMode) {
      document.body.classList.add("dark");
      modeIcon.textContent = "☀️"; // Sun icon indicates clicking will switch to light mode.
    } else {
      document.body.classList.remove("dark");
      modeIcon.textContent = "🌙"; // Moon icon indicates clicking will switch to dark mode.
    }
    localStorage.setItem("darkMode", darkMode);
  }

  updateMode();

  modeToggle.addEventListener("click", function() {
    darkMode = !darkMode;
    updateMode();
  });

  calculateBtn.addEventListener("click", function() {
    const income = parseFloat(incomeInput.value);
    if (isNaN(income)) {
      taxOutput.textContent = "Invalid input";
      modalBody.textContent = "Please enter a valid numerical income.";
      return;
    }
    
    const deduction = 75000;
    let taxableIncome = income - deduction;
    if (taxableIncome < 0) taxableIncome = 0;
    
    let explanation = `Your annual income is ₹${income.toFixed(2)}.\n`;
    explanation += `After a standard deduction of ₹${deduction.toFixed(2)}, your taxable income becomes ₹${taxableIncome.toFixed(2)}.\n\n`;
    
    if (taxableIncome <= 1200000) {
      explanation += `Since your taxable income is less than or equal to ₹1,200,000, no tax is applicable.`;
      taxOutput.textContent = "₹0.00";
      modalBody.textContent = explanation;
      return;
    }
    
    explanation += `Since your taxable income exceeds ₹1,200,000, tax is calculated as follows:\n\n`;
    let tax = 0;
    let remainingIncome = taxableIncome;
    
    // First ₹400,000 is tax-free.
    const freeSlab = 400000;
    const freeAmount = Math.min(remainingIncome, freeSlab);
    explanation += `• The first ₹${freeAmount.toFixed(2)} is tax-free.\n`;
    if (remainingIncome > freeSlab) {
      remainingIncome -= freeSlab;
    } else {
      remainingIncome = 0;
    }
    
    // Define tax slabs.
    const slabs = [
      { limit: 400000, rate: 0.05, label: "5%" },
      { limit: 400000, rate: 0.10, label: "10%" },
      { limit: 400000, rate: 0.15, label: "15%" },
      { limit: 400000, rate: 0.20, label: "20%" },
      { limit: 400000, rate: 0.25, label: "25%" }
    ];
    
    let slabIndex = 1;
    for (const slab of slabs) {
      if (remainingIncome <= 0) break;
      const amountInThisSlab = Math.min(remainingIncome, slab.limit);
      const slabTax = amountInThisSlab * slab.rate;
      tax += slabTax;
      explanation += `• Slab ${slabIndex}: Next ₹${amountInThisSlab.toFixed(2)} at ${slab.label} = ₹${slabTax.toFixed(2)}\n`;
      remainingIncome -= amountInThisSlab;
      slabIndex++;
    }
    
    if (remainingIncome > 0) {
      const extraTax = remainingIncome * 0.30;
      tax += extraTax;
      explanation += `• Remaining ₹${remainingIncome.toFixed(2)} at 30% = ₹${extraTax.toFixed(2)}\n`;
    }
    
    const cess = tax * 0.04;
    tax += cess;
    explanation += `\n• Adding 4% CESS: ₹${cess.toFixed(2)}\n`;
    explanation += `\nTotal tax liability is ₹${tax.toFixed(2)}.`;
    
    taxOutput.textContent = "₹" + tax.toFixed(2);
    modalBody.textContent = explanation;
  });
  
  explainBtn.addEventListener("click", function() {
    modal.style.display = "block";
  });
  
  closeModal.addEventListener("click", function() {
    modal.style.display = "none";
  });
  
  // Close modal when clicking outside modal content.
  window.addEventListener("click", function(event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
});
