// Expense Tracker - frontend logic

// PHASE 2
// Your backend from Phase 1 is already running, with real expenses in the
// database (from schema.sql). Build this page directly against it with
// fetch and async/await - there is no in-memory or localStorage stage
// this time, and no sample data file.
//
// A possible structure (change it if you have a better idea):
//   - async function getExpenses()          fetch(API_URL), return the JSON
const API_URL = "http://localhost:3000/api/expenses";
const tbody=document.getElementById("expensesBody");
async function loadExpenses()
{
    
    const response=await fetch(API_URL);
    if (!response.ok) throw new Error("Request failed");

    return  await response.json();
   
}
  function renderTable(expenses) {
    currentExpenses = expenses;
  tbody.innerHTML = "";

  expenses.forEach(function (expense) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${expense.title}</td>
      <td>${Number(expense.amount).toFixed(2)}  JOD</td>
      <td> <span class="badge text-bg-warning">${expense.category}</span></td>
      <td>${expense.date}</td>
      <td>
        <button class="btn btn btn-outline-success "onclick="editClick(${expense.id})">Edit</button>
        <button class="btn btn-outline-danger">Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });

}
function renderSummary(expenses) {
  const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const max = expenses.length ? Math.max(...expenses.map(e => Number(e.amount))) : 0;

  document.querySelector("#totalcard .value").textContent = total.toFixed(2)+"  JOD";
  document.querySelector("#countcard .value").textContent = expenses.length;
  document.querySelector("#maxcard .value").textContent = max.toFixed(2)+"  JOD";
}
  


  async function refresh() {
  try {
    const expenses = await loadExpenses();
    renderTable(expenses);
    renderSummary(expenses);
  } catch (err) {
    console.error(err);
    tbody.innerHTML = "<tr><td colspan='5'>Couldn't load expenses</td></tr>";
  }
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
let currentExpenses = [];   // تأكدي إنها معرّفة مرة وحدة بس بالملف

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
//   - renderTable(list)                     build the table rows from the array the API returned
//   - renderSummary(list)                   update the summary cards
//   - applyFilter()                         re-render with the list filtered by category
//
// Don't forget:
//   - Show a Bootstrap spinner while a request is in flight.
//   - Wrap every fetch call in try/catch, and show a Bootstrap alert on failure.
//   - After add, edit, or delete, call refresh() so the page always shows
//     what the server actually saved - never update the table by hand.
//   - The API is at http://localhost:3000/api/expenses (see the Roadmap).

