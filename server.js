const express = require("express");
const sql = require("mssql");
const cors = require("cors");
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// SQL Server configuration
var config = {
    user: "gmmco", // Database username
    password: "gm@123co", // Database password
    server: "mysqlgmmco.database.windows.net", // Server IP address
    database: "gmmcosql", // Database name
    options: {
        encrypt: true // Enable encryption
    }
};

// Connect to SQL Server
sql.connect(config, err => {
    if (err) {
        throw err;
    }
    console.log("Connection Successful!");
});

// Define route for fetching data from SQL Server
// app.get("/EmpID", async (request, response) => {
//     try {
//         // Execute a SELECT query to fetch only the 'id' column from 'EmployeeMaster'
//         const result = await new sql.Request().query("SELECT * FROM EmployeeMaster");

//         const name = result.recordset.map(row => row.EmpName);

//         // Log the extracted IDs to console
//         console.log("Name:", name);

//         // Send the extracted 'id' values as response
//         response.send(name);
//     } catch (err) {
//         console.error("Error executing query:", err);
//         response.status(500).send("Error fetching data");
//     }
// });
app.get("/EmpID/:empId", async (request, response) => {
    try {
            // Extract empId from the request params
            const empId = request.params.empId;
            console.log(empId)
            // Check if empId is provided
            if (!empId) {
                return response.status(400).send("empId is required");
            }
    
            // Execute a SELECT query to fetch the employee name based on the provided empId
            const result = await new sql.Request()
                .input('empId', sql.NVarChar, empId) // Assuming empId is a string
                .query("SELECT EmpName FROM EmployeeMaster WHERE EmpId = @empId");
    
            // Check if an employee with the provided empId exists
            if (result.recordset.length === 0) {
                return response.status(404).send("Employee not found");
            }
    
            const employeeName = result.recordset[0].EmpName;
    
            // Log the extracted name to console
            console.log("Employee Name:", employeeName);
        // Send the extracted name as response
        response.send({ employeeName });
        // response.status(200).send("Success");
    } catch (err) {
        console.error("Error executing query:", err);
        response.status(500).send("Error fetching data");
    }
});


// app.get("/Name", async (request,response) => {
//     try {
//         const result = await new sql.Request().query("SELECT * FROM EmployeeMaster");
//         const id = result.recordset.map(row => row.id)
//         console.log("Id:",id)
//         response.send(id)
//     }catch(error){
//         console.error("Error executing query:", err)
//         response.status(500).send("Error fetching data");
//     }
// })


app.get("/Name/:empName", async (request, response) => {
    try {
        // Extract empName from the request params
        const empName = request.params.empName;

        // Check if empName is provided
        if (!empName) {
            return response.status(400).send("empName is required");
        }

        // Execute a SELECT query to fetch the employee ID based on the provided empName
        const result = await new sql.Request()
            .input('empName', sql.NVarChar, empName) // Assuming empName is a string
            .query("SELECT EmpId FROM EmployeeMaster WHERE EmpName = @empName");

        // Check if an employee with the provided empName exists
        if (result.recordset.length === 0) {
            return response.status(404).send("Employee not found");
        }

        const employeeId = result.recordset[0].EmpId;

        // Log the extracted ID to console
        console.log("Employee ID:", employeeId);

        // Send the extracted ID as response
        response.send({ employeeId });
    } catch (err) {
        console.error("Error executing query:", err);
        response.status(500).send("Error fetching data");
    }
});
// getAll employees 

app.get("/getAllEmp", async(request, response) =>{
    try{
        const result = await new sql.Request().query("SELECT * FROM EmployeeMaster");
        const employeeDetails = result.recordset;
        console.log("Employee Details:", employeeDetails)
        response.send(employeeDetails)

    } catch(error){
        console.error("Error executing query:", error)
        response.status(500).send("Error fetching data")
    }
})
// // POST API endpoint to insert data into HRCommands table
// app.post("/hrCommands", async (req, res) => {
//     try {
//         const { EmpId,Comments} = req.body;

//         // const currentDate = new Date();

//         // SQL query to insert into HRCommands table
//         const query = `
//             INSERT INTO HRComments (EmpId,Comments)
//             VALUES (@EmpId,@Comments)
//         `;

//         // Create a new request instance
//         const request = new sql.Request();

//         // Bind parameters
//         request.input("EmpId", sql.NVarChar, EmpId);
//         request.input("Comments", sql.NVarChar, Comments);
//         // request.input("Date",sql.DateTime,currentDate)
        

//         // Execute the query
//         const result = await request.query(query);

//         console.log("Inserted data into HRCommands:", result.rowsAffected);

//         res.status(201).send("Data inserted successfully");
//     } catch (err) {
//         console.error("Error inserting data:", err);   
//         res.status(500).send("Error inserting data");  
//     }
// });
// -----------------------------------
// app.post("/hrCommands", async (req, res) => {
//     try {
//         const { EmpId, Comments } = req.body;

//         const query = `
//             INSERT INTO HRComments (EmpId, Comments)
//             VALUES (@EmpId, @Comments)
//         `;

//         const request = new sql.Request();
//         request.input("EmpId", sql.NVarChar, EmpId);
//         request.input("Comments", sql.NVarChar, Comments);

//         const result = await request.query(query);

//         console.log("Inserted data into HRCommands:", result.rowsAffected);

//         // Send a JSON response
//         res.status(201).json({ message: "Data inserted successfully" });
//     } catch (err) {
//         console.error("Error inserting data:", err);
//         res.status(500).json({ message: "Error inserting data" });
//     }
// });
// -------------------------------

app.post("/hrCommands", async (req, res) => {
    try {
        const { EmpId, Comments } = req.body;
        const currentDate = new Date();

        const query = `
            INSERT INTO HRComments (EmpId, Comments, Date)
            VALUES (@EmpId, @Comments, @Date)
        `;

        const request = new sql.Request();
        request.input("EmpId", sql.NVarChar, EmpId);
        request.input("Comments", sql.NVarChar, Comments);
        request.input("Date", sql.DateTime, currentDate);

        const result = await request.query(query);

        console.log("Inserted data into HRComments:", result.rowsAffected);

        // Send a JSON response
        res.status(201).json({ message: "Data inserted successfully" });
    } catch (err) {
        console.error("Error inserting data:", err);
        res.status(500).json({ message: "Error inserting data" });
    }
});

app.get('/ping',(req,res)=>{
    res.status(200).json({message: "pong"})
})

// Start the server on port 3000
app.listen(3000, () => {
    console.log("Listening on port 3000...");
});  