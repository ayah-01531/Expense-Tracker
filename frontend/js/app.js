// Expense Tracker - frontend logic


//   - async function getExpenses()          fetch(API_URL), return the JSON
const API_URL = "http://localhost:3000/api/expenses";
const tbody=document.getElementById("expensesBody");
document.getElementById("categoryFilter").addEventListener("change", applyFilter);
async function loadExpenses()
{
    
    const response=await fetch(API_URL);
    if (!response.ok) throw new Error("Request failed");

    return  await response.json();
   
}
 

// ---------- Validation ----------

function validateExpenseForm(title, amount) {
  let isValid = true;

  const titleInput = document.getElementById("title");
  const titleError = document.getElementById("titleError");
  const amountInput = document.getElementById("amount");
  const amountError = document.getElementById("amountError");

  titleInput.classList.remove("is-invalid");
  amountInput.classList.remove("is-invalid");
  titleError.textContent = "";
  amountError.textContent = "";

  if (title.trim() === "") {
    titleInput.classList.add("is-invalid");
    titleError.textContent = "Title is required";
    isValid = false;
  }

  if (isNaN(amount) || amount <= 0) {
    amountInput.classList.add("is-invalid");
    amountError.textContent = "Amount must be greater than 0";
    isValid = false;
  }

  return isValid;
}
 



//   - async function addExpense(data)       fetch(API_URL, { method: "POST", ... })
async function addExpense(data)
{
    try {
    const response=await fetch(API_URL,
      {method: "POST", headers: {"Content-Type": "application/json"}, 
      body: JSON.stringify(data)});
    if (!response.ok) {throw new Error("Failed to add expense");}

    const newExpense = await response.json();
        return newExpense;

    
    }
    catch (err) {
    console.error(err);
       alert("Something went wrong while adding the expense.");

  }
 

}
document.getElementById("expenseForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const data = {
    title: document.getElementById("title").value,
    amount: parseFloat(document.getElementById("amount").value),
    category: document.getElementById("category").value,
    date: document.getElementById("date").value
  };

  await addExpense(data);
  await refresh();
  e.target.reset();
});

  refresh();

//   - async function updateExpense(id,data) fetch(API_URL + "/" + id, { method: "PUT", ... })
let currentExpenses = [];

const editModalEl = document.getElementById("editModal");
const editModal = new bootstrap.Modal(editModalEl);

async function updateExpense(id, data) {
  try {
    const response = await fetch(API_URL + "/" + id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (!response.ok) throw new Error("Failed to update expense");

    return await response.json();

  } catch (err) {
    console.error(err);
    alert("Something went wrong while updating the expense.");
  }
}

function editClick(id) {
  const expense = currentExpenses.find(e => e.id === id);
  if (!expense) return;

  document.getElementById("editId").value = expense.id;
  document.getElementById("editTitle").value = expense.title;
  document.getElementById("editAmount").value = expense.amount;
  document.getElementById("editCategory").value = expense.category;
  document.getElementById("editDate").value = expense.date;

  editModal.show();
}

document.getElementById("editForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const id = document.getElementById("editId").value;
  const data = {
    title: document.getElementById("editTitle").value,
    amount: parseFloat(document.getElementById("editAmount").value),
    category: document.getElementById("editCategory").value,
    date: document.getElementById("editDate").value
  };

  await updateExpense(id, data);
  editModal.hide();
  await refresh();
});
//   - async function deleteExpense(id)      fetch(API_URL + "/" + id, { method: "DELETE" })
async function deleteExpense(id) {
  try {
    const response = await fetch(API_URL + "/" + id, { method: "DELETE" });
    if (!response.ok) throw new Error("Failed to delete");
    await refresh();
  } catch (err) {
    console.error(err);
    alert("Couldn't delete the expense.");
  }
}
//   - async function refresh()              get the list, then call renderTable and renderSummary
 async function refresh() {
  showSpinner(); 
  try {
    const expenses = await loadExpenses();
    renderTable(expenses);
    
     applyFilter(); 
  } catch (err) {
    console.error(err);
    tbody.innerHTML = "<tr><td colspan='5'>Couldn't load expenses</td></tr>";
  }
}

  

//   - renderTable(list)                     build the table rows from the array the API returned
 function renderTable(expenses) {
    currentExpenses = expenses;
    renderTableOnly(expenses);
 }
 function renderTableOnly(expenses) {
  tbody.innerHTML = "";

  expenses.forEach(function (expense) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${expense.title}</td>
      <td>${Number(expense.amount).toFixed(2)}  JOD</td>
      <td> <span class="badge text-bg-warning">${expense.category}</span></td>
      <td>${expense.date.split("T")[0]}</td>
      <td>
        <button class="btn btn btn-outline-success "onclick="editClick(${expense.id})">Edit</button>
        <button class="btn btn-outline-danger"onclick="deleteExpense(${expense.id})">Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });

}
//   - renderSummary(list)                   update the summary cards
function renderSummary(expenses) {
  const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const max = expenses.length ? Math.max(...expenses.map(e => Number(e.amount))) : 0;

  document.querySelector("#totalcard .value").textContent = total.toFixed(2)+"  JOD";
  document.querySelector("#countcard .value").textContent = expenses.length;
  document.querySelector("#maxcard .value").textContent = max.toFixed(2)+"  JOD";
}
//   - applyFilter()                         re-render with the list filtered by category
function applyFilter() {
  const selected = document.getElementById("categoryFilter").value;

  const filtered = selected
    ? currentExpenses.filter(e => e.category === selected)
    : currentExpenses;

  renderTableOnly(filtered);
  renderSummary(filtered);
}

//-Spinner----------------------
function showSpinner() {
  const spinnerRow = document.createElement("tr");
  spinnerRow.innerHTML = `
    <td colspan="5" class="text-center p-5">
      <button class="btn btn-success" type="button" disabled>
  <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
  <span role="status">Loading...</span>
</button>
    </td>
  `;
  tbody.innerHTML = "";
  tbody.appendChild(spinnerRow);
}


