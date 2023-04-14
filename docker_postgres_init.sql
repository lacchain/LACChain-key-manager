CREATE USER docker WITH PASSWORD 'password' CREATEDB;

CREATE DATABASE key_manager_database
WITH OWNER = docker
CONNECTION LIMIT = -1;

CREATE DATABASE express_api_base_test
WITH OWNER = docker
CONNECTION LIMIT = -1;

