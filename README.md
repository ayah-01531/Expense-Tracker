# Expense Tracker

A simple web app to track daily expenses. You can add, edit, delete, and filter expenses by category and month, and see a quick summary of your spending.

## How to run


**Backend**

1. Open a terminal inside the `backend` folder and run:( npm install)

2. Open PostgreSQL and create a new database (for example, name it 'expense_tracker').
3. Run the 'schema.sql' file on that database to create the tables (you can use pgAdmin or 'psql').
4. Inside the 'backend' folder, create a new file called '.env' and add this, using your own PostgreSQL username and password:
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=expense_tracker
PORT=3000

5. Start the server:(node server.js)
   It will run at 'http://localhost:3000'.

**Frontend**

1. ...

## Features

1. Open the `frontend` folder in VS Code.
2. Right-click `index.html` and choose **Open with Live Server**.
3. The app will open in your browser.

## Features

- [x] Add an expense (with validation)
- [x] Delete an expense
- [x] Edit an expense
- [x] Filter by category and month
- [x] Summary cards (total, count, highest)
- [x] Dark mode
- [x] Data is saved in a PostgreSQL database

## Screenshots

## What was the hardest part?

The hardest part was making sure the table and the summary cards always matched what was really saved in the database. Every time I added, edited, deleted, or filtered an expense, I made sure to call one function (refresh) that re-fetches the data from the server and redraws everything, instead of changing the table by hand. This way, the page never shows wrong or outdated data.

Another tricky part was the date field. The server sends back the full date and time (like 2026-01-14), but the date input on the form only accepts YYYY-MM-DD. I had to cut off the extra part before putting the date in the edit form, or it would show up empty.

I also made sure that if the server is turned off, the user sees a clear message instead of a broken page.

//Github Link
https://github.com/ayah-01531/Expense-Tracker.git
//google drive
https://drive.google.com/file/d/1kWF6UnIxN__HpSob2SPgwfviWpabtPwX/view?usp=sharing
