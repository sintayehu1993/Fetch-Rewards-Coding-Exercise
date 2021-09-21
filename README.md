## Fetch Reward's Back End Challenge
Our users have points in their accounts. Users only see a single balance in their accounts. 
But for reporting purposes we actually track their points per payer/partner. 
In our system, each transaction record contains: payer (string), points (integer), timestamp (date).

For earning points it is easy to assign a payer, we know which actions earned the points. 
And thus which partner should be paying for the points.

When a user spends points, they don't know or care which payer the points come from. But, 
our accounting team does care how the points are spent. There are two rules for determining 
what points to "spend" first:
* We want the oldest points to be spent first (oldest based on transaction timestamp, not the order they're received)
* We want no payer's points to go negative.


The Expected Result Of This Exercise
Routes will need to be provided that:

Add transactions for a specific payer and date.
Spend points using the rules above and return a list of { "payer": , "points": } for each call.
Return all payer point balances.

## How To Setup Locally
This application was written for use with Node.js. If you don't have Node installed, you can 
grab it here:
[Install Node.js](https://nodejs.org/en/download/) Be sure to install npm package manager as well.

Once you have node installed you will need to make sure you have the packages installed in your editor through the terminal.

```
npm install
```
```
npm init -yes
```
```
npm install express
```
```
npm install nodemon
```
```
npm install dotenv
```

To run the server all you have to do in the terminal is enter:

```
node server.js 
```
```
nodemon server.js
```

```javascript
{
  "name": "Fetch-Rewards-Points-Api",
  "version": "1.0.0",
  "description": "",
  "main": "server.js",
  "scripts": {
    "devStart": "nodemon server.js"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/sintayehu1993/Fetch-Rewards-Coding-Exercise.git"
  },
  "author": "Sintayehu Dejene",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/sintayehu1993/Fetch-Rewards-Coding-Exercise/issues"
  },
  "homepage": "https://github.com/sintayehu1993/Fetch-Rewards-Coding-Exercise#readme",
  "dependencies": {
    "express": "^4.17.1",
    "node": "^16.9.1"
  },
  "devDependencies": {
    "dotenv": "^10.0.0",
    "nodemon": "^2.0.12"
  }
}

```

## Running The Server

Once you're up and running you will need an API platform to see the server in action. I know there are multiple platforms and feel free to use them, but for my personal preference I used Postman. This is the link to download [Postman](https://www.postman.com/downloads/)

* With Postman up and running, to start you enter the following address in the address bar in postman.

Also make sure the associated request matches that path, for example a GET request will have a different outcome than a POST request if it has the same endpoint.

# Below are the following paths 
## GET Requests 

```
http://localhost:3000/all-transactions
```
```javascript
[
    {
        "payer": "DANNON",
        "points": 300,
        "timestamp": "2020-10-31T14:00:00.000Z"
    },
    {
        "payer": "UNILEVER",
        "points": 200,
        "timestamp": "2020-10-31T15:00:00.000Z"
    },
    {
        "payer": "DANNON",
        "points": -200,
        "timestamp": "2020-10-31T19:00:00.000Z"
    },
    {
        "payer": "MILLER CORS",
        "points": 10000,
        "timestamp": "2020-11-01T19:00:00.000Z"
    },
    {
        "payer": "DANNON",
        "points": 1000,
        "timestamp": "2020-11-02T19:00:00.000Z"
    }
]
```

```
http://localhost:3000/balance
```

```javascript
[
    {
        "DANNON": 1100,
        "UNILEVER": 200,
        "MILLER CORS": 10000
    }
]
```
```
http://localhost:3000/transactions/:payer
* example: http://localhost:3000/transactions/MILLER CORS
```

```javascript
[
    {
        "payer": "MILLER CORS",
        "points": 10000,
        "timestamp": "2020-11-01T19:00:00.000Z"
    }
]
```

## POST REQUESTS

Post requests require you to enter various information related to that request when sending.
When entering a post in Postman do the followings. 
For all POST requests 
* you will need to be under the "Body" tab 
* then click "raw"
* finally then set the text to JSON.

If the infomations are not entered in the right format you will encounter an error  
I will include the format and what is required to post for each path.

```
http://localhost:3000/transactions
```

### Add a new transaction with a name, points, and timestamp.
* The name has to be string
* The points has to be a number
* The timestamp follows the format of "year, month, day, hours:seconds:milliseconds"
```javascript
{
    "payer": "SINTAYEHU",
    "points": 250,
    "timestamp": "2020-10-31T16:00:00.000Z"
}
```
* responds should look the same as the
  
  ```javascript 
    {
        "payer": "SINTAYEHU",
        "points": 250,
        "timestamp": "2020-10-31T16:00:00.000Z"
    }


```
http://localhost:3000/spending

* Call your spend points route with the following request: 

{ "points": 5000 }

```
* Points must be a positive number and also a number 
```javascript
{
    "DANNON": 200,
    "UNILEVER": 0,
    "SINTAYEHU": -250,
    "MILLER CORS": -4950
}
```

#### Entered spend points, will be taken out of current account transactions  with in two primary rules:

* The oldest transaction's points will be spent first.
* we don't want No payer's points go negative. You will get a message showing the amount of points taken out of each account by payer. after your can make another GET request paths ``` http://localhost:3000/balance ``` to see their updated points totals.


## Lastly 
in the server.js at the  top, there sample users transactions to pre-populate when server starts. 
You have samples to use instead of manually entering a bunch of sample transactions. 

# THANK YOU!!
