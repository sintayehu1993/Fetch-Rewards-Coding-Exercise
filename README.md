## Background
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
grab it here: https://nodejs.org/en/download/ Be sure to install npm package manager as well.