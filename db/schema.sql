DROP DATABASE IF EXISTS notes_app;

CREATE DATABASE notes_app;

USE notes_app;

CREATE TABLE users (
	id INT NOT NULL AUTO_INCREMENT,
	username VARCHAR(255) NOT NULL UNIQUE,
	password_hash VARCHAR(255) NOT NULL,
	PRIMARY KEY (id)
);

CREATE TABLE notebooks (
	id INT NOT NULL AUTO_INCREMENT,
	notebook_name VARCHAR(255) NOT NULL,
	user_id INT NOT NULL,
	FOREIGN KEY (user_id) REFERENCES users(id),
	PRIMARY KEY (id)
);

CREATE TABLE notes (
	id INT NOT NULL AUTO_INCREMENT,
	title VARCHAR(255) NOT NULL,
	ingredients VARCHAR(255) NOT NULL,
	instructions VARCHAR(255) NOT NULL,
	image VARCHAR(255),
	source VARCHAR(255),
	notebook_id INT NOT NULL,
	FOREIGN KEY (notebook_id) REFERENCES notebooks(id),
	PRIMARY KEY (id)
);

