
const express = require('express');
const app = express();

app.use(express.json());

const usersTransactions = [
   //these are dummy data use from the pdf to see if the routs are working right 
    {payer: 'DANNON', points: 1000, timestamp: new Date(2020, 10, 2, 14, 0, 0)},
    {payer: 'DANNON', points: -200, timestamp: new Date(2020, 9, 31, 15, 0, 0)},
    {payer: 'DANNON', points: 300, timestamp: new Date(2020, 9, 31, 10, 0, 0)},
    {payer: 'MILLER CORS', points: 10000, timestamp: new Date(2020, 10, 1, 14, 0, 0)},
    {payer: 'UNILEVER', points: 200, timestamp: new Date(2020, 9, 31, 11, 0, 0)}

];

// Sorts all the current transactions from oldest to newest, based on the given timestamp
function sortedTransactions() { 
    usersTransactions.sort(function(a,b){
    return new Date(a.timestamp) - new Date(b.timestamp);
})}


// Base Path
app.get('/', (req, res) => {
    res.send('Hello there! \n All endpoints are following the base path of http://localhost:3000/');
});

// GET's all current transactions detail for all users 
app.get('/all-transactions', (req, res) => {
    sortedTransactions();
    res.send(usersTransactions);    
});

// GET's the total sum of all current transaction's points for all users
app.get('/balance', (req, res) => {
    const balance = usersTransactions.reduce((a, {payer, points}) => (a[payer] = (a[payer] || 0) + +points, a), {});
    res.send(balance);
});

// GET's all current transactions by a given payer's name in the path 
app.get('/transactions/:payer', (req, res) => {
    const payer = usersTransactions.find(p => p.payer === req.params.payer.toUpperCase());
    if(!payer) res.status(404).send("Transactions with the given account name was not found.");
    
    const payerList = [];
// Go through transaction array and for each entry that matches the name entered in the path, it adds it to the payerList array and displays the total list of that payer's entries
    for(i = 0; i < usersTransactions.length; i++){
        if(req.params.payer.toUpperCase() === usersTransactions[i].payer){
            payerList.push(usersTransactions[i])
        }
    }
    res.send(payerList)
});


// Will deduct points from accounts from oldest to newest transactions, and accounts can't go negative
app.post('/spending', (req, res) => {
    // Sort first
    sortedTransactions();
    if(!req.body.points || req.body.points < 0) {
        res.status(404).send("You need to select a point value that is also greater than 0 in order to make a proper spend call.");
    }

    const beforeBalance = usersTransactions.reduce((a, {payer, points}) => (a[payer] = (a[payer] || 0) + +points, a), {});

    let spend = req.body.points;
    let spendPoints = spend

    if(req.body.points){
        // For each entry in transactions, subtract the points from the spend points total
            // Already takes from oldest first because its sorted beforehand
        for(i = 0; i < usersTransactions.length; i++){
            currentPoints = spendPoints - usersTransactions[i].points;
                // After points are taken out of that transaction you check if there are points left in that transaction by checking spend points
                if(spendPoints > 0){
                    // if there are still points to be spent it means the full amount was taken out of the transaction
                    // set that transaction points to 0
                    spendPoints = currentPoints;
                    usersTransactions[i].points = 0;
                } 
                if(spendPoints < 0){
                    // If the spend points are now negative it means it ran out of points to spend on that transaction
                    // to get the correct value remaining for that transaction, set its points to the transaction points - spend, since spend points were negative, the transaction has enough in its points to cover the difference.
                    usersTransactions[i].points = usersTransactions[i].points - spendPoints;
                    // since spend points went negative, there are no more points to spend, so break
                    break;
                }
            }
    }
    const afterBalance = usersTransactions.reduce((a, {payer, points}) => (a[payer] = (a[payer] || 0) + +points, a), {});
    console.log('what is after balance', afterBalance)
    const finalBalance = {};
    console.log('what is final balance', finalBalance)

    // will find the difference in the balance totals before and after spending and send out the total amount of points taken out of each account
    for(i = 0; i < Object.keys(beforeBalance).length; i ++){
        pointsDeducted = ((Object.values(beforeBalance)[i] - Object.values(afterBalance)[i]) * -1);
        finalBalance[Object.keys(beforeBalance)[i]] = pointsDeducted
    }


    res.status(200).send(finalBalance);
});

// This will add a new transaction to the current list by name, points, and timestamp given by the user
app.post('/transactions', (req, res) => {
    if(!req.body.payer || typeof req.body.payer !== 'string'){
        res.status(400).send(`Parameter 'payer' must be a string`);
        return;
    }
    if(!req.body.points || isNaN(req.body.points)){
        res.status(404).send(`There must be a "points" value assigned to the transaction or Parameter 'points' must be a number`);
        return;
    }
    const transaction = {
        payer: req.body.payer.toUpperCase(),
        points: req.body.points,
        timestamp: new Date(req.body.timestamp)
        // format in Postman ("timestamp": "Year, Month, Day, Hours:Seconds:Milliseconds")
    };

    usersTransactions.push(transaction);
    sortedTransactions();
    res.send(transaction);
});

//PORT 
// Will get the port number from local environment, but will default to 3000 otherwise
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listing on port: ${port}`))