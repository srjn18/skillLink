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

select * from user;

create table user_profile(
    profile_id int auto_increment primary key,
    user_id int,
    profile_image varchar(255),
    bio text,
    phone varchar(15),
    github_link varchar(255),
    linkedin_link varchar(255),
    foreign key(user_id) references user(user_id) on delete cascade on update cascade
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
    foreign key(user_id) references user(user_id) on delete cascade on update cascade,
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
    foreign key(sender_id) references user(user_id) on delete cascade on update cascade,
    foreign key(receiver_id) references user(user_id) on delete cascade on update cascade
);

select s.skill_name, u.proficiency
from user_skill u
join skill s on u.skill_id=s.skill_id
where u.user_id=1;