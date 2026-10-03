// Expense Tracker - backend (Express API + PostgreSQL)
//
// PHASE 1
const express=require('express');
const cors = require('cors');
require('dotenv').config()
const { Pool } = require('pg');
const app=express();
const PORT = 3000;
app.use(cors());
app.use(express.json());
const pool = new Pool({ user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,} ); 

//
// Endpoints you need to build:

//   GET    /api/expenses        return all expenses
app.get('/api/expenses', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM expenses');
        return res.json(result.rows);

    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to fetch expenses' })
    }
});
//   GET    /api/expenses/:id    return one expense (404 if not found)
app.get('/api/expenses/:id',async(req,res)=>{

    try{
     const id = req.params.id;
     if (!Number.isInteger(Number(id))) {
        return res.status(400).json({ error: 'Invalid id' });
    }
    const result = await pool.query('SELECT * FROM expenses WHERE id=$1',[id]);
    if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Expense not found' });
        }
    return res.json(result.rows[0]); 
    }
    catch(error){
    console.error(error);
    return res.status(500).json({error:'Failed to fetch expense'});
    }
});
//   POST   /api/expenses        add an expense (201, or 400 if the data is invalid)
app.post('/api/expenses',async(req,res)=>{
    try{
const{title,amount,category,date}=req.body;

//validation----------------------
const finalDate = date ?? new Date();
//title-----------
if(title=="")
{
    return res.status(400).json({error:'title is  required'});

}
if(typeof title !=='string')
{
     return res.status(400).json({error:'title must be a string'});

}
if (title.trim() === '') {
    return res.status(400).json({ error: 'title cannot be empty' });
}
//amount------------
if (amount === undefined || isNaN(Number(amount)) || Number(amount) <= 0) {
    return res.status(400).json({ error: 'amount must be a positive number' });
}

const result=await pool.query(
    "INSERT INTO expenses(title,amount,category,date) VALUES($1,$2,$3,$4) RETURNING id, title, amount::float8 AS amount, category, to_char(date, 'YYYY-MM-DD') AS date",[title,amount,category,finalDate]
);
return res.status(201).json(result.rows[0]);

}
catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'nternal Server Error' });
    }
});
//   PUT    /api/expenses/:id    update an expense (200, 400, or 404)

app.put('/api/expenses/:id',async(req,res)=>{
    
    try{
        const id=req.params.id;
     if (!Number.isInteger(Number(id))) {
            return res.status(400).json({ error: 'Invalid id' });
        }

    const{title,amount,category,date}=req.body;
    if (!title) {
            return res.status(400).json({ error: 'title is required' });
        }
        if (typeof title !== 'string') {
            return res.status(400).json({ error: 'title must be a string' });
        }
        if (title.trim() === '') {
            return res.status(400).json({ error: 'title cannot be empty' });
        }
        if (amount === undefined || isNaN(Number(amount)) || Number(amount) <= 0) {
            return res.status(400).json({ error: 'amount must be a positive number' });
        }

        const result=await pool.query("UPDATE expenses SET title=$1,amount=$2,category=$3,date=$4 WHERE id = $5  RETURNING id, title, amount::float8 AS amount, category, to_char(date,'YYYY-MM-DD') AS date",
            [title,amount,category,date,id]);
        if (result.rows.length === 0) {
       return res.status(404).json({ error: 'Expense not found' });
}

        return res.status(200).json(result.rows[0]);

    }catch(error){
        console.log(error);
        return res.status(500).json({error:'Internal Server Error'});
    }


});
//   DELETE /api/expenses/:id    delete an expense (200, or 404)
app.delete('/api/expenses/:id',async(req,res)=>{
    try{
       const id=req.params.id;
       if (!Number.isInteger(Number(id))) {
            return res.status(400).json({ error: 'Invalid id' });
        }

       const result=await pool.query('DELETE FROM expenses WHERE id = $1 RETURNING *',[id]);
       if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Expense not found' });
        }
        return res.status(200).json({ message: 'Expense deleted', deleted: result.rows[0] });

    }catch(error)
    {
        console.log(error);
        return res.status(500).json({error:'Internal Server Error'});


    }
    

});
//
// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
