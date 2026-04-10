
/* 
have created a database
create to create the commands
have used foriegn keys to connect the database tables
have incorparated queries to fetch the data and all
right now the values of the databse are empty but we have to add our values i want to add them dynamically so we can test it
*/

show databases;
use skillLinkDB;
show tables;
CREATE table user(
    user_id int auto_increment primary key,
    name varchar(100) not null,
    email varchar(100) unique not null,
    password varchar(225) not null,
    branch varchar(50),
    semester int,
    created_at timestamp default current_timestamp
);

select * from users;

create table user_profile(
    profile_id int auto_increment primary key,
    user_id int,
    profile_image varchar(255),
    bio text,
    phone varchar(15),
    github_link varchar(255),
    linkedin_link varchar(255),
    foreign key(user_id) references users(user_id) on delete cascade on update cascade
);

select * from user_profile;

create table skill(
    skill_id int auto_increment primary key,
    skill_name varchar(100) not null,
    category varchar(20)
)

create table user_skill(
    user_skill_id int auto_increment primary key,
    user_id int,
    skill_id int,
    proficiency varchar(20),
    experience_years int,
    foreign key(user_id) references users(user_id) on delete cascade on update cascade,
    foreign key(skill_id) references skill(skill_id) on delete cascade on update cascade
)

create table skill_request(
    request_id int auto_increment primary key,
    sender_id int,
    receiver_id int,
    user_skill_id int,
    req_date timestamp default current_timestamp,
    message text,
    status ENUM('pending', 'accepted', 'rejected','completed') default 'pending',
    foreign key(sender_id) references users(user_id) on delete cascade on update cascade,
    foreign key(receiver_id) references users(user_id) on delete cascade on update cascade
);

select s.skill_name, u.proficiency
from user_skill u
join skill s on u.skill_id=s.skill_id
where u.user_id=1;

drop table user;

CREATE table users(
    user_id int auto_increment primary key,
    name varchar(100) not null,
    email varchar(100) unique not null,
    password varchar(225) not null,
    branch varchar(50),
    semester int,
    created_at timestamp default current_timestamp
);

describe users;
describe user_profile;
describe skill;
describe user_skill;
describe skill_request;

alter TABLE users modify password varchar(255) not null;

/*INSERT INTO users (name,email,password,branch,semester)
VALUES
('Srujan Bhat','srujan@gmail.com','pass123','CSE',4),
('Gladia Jermen C','nnm24cc015@nmamit.in','pass123','ECE',5),
('Sumukha B R','nnm24cc063@nmamit.in','pass123','CSE',3),
('Sudarshan Bhat','nnm25cc505@nmamit.in','pass123','ME',6);

SELECT * FROM users;

/*INSERT INTO user_profile
(user_id,profile_image,bio,phone,github_link,linkedin_link)
VALUES
(1,'images/srujan.jpg','Backend developer interested in system design','9876543210','https://github.com/srujan','https://linkedin.com/in/srujan'),
(2,'images/rahul.jpg','Electronics enthusiast and robotics club member','9876543211','https://github.com/rahul','https://linkedin.com/in/rahul'),
(3,'images/ananya.jpg','Full stack developer and hackathon participant','9876543212','https://github.com/ananya','https://linkedin.com/in/ananya'),
(4,'images/vikram.jpg','Mechanical engineer learning data science','9876543213','https://github.com/vikram','https://linkedin.com/in/vikram');*/

SELECT * FROM user_profile;

SELECT 
    users.name,
    users.email,
    user_profile.bio,
    user_profile.github_link
FROM users
JOIN user_profile 
ON users.user_id = user_profile.user_id;



INSERT INTO users (name,email,password,branch,semester)
VALUES
('Srujan Bhat','srujan@gmail.com','pass123','CSE',4),
('Rahul Sharma','rahul@gmail.com','pass123','ECE',5),
('Ananya Rao','ananya@gmail.com','pass123','CSE',3),
('Vikram Patel','vikram@gmail.com','pass123','ME',6),
('Sneha Nair','sneha@gmail.com','pass123','IT',4);

INSERT INTO user_profile
(user_id,profile_image,bio,phone,github_link,linkedin_link)
VALUES
(1,'images/srujan.jpg','Backend developer interested in system design','9876543210','https://github.com/srujan','https://linkedin.com/in/srujan'),
(2,'images/rahul.jpg','Electronics enthusiast and robotics club member','9876543211','https://github.com/rahul','https://linkedin.com/in/rahul'),
(3,'images/ananya.jpg','Full stack developer and hackathon participant','9876543212','https://github.com/ananya','https://linkedin.com/in/ananya'),
(4,'images/vikram.jpg','Mechanical engineer learning data science','9876543213','https://github.com/vikram','https://linkedin.com/in/vikram'),
(5,'images/sneha.jpg','Frontend developer passionate about UI/UX','9876543214','https://github.com/sneha','https://linkedin.com/in/sneha');

SELECT 
    users.name,
    users.email,
    user_profile.bio,
    user_profile.github_link
FROM users
JOIN user_profile 
ON users.user_id = user_profile.user_id;
/*
set foreign_key_checks = 0;
TRUNCATE TABLE user_profile;
TRUNCATE TABLE users;
TRUNCATE TABLE skill;
TRUNCATE TABLE user_skill; 
TRUNCATE TABLE skill_request;
set foreign_key_checks = 1;
*/
/*here are the important queries. any more and we will add it when we add the feature */


/*fetching complete profile of a user by joining users and user_profile tables*/
SELECT 
    u.user_id,
    u.name,
    u.email,
    u.branch,
    u.semester,
    p.bio,
    p.github_link,
    p.linkedin_link
FROM users u
JOIN user_profile p
ON u.user_id = p.user_id
WHERE u.user_id = 1;

/*to filter by branch and semester. the ? are placeholders for the actual values. which we have to make backend logic for so we ca call from the frontend*/
SELECT name, email, semester
FROM users
WHERE branch = ? AND semester = ? ;
