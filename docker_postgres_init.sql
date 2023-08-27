CREATE USER docker WITH PASSWORD 'password' CREATEDB;

CREATE DATABASE lacchain_key_manager_development
WITH OWNER = docker
CONNECTION LIMIT = -1;


CREATE DATABASE lacchain_key_manager
WITH OWNER = docker
CONNECTION LIMIT = -1;

CREATE DATABASE express_api_base_test
WITH OWNER = docker
CONNECTION LIMIT = -1;

