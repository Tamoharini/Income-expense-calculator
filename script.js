const entryForm = document.getElementById('entry-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const typeInput = document.getElementById('type');

const transactionsList = document.getElementById('transactions-list');

const balanceDisplay = document.getElementById('balance');
const incomeDisplay = document.getElementById('money-plus');
const expenseDisplay = document.getElementById('money-minus');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let editID = null;


entryForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const newData = {
        id: editID || Date.now(),
        description: descriptionInput.value,
        amount: parseFloat(amountInput.value),
        type: typeInput.value
    };

    if (editID) {
        transactions = transactions.map(t => (t.id === editID ? newData : t));
        editID = null;
    } else {
        transactions.push(newData);
    }

    updateLocalStorage();
    updateUI();
    entryForm.reset();
});


function updateLocalStorage() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

function updateUI() {
    transactionsList.innerHTML = "";

    let totalIncome = 0;
    let totalExpense = 0;

    const filter = document.querySelector('input[name="filter"]:checked').value;

    transactions
        .filter(t => filter === "all" || t.type === filter)
        .forEach(transaction => {

            const li = document.createElement("li");

            li.innerHTML = `
                ${transaction.description} - $${transaction.amount.toFixed(2)}
                <div class="action-btns">
                    <button class="edit" onclick="editTransaction(${transaction.id})">✏️</button>
                    <button class="delete" onclick="deleteTransaction(${transaction.id})">🗑️</button>
                </div>
            `;

            transactionsList.appendChild(li);
        });

    
    transactions.forEach(t => {
        if (t.type === "income") totalIncome += t.amount;
        else totalExpense += t.amount;
    });

    balanceDisplay.textContent = `$${(totalIncome - totalExpense).toFixed(2)}`;
    incomeDisplay.textContent = `$${totalIncome.toFixed(2)}`;
    expenseDisplay.textContent = `$${totalExpense.toFixed(2)}`;
}

function editTransaction(id) {
    const t = transactions.find(x => x.id === id);

    descriptionInput.value = t.description;
    amountInput.value = t.amount;
    typeInput.value = t.type;

    editID = id;
}


function deleteTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    updateLocalStorage();
    updateUI();
}


function resetData() {
    transactions = [];
    updateLocalStorage();
    updateUI();
}


document.querySelectorAll('input[name="filter"]').forEach(radio => {
    radio.addEventListener("change", updateUI);
});

updateUI();
