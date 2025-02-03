function calculateTax() {
  const income = parseFloat(document.getElementById("income").value);
  const taxLiabilityElement = document.getElementById("taxLiability");
  const explanationTextElement = document.getElementById("explanationText");

  if (isNaN(income)) {
    taxLiabilityElement.textContent = "Invalid input";
    explanationTextElement.textContent = "Please enter a valid numerical income.";
    return;
  }

  const deduction = 75000;
  let taxableIncome = income - deduction;
  if (taxableIncome < 0) taxableIncome = 0;

  let explanation = `Your annual income is ₹${income.toFixed(2)}.\n`;
  explanation += `After a standard deduction of ₹${deduction.toFixed(2)}, your taxable income becomes ₹${taxableIncome.toFixed(2)}.\n\n`;

  if (taxableIncome <= 1200000) {
    explanation += "Since your taxable income is less than or equal to ₹1,200,000, no tax is applicable.";
    taxLiabilityElement.textContent = "₹0.00";
    explanationTextElement.textContent = explanation;
    return;
  }

  explanation += "Since your taxable income exceeds ₹1,200,000, tax is calculated as follows:\n\n";

  let tax = 0;
  let remainingIncome = taxableIncome;

  // First ₹400,000 is tax-free.
  const freeSlab = 400000;
  const freeAmount = Math.min(remainingIncome, freeSlab);
  explanation += `• The first ₹${freeAmount.toFixed(2)} is tax-free.\n`;
  remainingIncome -= freeAmount;

  // Successive slabs
  const slabs = [
    { limit: 400000, rate: 0.05, label: "5%" },
    { limit: 400000, rate: 0.10, label: "10%" },
    { limit: 400000, rate: 0.15, label: "15%" },
    { limit: 400000, rate: 0.20, label: "20%" },
    { limit: 400000, rate: 0.25, label: "25%" },
  ];

  slabs.forEach((slab, index) => {
    if (remainingIncome <= 0) return;
    const amountInThisSlab = Math.min(remainingIncome, slab.limit);
    const slabTax = amountInThisSlab * slab.rate;
    tax += slabTax;
    explanation += `• Slab ${index + 1}: Next ₹${amountInThisSlab.toFixed(2)} at ${slab.label} = ₹${slabTax.toFixed(2)}\n`;
    remainingIncome -= amountInThisSlab;
  });

  if (remainingIncome > 0) {
    const extraTax = remainingIncome * 0.30;
    tax += extraTax;
    explanation += `• Remaining ₹${remainingIncome.toFixed(2)} at 30% = ₹${extraTax.toFixed(2)}\n`;
  }

  const cess = tax * 0.04;
  tax += cess;
  explanation += `\n• Adding 4% CESS: ₹${cess.toFixed(2)}\n`;
  explanation += `\nTotal tax liability is ₹${tax.toFixed(2)}.`;

  taxLiabilityElement.textContent = `₹${tax.toFixed(2)}`;
  explanationTextElement.textContent = explanation;
}

function showExplanation() {
  document.getElementById("explanationModal").style.display = "flex";
}

function closeModal() {
  document.getElementById("explanationModal").style.display = "none";
}
