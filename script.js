const entryForm = document.getElementById('entry-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const transactionsList = document.getElementById('transactions-list');
const balanceDisplay = document.getElementById('balance');
const incomeDisplay = document.getElementById('money-plus');
const expenseDisplay = document.getElementById('money-minus');
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
entryForm.addEventListener('submit', addTransaction);
function generateID() {
    return Math.floor(Math.random() * 100000);
}
function addTransaction(e) {
    e.preventDefault();
    const transaction = {
        id: generateID(),
        description: descriptionInput.value,
        amount: parseFloat(amountInput.value),
        type: parseFloat(amountInput.value) >= 0 ? 'income' : 'expense'
    };
     transactions.push(transaction);
    updateLocalStorage();
    updateUI();
    descriptionInput.value = '';
    amountInput.value = '';
}
function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}
function updateUI() {
    transactionsList.innerHTML = '';
    let totalIncome = 0;
    let totalExpense = 0;
    transactions.forEach(transaction => {
        const li = document.createElement('li');
        li.innerHTML = `${transaction.description} 
                        <span> $${transaction.amount.toFixed(2)}</span>
                        <button onclick="deleteTransaction(${transaction.id})">✖️</button>`;
        transactionsList.appendChild(li);
         if (transaction.amount >= 0) {
            totalIncome += transaction.amount;
        } else {
            totalExpense += transaction.amount;
        }
    });

    updateBalance(totalIncome, totalExpense);
}
function updateBalance(totalIncome, totalExpense) {
    const total = totalIncome + totalExpense;
    balanceDisplay.textContent = `$${total.toFixed(2)}`;
    incomeDisplay.textContent = `+$${totalIncome.toFixed(2)}`;
    expenseDisplay.textContent = `-$${Math.abs(totalExpense.toFixed(2))}`;
}
function deleteTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    updateLocalStorage();
    updateUI();
}
function resetForm() {
    descriptionInput.value = '';
    amountInput.value = '';
    transactions = [];
    updateLocalStorage();
    updateUI();
}


// Initial UI update on page load
updateUI();
