let express = require('express');
let app = express();
let path = require('path');
const PORT = process.env.PORT || 3000
// grab html form from file 
// allows to pull JSON data from form 
app.use(express.urlencoded( {extended: true} )); 
const knex = require("knex") ({
  client : "pg",
  connection : {
  host : process.env.RDS_HOSTNAME || "awseb-e-jscipcpyz9-stack-awsebrdsdatabase-roat50cnm4ii.c7kgaykw042g.us-east-2.rds.amazonaws.com",
  user : process.env.RDS_USERNAME || "dev-admins",
  password : process.env.RDS_PASSWORD || "Password123",
  database : process.env.RDS_DB_NAME || "ebdb",
  port : process.env.RDS_PORT || 5432,
  ssl: process.env.DB_SSL ? { rejectUnauthorized: false } : false  // Fixed line
}
})
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
// Serve static files (CSS, images, etc.)
app.use(express.static(path.join(__dirname, 'public')));
// Define route for home page
// Serve the login page (login.ejs)
app.get('/', (req, res) => {
  res.render('index');  // Renders 'login.ejs' file
});
// Serve static files (e.g., CSS) if needed
app.use(express.static('public'));
// port number, (parameters) => what you want it to do.
app.listen(PORT, () => console.log('Server started on port ' + PORT));

// THIS COMES FROM THE ORIGINAL INDEX.JS FILE
// Route to serve the form ------------------------------------------------------------------------------------------------
app.get('/event-request', (req, res) => {
  res.render('eventRequestForm');
});

// Route to about page ------------------------------------------------------------------------------------------------
app.get('/about', (req, res) => {
  res.render('about');
});

// Route to homelessness info page ------------------------------------------------------------------------------------------------
app.get('/homeless', (req, res) => {
  res.render('homeless');
});

// ABOVE WORKED --------------------------------------------------------------------

// Route to handle form submission
app.post('/submit-event-request', (req, res) => {
  // Access each value directly from req.body
  const exp_total_attendance = parseInt(req.body.exp_total_attendance);
  const event_type = req.body.event_type;
  const first_datetime_pref = req.body.first_datetime_pref;
  const sec_datetime_pref = req.body.sec_datetime_pref || null; // Optional field
  const third_datetime_pref = req.body.third_datetime_pref || null; // Optional field
  const event_duration = parseFloat(req.body.event_duration); // Convert to float for half-hours
  const event_street = req.body.event_street;
  const event_city = req.body.event_city;
  const event_state = req.body.event_state;
  const event_zip = req.body.event_zip;
  const event_additional_info = req.body.event_additional_info || null; // Optional field
  const jen_share_story = req.body.jen_share_story === 'true'; // Convert checkbox value to boolean
  const exp_num_sew_machines = parseInt(req.body.exp_num_sew_machines);
  const exp_num_serger_machines = parseInt(req.body.exp_num_serger_machines);
  const exp_under_18 = parseInt(req.body.exp_under_18);
  const exp_over_18 = parseInt(req.body.exp_over_18);
  const event_contact_first_name = req.body.event_contact_first_name;
  const event_contact_last_name = req.body.event_contact_last_name;
  const event_contact_phone_num = req.body.event_contact_phone_num;
  const event_contact_email = req.body.event_contact_email;
  // Insert the event into the database
  knex('event')
    .insert({
      exp_total_attendance: exp_total_attendance,
      event_type: event_type,
      first_datetime_pref: first_datetime_pref,
      sec_datetime_pref: sec_datetime_pref,
      third_datetime_pref: third_datetime_pref,
      event_duration: event_duration,
      event_street: event_street,
      event_city: event_city,
      event_state: event_state,
      event_zip: event_zip,
      event_additional_info: event_additional_info,
      jen_share_story: jen_share_story,
      exp_num_sew_machines: exp_num_sew_machines,
      exp_num_serger_machines: exp_num_serger_machines,
      exp_under_18: exp_under_18,
      exp_over_18: exp_over_18,
      event_contact_first_name: event_contact_first_name,
      event_contact_last_name: event_contact_last_name,
      event_contact_phone_num: event_contact_phone_num,
      event_contact_email: event_contact_email,
      approved_status: false, // Default value
      completed_status: false, // Default value
    })
    .then(() => {
      res.redirect('/success'); // Redirect to a success page
    })
    .catch(error => {
      console.error('Error submitting event request:', error);
      res.status(500).send('Internal Server Error');
    });
});
// END OF JEFF'S STUFF AS OF 12/3/24

//poop

//ABOVE WORKS --------------------------------------------

// Route to Jens Story Page
app.get('/jensstory', (req, res) => {
  res.render('jensstory');
});

// Route to How You Can Help Page
app.get('/howucanhelp', (req, res) => {
res.render('howucanhelp');
});


//  Route for the login page
app.get('/login', (req, res) => {
res.render('login'); // Renders login.ejs
});

app.post('/login', (req, res) => {
// Directly redirect to user-home without authentication
res.redirect('/user-home');
});


app.get('/user-home', (req, res) => {
res.render('userHome'); // Renders userHome.ejs
});