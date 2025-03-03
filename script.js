document.addEventListener("DOMContentLoaded", function () {
    var transactionForm = document.getElementById("transactionForm");
    var transactionList = document.getElementById("transactionList");
    var totalIncome = document.getElementById("totalIncome");
    var totalExpense = document.getElementById("totalExpense");
    var balance = document.getElementById("balance");
    var resetBtn = document.getElementById("resetBtn");

    // Load transactions from localStorage
    var transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    // Function to update the UI
    function updateUI() {
        transactionList.innerHTML = "";
        var incomeTotal = 0, expenseTotal = 0;

        var selectedFilter = document.querySelector('input[name="filter"]:checked').value;

        // Loop through transactions and display them
        transactions.forEach(function (transaction, index) {
            if (selectedFilter !== "all" && transaction.type !== selectedFilter) return;

            var li = document.createElement("li");
            li.className = "flex justify-between p-2 border rounded bg-gray-100";
            li.innerHTML = `
                <span>${transaction.description} - ₹${transaction.amount}</span>
                <div>
                    <button onclick="editTransaction(${index})" class="text-yellow-500 mr-2">Edit</button>
                    <button onclick="deleteTransaction(${index})" class="text-red-500">Delete</button>
                </div>
            `;
            transactionList.appendChild(li);

            // Calculate total income and expenses
            if (transaction.type === "income") incomeTotal += transaction.amount;
            else expenseTotal += transaction.amount;
        });

        // Update total income, expense, and balance
        totalIncome.textContent = incomeTotal;
        totalExpense.textContent = expenseTotal;
        balance.textContent = incomeTotal - expenseTotal;

        // Save updated transactions to localStorage
        localStorage.setItem("transactions", JSON.stringify(transactions));
    }

    // Function to handle form submission (Adding a transaction)
    transactionForm.addEventListener("submit", function (event) {
        event.preventDefault();

        var description = document.getElementById("description").value.trim();
        var amount = parseFloat(document.getElementById("amount").value);
        var type = document.getElementById("type").value;

        if (description === "" || isNaN(amount) || amount <= 0) return;

        // Add new transaction
        transactions.push({ description: description, amount: amount, type: type });
        transactionForm.reset();
        updateUI();
    });

    // Delete transaction
    window.deleteTransaction = function (index) {
        transactions.splice(index, 1);
        updateUI();
    };

    // Edit transaction
    window.editTransaction = function (index) {
        var transaction = transactions[index];
        document.getElementById("description").value = transaction.description;
        document.getElementById("amount").value = transaction.amount;
        document.getElementById("type").value = transaction.type;
        transactions.splice(index, 1);
        updateUI();
    };

    // Reset button to clear input fields
    resetBtn.addEventListener("click", function () {
        transactionForm.reset();
    });

    // Filter functionality
    document.querySelectorAll('input[name="filter"]').forEach(function (radio) {
        radio.addEventListener("change", updateUI);
    });

    // Initial UI update on page load
    updateUI();
});

