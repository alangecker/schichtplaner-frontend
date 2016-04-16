# schichtplaner-react


## installation

        $ git clone git@github.com:alangecker/schichtplaner-frontend.git
        $ git clone git@github.com:alangecker/schichtplaner-backend.git
        $ npm install -g webpack-dev-server coffee-script nodemon
        $ cd schichtplaner-frontend && npm install
        $ cd ../schichtplaner-backend && npm install


## run
##### Terminal 1
        $ cd schichtplaner-frontend
        $ webpack-dev-server

##### Terminal 2
        $ cd schichtplaner-backend
        $ nodemon backend.coffee

##### Terminal 3
        $ cd schichtplaner-backend
        $ coffee proxy.coffee
