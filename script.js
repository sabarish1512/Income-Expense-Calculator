// Retrieve entries from local storage, or initialize an empty array if none exist
var entries = JSON.parse(localStorage.getItem("entries")) || [];

// Main function to add a new entry
function addEntry() {
    // Get values from input fields
    var description = document.getElementById("description").value;
    var amount = parseFloat(document.getElementById("amount").value);
    var type = document.querySelector("input[name='type']:checked")?.value;

    // Check if inputs are valid
    if (description && !isNaN(amount) && type) {
        // Add entry to the entries array
        entries.push({ description: description, amount: amount, type: type });
        
        // Save entries to local storage and display them
        localStorage.setItem("entries", JSON.stringify(entries));
        displayEntries();
        
        // Reset input fields
        document.getElementById("description").value = "";
        document.getElementById("amount").value = "";
        document.querySelector("input[name='type']").checked = false;
    }
}

// Display all entries and calculate totals
function displayEntries() {
    var incomeTable = document.getElementById("incomeEntries");
    var expenseTable = document.getElementById("expenseEntries");
    
    // Clear existing entries in both tables
    incomeTable.innerHTML = "";
    expenseTable.innerHTML = "";

    var totalIncome = 0;
    var totalExpense = 0;

    // Loop through all entries and add them to the correct table
    for (var i = 0; i < entries.length; i++) {
        var entry = entries[i];
        
        // Create a row for each entry
        var row = `<tr>
            <td class="p-2 border">${entry.description}</td>
            <td class="p-2 border">₹${entry.amount.toFixed(2)}</td>
            <td class="p-2 border">
                <button onclick="editEntry(${i})" class="text-blue-500">Edit</button>
                <button onclick="deleteEntry(${i})" class="text-red-500">Delete</button>
            </td>
        </tr>`;

        // Add income or expense to the correct table and calculate totals
        if (entry.type === "income") {
            incomeTable.innerHTML += row;
            totalIncome += entry.amount;
        } else if (entry.type === "expense") {
            expenseTable.innerHTML += row;
            totalExpense += entry.amount;
        }
    }

    // Update totals in the totals table
    document.getElementById("totalIncome").innerText = "₹" + totalIncome.toFixed(2);
    document.getElementById("totalExpense").innerText = "₹" + totalExpense.toFixed(2);
    document.getElementById("netBalance").innerText = "₹" + (totalIncome - totalExpense).toFixed(2);
}

// Function to edit an entry
function editEntry(index) {
    // Load entry data into input fields for editing
    var entry = entries[index];
    document.getElementById("description").value = entry.description;
    document.getElementById("amount").value = entry.amount;
    document.querySelector(`input[name='type'][value='${entry.type}']`).checked = true;

    // Remove the entry so it can be replaced with the edited version
    entries.splice(index, 1);
    localStorage.setItem("entries", JSON.stringify(entries));
    displayEntries();
}

// Function to delete an entry
function deleteEntry(index) {
    // Remove the selected entry and update local storage and display
    entries.splice(index, 1);
    localStorage.setItem("entries", JSON.stringify(entries));
    displayEntries();
}

// Initialize the display when the page loads
displayEntries();

// Event listener for the add button
document.getElementById("addBtn").addEventListener("click", addEntry);
