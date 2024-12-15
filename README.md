Before manually running the server locally, always export the variable in whatever new terminal is being used:

Windows:
$env:GOOGLE_APPLICATION_CREDENTIALS="./service-account.json"

Linux/Mac:
export GOOGLE_APPLICATION_CREDENTIALS="./service-account.json"

This assumes that the location of the service file is in root of the project and that the name is "service-account.json".

To install all dependencies run
"npm install"

To run the server for now, simply run the index.js file.

To create a migration, run from root a command similar to:
"knex migrate:make create_devices_table --migrations-directory db\migrations"