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
  host : process.env.RDS_HOSTNAME || "awseb-e-dcpssqafyh-stack-awsebrdsdatabase-ofssl7nxdyot.cn6220qmsuba.us-east-1.rds.amazonaws.com",
  user : process.env.RDS_USERNAME || "ebroot",
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

// LOAD THE HOME PAGE
app.get('/', (req, res) => {
  res.render('index');  // Renders 'login.ejs' file
});

app.use(express.json()); // CHECK LINE
// Serve static files (e.g., CSS) if needed
app.use(express.static('public'));
// port number, (parameters) => what you want it to do.


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

// ABOVE WORKS -------------------------------------------------

// end of gets for userHome buttons

// thank u sponsors!!
app.get('/thank-you-to-our-sponsors', (req, res) => {
  // Logic to fetch and display volunteers
  res.render('thankYouToOurSponsors');
});

// volunteer landing page
app.get('/volunteer-main', (req, res) => {
  // Logic to fetch and display volunteers
  res.render('volunteerMain');
});

// Route to donation landing page
app.get('/donateMain', (req, res) => {
  res.render('donateMain');
});

// route for becoming sponsor or partner
app.get('/become-sponsor', (req, res) => {
  res.render('becomeSponsor');
});

// route for requesting event main page
app.get('/event-request-main', (req, res) => {
  res.render('eventRequestMain');
});


// route to donation form
app.get('/donateForm', (req, res) => {
  res.render('donateForm');
});


//route for resetting admin passcode
app.get('/login/reset-password', (req, res) => {
  res.render('resetPassword');
});

// ABOVE WORKS -----------------------------------------------------------------------

// gets for userHome buttons $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

// UPCOMING ORDERED BY UNAPPROVED

app.get('/view-upcoming-events', (req, res) => {
  knex('event')
    .select(
      'event.event_id',
      'event.exp_total_attendance',
      'event.exp_under_18',
      'event.exp_over_18',
      'event.suggested_team_count',
      'event.first_datetime_pref',
      'event.sec_datetime_pref',
      'event.third_datetime_pref',
      'event.selected_datetime',
      'event.event_duration',
      'event.jen_share_story', 
      'event.event_type',
      'event.exp_num_sew_machines',
      'event.exp_num_serger_machines',
      'event.event_street',
      'event.event_city',
      'event.event_state',
      'event.event_zip',
      'event.event_contact_first_name',
      'event.event_contact_last_name',
      'event.event_contact_email',
      'event.event_contact_phone_num',
      'event.pockets_produced',
      'event.collars_produced',
      'event.vests_produced',
      'event.completed_products',
      'event.approved_status',
      'event.completed_status'
    )
    .where('completed_status', false)
    .orderBy('first_datetime_pref', 'asc')
    .then(event => {
      // Render the upcomingevents.ejs template and pass the data
      console.log('Query Result:', event);
      res.render('viewUpcomingEvents', { event }); // pass security to this too. Check if it's true. If it is, render the buttons to perform the actions. 1st, go make a user table. 2nd, after you make the table, add a record. (you may need to be able to do this on an ejs file.) 3rd, pass the variable on this line to the ejs file then modify the ejs file.
    })
    .catch(error => {
      console.error('Error querying database:', error);
      res.status(500).send('Internal Server Error');
    });
});

// UPCOMING ORDERED BY DATE
app.get('/view-upcoming-events-date', (req, res) => {
  knex('event')
    .select(
      'event.event_id',
      'event.exp_total_attendance',
      'event.exp_under_18',
      'event.exp_over_18',
      'event.suggested_team_count',
      'event.first_datetime_pref',
      'event.sec_datetime_pref',
      'event.third_datetime_pref',
      'event.selected_datetime',
      'event.event_duration',
      'event.jen_share_story', 
      'event.event_type',
      'event.exp_num_sew_machines',
      'event.exp_num_serger_machines',
      'event.event_street',
      'event.event_city',
      'event.event_state',
      'event.event_zip',
      'event.event_contact_first_name',
      'event.event_contact_last_name',
      'event.event_contact_email',
      'event.event_contact_phone_num',
      'event.pockets_produced',
      'event.collars_produced',
      'event.vests_produced',
      'event.completed_products',
      'event.approved_status',
      'event.completed_status'
    )
    .where('completed_status', false)
    .orderBy('first_datetime_pref', 'asc')
    .then(event => {
      // Render the upcomingevents.ejs template and pass the data
      res.render('viewUpcomingEvents', { event }); // pass security to this too. Check if it's true. If it is, render the buttons to perform the actions. 1st, go make a user table. 2nd, after you make the table, add a record. (you may need to be able to do this on an ejs file.) 3rd, pass the variable on this line to the ejs file then modify the ejs file.
    })
    .catch(error => {
      console.error('Error querying database:', error);
      res.status(500).send('Internal Server Error');
    });
});

// COMPLeted events BY earliest date
app.get('/view-completed-events', (req, res) => {
  // Logic to fetch and display approved events
  knex('event')
    .select(
      'event.event_id',
      'event.exp_total_attendance',
      'event.exp_under_18',
      'event.exp_over_18',
      'event.suggested_team_count',
      'event.first_datetime_pref',
      'event.sec_datetime_pref',
      'event.third_datetime_pref',
      'event.selected_datetime',
      'event.event_duration',
      'event.jen_share_story', 
      'event.event_type',
      'event.exp_num_sew_machines',
      'event.exp_num_serger_machines',
      'event.event_street',
      'event.event_city',
      'event.event_state',
      'event.event_zip',
      'event.event_contact_first_name',
      'event.event_contact_last_name',
      'event.event_contact_email',
      'event.event_contact_phone_num',
      'event.pockets_produced',
      'event.collars_produced',
      'event.vests_produced',
      'event.completed_products',
      'event.approved_status',
      'event.completed_status'
    )
    .where('completed_status', true)
    .orderBy('selected_datetime', 'asc')
    .then(event => {
      // Render the upcomingevents.ejs template and pass the data
      res.render('viewCompletedEvents', { event }); // pass security to this too. Check if it's true. If it is, render the buttons to perform the actions. 1st, go make a user table. 2nd, after you make the table, add a record. (you may need to be able to do this on an ejs file.) 3rd, pass the variable on this line to the ejs file then modify the ejs file.
    })
    .catch(error => {
      console.error('Error querying database:', error);
      res.status(500).send('Internal Server Error');
    });
});

app.get('/view-volunteers', (req, res) => {
  knex('volunteer')
    .select(
      'volunteer.volunteer_id',
      'volunteer.vol_first_name',
      'volunteer.vol_last_name',
      'volunteer.vol_email',
      'volunteer.vol_phone_num',
      'volunteer.vol_zip',
      'volunteer.referral_source',
      'volunteer.sewing_level',
      'volunteer.willing_hours_per_month'
    )

    .then(volunteer => {
      // Render the viewVolunteers.ejs template and pass the data
      res.render('viewVolunteers', { volunteer }); // pass security to this too. Check if it's true. If it is, render the buttons to perform the actions. 1st, go make a user table. 2nd, after you make the table, add a record. (you may need to be able to do this on an ejs file.) 3rd, pass the variable on this line to the ejs file then modify the ejs file.
    })
    .catch(error => {
      console.error('Error querying database:', error);
      res.status(500).send('Internal Server Error');
    });
});

// view admin GET
app.get('/view-admins', (req, res) => {
  knex('admin')
    .select(
      'admin.adminID',
      'admin.admin_first_name',
      'admin.admin_last_name',
      'admin.admin_email',
      'admin.hashed_password',
      'admin.created_at',
      'admin.updated_at'
    )

    .then(admin => {
      // Render the viewAdmins.ejs template and pass the data
      res.render('viewAdmins', { admin }); // pass security to this too. Check if it's true. If it is, render the buttons to perform the actions. 1st, go make a user table. 2nd, after you make the table, add a record. (you may need to be able to do this on an ejs file.) 3rd, pass the variable on this line to the ejs file then modify the ejs file.
    })
    .catch(error => {
      console.error('Error querying database:', error);
      res.status(500).send('Internal Server Error');
    });
});

// POST for EDITS
//   the :id refers to the id record we passed in the editPoke.ejs form 
app.post('/editCharacter/:id', (req, res) => {
  const id = req.params.id;

  // Access each value directly from req.body
  const first_name = req.body.first_name; // SEE LINE 49 IN editPoke.ejs

  const last_name = req.body.last_name; // 

  const planet_name = parseInt(req.body.planet_name); //convert to int

  // Since active_poke is a checkbox, its value is only sent when the checkbox is checked.

  // If it is unchecked, no value is sent to the server.

  // This behavior requires special handling on the server-side to set a default

  // value for active_poke when it is not present in req.body.

  const jedi = req.body.jedi === 'true'; // Convert checkbox value to boolean

  const weapon= req.body.weapon;

  // Update the Pokémon in the database
  knex('characters')
    .where('id', id)
  //   the left side of : is the DB column name. the right side is the 
    .update({
      first_name: first_name,
      last_name: last_name,
      planet_name: planet_name,
      jedi: jedi,
      weapon: weapon,
      
    })
    .then(() => {
      res.redirect('/'); // Redirect to the home pageafter saving
    })
    .catch(error => {
      console.error('Error updating character:', error);
      res.status(500).send('Internal Server Error');
    });
});


// the POST Template for ADD admins and event
app.post('/addCharacter', (req, res) => {
  // Extract form values from req.body
  const first_name = req.body.first_name || ''; // Default to empty string if not provided
  const last_name = req.body.last_name || '';
  const planet_name = parseInt(req.body.planet_name, 10); // Convert to integer
                          // const date_created = req.body.date_created || new Date().toISOString().split('T')[0]; // Default to today
  const jedi = req.body.jedi === 'true'; // Checkbox returns true or undefined
  const weapon= req.body.weapon|| 'N'; // Default to 'N' for None
                              // const poke_type_id = parseInt(req.body.poke_type_id, 10); // Convert to integer
  // Insert the new character into the database
  knex('characters')
    .insert({
      first_name: first_name.toUpperCase(), // Ensure description is uppercase
      last_name: last_name.toUpperCase(),
      planet_name: planet_name,
      jedi: jedi,
      weapon: weapon,
    })
    .then(() => {
      res.redirect('/'); // Redirect to the character list page after adding
    })
    .catch(error => {
      console.error('Error adding Pokémon:', error);
      res.status(500).send('Internal Server Error');
    });
});


// template for the DELETE buttons
app.post('/deleteCharacter/:id', (req, res) => {
  const id = req.params.id;
  knex('characters')
    .where('id', id)
    .del() // Deletes the record with the specified ID
    .then(() => {
      res.redirect('/'); // Redirect to the character list after deletion
    })
    .catch(error => {
      console.error('Error deleting character:', error);
      res.status(500).send('Internal Server Error');
    });
});

// ABOVE WORKS ----------------------------------------------------------------------------------

// REGISTER / LOGIN / PASSWORD ------------------------------------------------------------------------------------------------

// Routes for Register
app.get('/register', (req, res) => res.render('register'));

app.post('/register', async (req, res) => {
    const { first_name, last_name, username, password } = req.body;
    try {
        const hashedPassword = await argon2.hash(password);
        await db('users').insert({
            first_name,
            last_name,
            username,
            hashed_password: hashedPassword,
        });
        res.send('Registration successful!');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error registering user.');
    }
});

// Routes for Login
app.get('/login', (req, res) => res.render('login'));


//ethans volunteer form 12/3
// Route to serve the volunteer form
app.get('/volunteer-form', (req, res) => {
  res.render('volunteerForm'); // Ensure this matches the EJS file name (volunteerForm.ejs)
});

app.post('/submit-volunteer-form', async (req, res) => {
  const {
    vol_first_name,
    vol_last_name,
    vol_email,
    vol_phone_num,
    vol_zip,
    referral_source,
    sewing_level,
    willing_hours_per_month,
  } = req.body;

  try {
    // Insert volunteer data into the database
    await pool.query(
      `INSERT INTO volunteers (vol_first_name, vol_last_name, vol_email, vol_phone_num, vol_zip, referral_source, sewing_level, willing_hours_per_month, member_since)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        vol_first_name,
        vol_last_name,
        vol_email,
        vol_phone_num,
        vol_zip,
        referral_source,
        sewing_level,
        willing_hours_per_month,
        member_since,
      ]
    );
    res.redirect('/'); // Redirect to landing page after submission
  } catch (err) {
    console.error('Error inserting volunteer data:', err);
    res.status(500).send('Error processing your request.');
  }
});

// ABOVE WORKS --------------------------------------------------------

(async () => {
  try {
      const result = await knex.raw('SELECT 1+1 AS result'); // Simple query to test connection
      console.log("Database connected successfully:", result.rows);
  } catch (error) {
      console.error("Database connection failed:", error.message);
  }
})();

// PORT LISTENING-----------------------------------------------------------------------------
app.listen(PORT, () => console.log('Server started on port ' + PORT));