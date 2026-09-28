// Expense Tracker - frontend logic

// PHASE 2
// Your backend from Phase 1 is already running, with real expenses in the
// database (from schema.sql). Build this page directly against it with
// fetch and async/await - there is no in-memory or localStorage stage
// this time, and no sample data file.
//
// A possible structure (change it if you have a better idea):
//   - async function getExpenses()          fetch(API_URL), return the JSON
const tbody=document.getElementById("expensesBody");
async function loadExpenses()
{
    try {
    const response=await fetch("http://localhost:3000/api/expenses");
    if (!response.ok) throw new Error("Request failed");

    const expenses = await response.json();
    renderTable(expenses);
    }
    catch (err) {
    console.error(err);
    tbody.innerHTML = "<tr><td colspan='5'>Couldn't load expenses</td></tr>";
  }
  function renderTable(expenses) {
  tbody.innerHTML = "";

  expenses.forEach(function (expense) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${expense.title}</td>
      <td>$${Number(expense.amount).toFixed(2)}</td>
      <td>${expense.category}</td>
      <td>${expense.date}</td>
      <td>
        <button>Edit</button>
        <button>Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}
}
  loadExpenses();



//   - async function addExpense(data)       fetch(API_URL, { method: "POST", ... })
//   - async function updateExpense(id,data) fetch(API_URL + "/" + id, { method: "PUT", ... })
//   - async function deleteExpense(id)      fetch(API_URL + "/" + id, { method: "DELETE" })
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

const API_URL = "http://localhost:3000/api/expenses";
