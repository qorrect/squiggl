CREATE DATABASE squig_test;SET search_path TO squig_test;
CREATE TABLE IF NOT EXISTS Author (name varchar,age integer  ,  id SERIAL PRIMARY KEY  );
CREATE TABLE IF NOT EXISTS Book (title varchar,contents text,publishDate Date,Author_id int ,  id SERIAL PRIMARY KEY  );
CREATE TABLE IF NOT EXISTS Editor (name varchar,yearEstablished integer  ,  id SERIAL PRIMARY KEY  );
CREATE TABLE IF NOT EXISTS Editor_Book (Editor_id int, Book_id int,   id SERIAL PRIMARY KEY  );
CREATE TABLE IF NOT EXISTS Fans (title varchar,Author_id int , FOREIGN KEY (Author_id) REFERENCES Author (id), id SERIAL PRIMARY KEY  );
