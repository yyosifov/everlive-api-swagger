# Node JS + Angular JS + Require JS

This is a minimalistic application structure which has a Node server for serving the Angular JS site. External dependencies are managed using Require JS.

## Getting started

The project depends on Git, Npm and Bower - have them installed in advance. Then run the following sequence of commands.

    git clone https://github.com/yyosifov/angular-require-seed.git
	cd angular-require-seed
	npm install
	cd app
	bower install 

 Now you have all the source code and components available.

### Run the Application

To run the application:

	cd angular-require-seed
	node index.js

After starting the Node JS server open the website at **http://localhost:3000/#/** which should render the main.html partial view.

## Directory Layout

    index.js --> the Node JS server, used only for serving statically the website assets
    app/ --> the web application resides here
    	app.js --> setup of the angular application and modules
    	main.js --> manually bootstrap the angular application, after configuring and loading the extenral modules with require js
    	index.html --> the SPA application's page
    	partials/
    		main.html --> a partial view, rendered in <div ui-view> when accessing /#/ and matching the "/" route defined in the $stateProvider