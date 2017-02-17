# Build a Stock Price Indicator

## Mercatus Machina

A stock price prediction app built with Python and NodeJS.

__DISCLAIMER:__ This project is build for learning purposes and the author of the code is not responsible for any real financial damages that may occur due to its use. DO NOT use this project as your trusted source for real-life trading transactions.


## Running The Demo

To run the demo, please make sure you have the following installed:

- Postgres (>=9.5)
- Scipy (python scientific libraries: numpy, sklearn, pandas, etc..)
- IPython & Jupyter

See the full list of requirements in `./ml_api/requirements.txt`.

Running the demo does not require the NodeJS server since you can simply start the IPython notebook instead of the web application.

A few steps are however required to get the database up and running:

- Navigate to the main directory of the project

- Unzip `_data/db.zip` to decompress the database dump

- Create a new empty database (ex: `mercatus_machina_dev`) using `psql` (or a GUI tool)
  - [Postgres Documentation](https://www.tutorialspoint.com/postgresql/postgresql_create_database.htm)
    - Ex: `CREATE DATABASE mercatus_machina;`


- Create a new role and grant access to the newly created database
  - [New Role Documentation](https://www.postgresql.org/docs/9.5/static/sql-createrole.html)
    - Ex: `CREATE USER mercatus_machina WITH PASSWORD 'mercatus_machina';`
  - [Grant Access Documentation](https://www.postgresql.org/docs/9.5/static/sql-grant.html)
    - Ex: `GRANT ALL PRIVILEGES ON database mercatus_machina_dev TO mercatus_machina;`


- Import the data dump placed in `./_data/db.sql` into the newly created database
  - Run `psql mercatus_machina_dev < _data/db.sql` in your terminal


- Open the `./ml_api/configs.py` file which contains the database connection configurations and edit them according to your local machine and the name chosen for the database

- Simply run `jupyter notebook demo.ipynb` in the main directory of the project and that will start a web page containing a step by step demo of the project and the results.


## Getting In Touch

* [via Twitter](https://twitter.com/FaisalAlTameemi)
* [via LinkedIn](http://ca.linkedin.com/in/faisalaltameemi)
* [via Github](https://github.com/FaisalAl-Tameemi)
