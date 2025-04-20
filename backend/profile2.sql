use profile2; 

create table users (
id int auto_increment Primary key,
email varchar(255) not null unique, 
fullName varchar(255) not null,
userName varchar(255) not null unique,
password varchar(255) not null,
phone varchar(255),
createAt date,
lastLogin date,
#constraint email_userName_uq unique (email, userName)
role varchar(255) default 'user' 
);
select * from users;
#add new user - regsiteration 
INSERT INTO users (email, fullName, userName, password, phone, createAt)
VALUES ('lian.saadeh3@gamil.com', 'lian saadeh' , 'lsaadeh', '123456', '+9627978021', NOW());

#login base on email or username base on user input
select * from users where email = 'lian.saadeh3@gamil.com' or userName = 'lsaadeh';
#then should upadte date if correct login 
update users set lastLogin = NOW() where email= 'lian.saadeh3@gamil.com';

#update case need more than line base on user update so now i will leave it but this for update full name only
update users set fullName = 'lian new' where email= 'lian.saadeh3@gamil.com';

#delete user 
delete from users where email = 'lian.saadeh3@gamil.com' or userName = 'lsaadeh' limit 1;


update users set role= 'admin' where email = 'test1@gmail.com';