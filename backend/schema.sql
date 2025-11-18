-- make sure the database is selected
CREATE DATABASE IF NOT EXISTS bus_booking;
USE bus_booking;

-- create table (if not existing)
CREATE TABLE IF NOT EXISTS buses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  from_city VARCHAR(100),
  to_city VARCHAR(100),
  departure_time VARCHAR(10),
  arrival_time VARCHAR(10),
  duration VARCHAR(20),
  seats_left INT,
  price DECIMAL(10,2),
  rating FLOAT,
  available_days VARCHAR(100)
);

-- Insert buses for all combinations of:
-- from: Mumbai, Pune, Bangalore, Hyderabad
-- to:   Hyderabad, Chennai, Delhi, Mumbai
-- (excluding same-city Mumbai->Mumbai)
-- Each route has between 5 and 15 buses (varied).

/* 1) Mumbai -> Hyderabad (7 buses) */
INSERT INTO buses (name, from_city, to_city, departure_time, arrival_time, duration, seats_left, price, rating, available_days) VALUES
('RedBus Express 101','Mumbai','Hyderabad','06:00','15:00','9h',30,899.00,4.5,'Monday,Wednesday,Friday'),
('SRS Travels 102','Mumbai','Hyderabad','07:30','16:30','9h',24,849.00,4.3,'Tuesday,Thursday,Saturday'),
('VRL Travels 103','Mumbai','Hyderabad','09:00','18:00','9h',28,799.00,4.4,'Monday,Friday,Sunday'),
('KPN Travels 104','Mumbai','Hyderabad','10:00','19:00','9h',20,939.00,4.2,'Wednesday,Saturday'),
('Orange Travels 105','Mumbai','Hyderabad','12:00','21:00','9h',22,869.00,4.1,'Tuesday,Thursday,Sunday'),
('GreenLine 106','Mumbai','Hyderabad','14:00','23:00','9h',18,949.00,4.3,'Monday,Thursday,Saturday'),
('SkyWay 107','Mumbai','Hyderabad','20:00','05:00','9h',16,999.00,4.0,'Friday,Sunday');

-- 2) Mumbai -> Chennai (8 buses)
INSERT INTO buses (name, from_city, to_city, departure_time, arrival_time, duration, seats_left, price, rating, available_days) VALUES
('RedBus Express 201','Mumbai','Chennai','05:30','20:30','15h',20,1299.00,4.6,'Monday,Wednesday,Friday'),
('SRS Travels 202','Mumbai','Chennai','07:00','22:00','15h',18,1199.00,4.4,'Tuesday,Thursday,Saturday'),
('VRL Travels 203','Mumbai','Chennai','08:30','23:30','15h',25,1149.00,4.3,'Monday,Friday,Sunday'),
('National Travels 204','Mumbai','Chennai','06:00','21:00','15h',22,1399.00,4.5,'Wednesday,Saturday'),
('Jabbar Travels 205','Mumbai','Chennai','09:00','00:00','15h',16,1249.00,4.2,'Tuesday,Thursday,Sunday'),
('Orange Travels 206','Mumbai','Chennai','11:00','02:00','15h',28,1199.00,4.1,'Monday,Thursday,Saturday'),
('KSRTC 207','Mumbai','Chennai','13:00','04:00','15h',30,1099.00,4.0,'Friday,Sunday'),
('Neeta 208','Mumbai','Chennai','16:00','07:00','15h',14,1299.00,4.4,'Monday,Wednesday,Friday');

-- 3) Mumbai -> Delhi (9 buses)
INSERT INTO buses (name, from_city, to_city, departure_time, arrival_time, duration, seats_left, price, rating, available_days) VALUES
('RedBus Express 301','Mumbai','Delhi','05:00','19:00','14h',24,1499.00,4.6,'Monday,Wednesday,Friday'),
('SRS Travels 302','Mumbai','Delhi','06:30','20:30','14h',20,1399.00,4.3,'Tuesday,Thursday,Saturday'),
('VRL Travels 303','Mumbai','Delhi','08:00','22:00','14h',18,1349.00,4.4,'Monday,Friday,Sunday'),
('National 304','Mumbai','Delhi','07:00','21:00','14h',26,1599.00,4.5,'Wednesday,Saturday'),
('Jabbar 305','Mumbai','Delhi','09:30','23:30','14h',16,1449.00,4.2,'Tuesday,Thursday,Sunday'),
('Orange 306','Mumbai','Delhi','10:00','00:00','14h',22,1499.00,4.1,'Monday,Thursday,Saturday'),
('GreenLine 307','Mumbai','Delhi','12:00','02:00','14h',28,1299.00,4.0,'Friday,Sunday'),
('SkyWay 308','Mumbai','Delhi','14:00','04:00','14h',12,1699.00,4.4,'Monday,Wednesday,Friday'),
('KPN 309','Mumbai','Delhi','16:00','06:00','14h',20,1399.00,4.3,'Tuesday,Thursday,Sunday');

-- 4) Pune -> Hyderabad (6 buses)
INSERT INTO buses (name, from_city, to_city, departure_time, arrival_time, duration, seats_left, price, rating, available_days) VALUES
('Neeta 401','Pune','Hyderabad','06:00','14:00','8h',28,749.00,4.4,'Monday,Wednesday,Friday'),
('VRL 402','Pune','Hyderabad','07:30','15:30','8h',20,799.00,4.3,'Tuesday,Thursday,Saturday'),
('SRS 403','Pune','Hyderabad','09:00','17:00','8h',24,779.00,4.2,'Monday,Thursday,Sunday'),
('Orange 404','Pune','Hyderabad','11:00','19:00','8h',18,729.00,4.1,'Tuesday,Friday,Sunday'),
('KSRTC 405','Pune','Hyderabad','13:00','21:00','8h',30,699.00,4.0,'Monday,Wednesday,Saturday'),
('GreenLine 406','Pune','Hyderabad','15:00','23:00','8h',22,759.00,4.3,'Friday,Sunday');

-- 5) Pune -> Chennai (5 buses)
INSERT INTO buses (name, from_city, to_city, departure_time, arrival_time, duration, seats_left, price, rating, available_days) VALUES
('RedBus 501','Pune','Chennai','05:30','18:30','13h',20,1199.00,4.4,'Monday,Wednesday,Friday'),
('SRS 502','Pune','Chennai','07:00','20:00','13h',18,1149.00,4.2,'Tuesday,Thursday,Saturday'),
('Orange 503','Pune','Chennai','09:00','22:00','13h',22,1099.00,4.1,'Monday,Friday,Sunday'),
('Neeta 504','Pune','Chennai','10:30','23:30','13h',16,1299.00,4.3,'Wednesday,Saturday'),
('VRL 505','Pune','Chennai','12:00','01:00','13h',24,1249.00,4.0,'Tuesday,Thursday,Sunday');

-- 6) Pune -> Delhi (7 buses)
INSERT INTO buses (name, from_city, to_city, departure_time, arrival_time, duration, seats_left, price, rating, available_days) VALUES
('National 601','Pune','Delhi','06:00','20:00','14h',22,1399.00,4.5,'Monday,Wednesday,Friday'),
('Jabbar 602','Pune','Delhi','07:30','21:30','14h',18,1299.00,4.3,'Tuesday,Thursday,Saturday'),
('RedBus 603','Pune','Delhi','09:00','23:00','14h',20,1349.00,4.4,'Monday,Friday,Sunday'),
('SRS 604','Pune','Delhi','10:30','00:30','14h',16,1199.00,4.2,'Wednesday,Saturday'),
('Orange 605','Pune','Delhi','12:00','02:00','14h',25,1449.00,4.1,'Tuesday,Thursday,Sunday'),
('GreenLine 606','Pune','Delhi','14:00','04:00','14h',28,1399.00,4.0,'Monday,Thursday,Saturday'),
('KSRTC 607','Pune','Delhi','16:00','06:00','14h',12,1499.00,4.3,'Friday,Sunday');

-- 7) Bangalore -> Hyderabad (10 buses)
INSERT INTO buses (name, from_city, to_city, departure_time, arrival_time, duration, seats_left, price, rating, available_days) VALUES
('SRS 701','Bangalore','Hyderabad','05:30','13:30','8h',30,799.00,4.3,'Monday,Wednesday,Friday'),
('Orange 702','Bangalore','Hyderabad','06:30','14:30','8h',28,849.00,4.4,'Tuesday,Thursday,Saturday'),
('VRL 703','Bangalore','Hyderabad','08:00','16:00','8h',22,899.00,4.5,'Monday,Friday,Sunday'),
('KPN 704','Bangalore','Hyderabad','09:00','17:00','8h',20,759.00,4.2,'Tuesday,Thursday,Sunday'),
('GreenLine 705','Bangalore','Hyderabad','10:30','18:30','8h',24,799.00,4.3,'Monday,Wednesday,Friday'),
('RedBus 706','Bangalore','Hyderabad','12:00','20:00','8h',26,829.00,4.1,'Wednesday,Saturday'),
('Neeta 707','Bangalore','Hyderabad','13:00','21:00','8h',18,869.00,4.0,'Tuesday,Friday,Sunday'),
('KSRTC 708','Bangalore','Hyderabad','14:00','22:00','8h',32,749.00,4.2,'Monday,Thursday,Saturday'),
('SkyWay 709','Bangalore','Hyderabad','16:00','00:00','8h',15,899.00,4.4,'Friday,Sunday'),
('National 710','Bangalore','Hyderabad','18:00','02:00','8h',20,949.00,4.5,'Monday,Wednesday,Friday');

-- 8) Bangalore -> Chennai (9 buses)
INSERT INTO buses (name, from_city, to_city, departure_time, arrival_time, duration, seats_left, price, rating, available_days) VALUES
('ABT 801','Bangalore','Chennai','06:00','11:00','5h',35,499.00,4.2,'Monday,Wednesday,Friday'),
('SRS 802','Bangalore','Chennai','07:30','12:30','5h',30,549.00,4.3,'Tuesday,Thursday,Saturday'),
('Orange 803','Bangalore','Chennai','09:00','14:00','5h',28,599.00,4.4,'Monday,Friday,Sunday'),
('VRL 804','Bangalore','Chennai','10:30','15:30','5h',26,529.00,4.1,'Wednesday,Saturday'),
('KPN 805','Bangalore','Chennai','12:00','17:00','5h',22,559.00,4.0,'Tuesday,Thursday,Sunday'),
('RedBus 806','Bangalore','Chennai','13:30','18:30','5h',20,579.00,4.3,'Monday,Wednesday,Friday'),
('GreenLine 807','Bangalore','Chennai','15:00','20:00','5h',18,609.00,4.2,'Tuesday,Friday,Sunday'),
('KSRTC 808','Bangalore','Chennai','16:30','21:30','5h',24,489.00,4.1,'Monday,Thursday,Saturday'),
('Neeta 809','Bangalore','Chennai','18:00','23:00','5h',16,629.00,4.4,'Friday,Sunday');

-- 9) Bangalore -> Delhi (5 buses)
INSERT INTO buses (name, from_city, to_city, departure_time, arrival_time, duration, seats_left, price, rating, available_days) VALUES
('RedBus 901','Bangalore','Delhi','06:00','22:00','16h',20,1499.00,4.5,'Monday,Thursday,Saturday'),
('SRS 902','Bangalore','Delhi','08:00','00:00','16h',18,1399.00,4.3,'Tuesday,Friday,Sunday'),
('National 903','Bangalore','Delhi','07:00','23:00','16h',22,1599.00,4.4,'Monday,Wednesday,Friday'),
('Orange 904','Bangalore','Delhi','09:30','01:30','16h',16,1549.00,4.1,'Tuesday,Thursday,Sunday'),
('KPN 905','Bangalore','Delhi','12:00','04:00','16h',24,1499.00,4.2,'Wednesday,Saturday');

-- 10) Hyderabad -> Chennai (11 buses)
INSERT INTO buses (name, from_city, to_city, departure_time, arrival_time, duration, seats_left, price, rating, available_days) VALUES
('RedBus H101','Hyderabad','Chennai','05:30','13:30','8h',20,799.00,4.5,'Monday,Wednesday,Friday'),
('KPN H102','Hyderabad','Chennai','06:30','14:30','8h',18,849.00,4.4,'Tuesday,Thursday,Saturday'),
('Orange H103','Hyderabad','Chennai','07:30','15:30','8h',24,769.00,4.3,'Monday,Wednesday,Friday'),
('SRS H104','Hyderabad','Chennai','09:00','17:00','8h',26,899.00,4.2,'Tuesday,Thursday,Saturday'),
('ABT H105','Hyderabad','Chennai','10:30','18:30','8h',16,799.00,4.1,'Monday,Thursday,Sunday'),
('VRL H106','Hyderabad','Chennai','12:00','20:00','8h',22,839.00,4.3,'Wednesday,Saturday'),
('Neeta H107','Hyderabad','Chennai','13:30','21:30','8h',19,879.00,4.0,'Tuesday,Friday,Sunday'),
('KSRTC H108','Hyderabad','Chennai','15:00','23:00','8h',30,749.00,4.2,'Monday,Thursday,Saturday'),
('GreenLine H109','Hyderabad','Chennai','16:30','00:30','8h',18,899.00,4.4,'Friday,Sunday'),
('SkyWay H110','Hyderabad','Chennai','18:00','02:00','8h',14,949.00,4.1,'Monday,Wednesday,Friday'),
('National H111','Hyderabad','Chennai','20:00','04:00','8h',12,999.00,4.2,'Tuesday,Thursday,Sunday');

-- 11) Hyderabad -> Delhi (6 buses)
INSERT INTO buses (name, from_city, to_city, departure_time, arrival_time, duration, seats_left, price, rating, available_days) VALUES
('National D201','Hyderabad','Delhi','06:00','23:00','17h',22,1499.00,4.4,'Monday,Thursday,Saturday'),
('RedBus D202','Hyderabad','Delhi','07:30','00:30','17h',20,1599.00,4.3,'Tuesday,Friday,Sunday'),
('SRS D203','Hyderabad','Delhi','09:00','02:00','17h',18,1399.00,4.1,'Monday,Wednesday,Friday'),
('VRL D204','Hyderabad','Delhi','11:00','04:00','17h',25,1449.00,4.2,'Tuesday,Thursday,Sunday'),
('KPN D205','Hyderabad','Delhi','13:00','06:00','17h',16,1549.00,4.0,'Wednesday,Saturday'),
('Orange D206','Hyderabad','Delhi','15:00','08:00','17h',20,1499.00,4.2,'Friday,Sunday');

-- 12) Hyderabad -> Mumbai (5 buses)
INSERT INTO buses (name, from_city, to_city, departure_time, arrival_time, duration, seats_left, price, rating, available_days) VALUES
('RedBus M301','Hyderabad','Mumbai','06:30','15:30','9h',28,899.00,4.5,'Monday,Wednesday,Friday'),
('SRS M302','Hyderabad','Mumbai','08:00','17:00','9h',22,849.00,4.3,'Tuesday,Thursday,Saturday'),
('VRL M303','Hyderabad','Mumbai','09:30','18:30','9h',20,799.00,4.4,'Monday,Friday,Sunday'),
('National M304','Hyderabad','Mumbai','11:00','20:00','9h',18,949.00,4.2,'Wednesday,Saturday'),
('KPN M305','Hyderabad','Mumbai','14:00','23:00','9h',16,999.00,4.1,'Tuesday,Thursday,Sunday');

-- 13) Pune -> Mumbai (7 buses)
INSERT INTO buses (name, from_city, to_city, departure_time, arrival_time, duration, seats_left, price, rating, available_days) VALUES
('RedBus P101','Pune','Mumbai','06:00','07:30','1h30m',40,199.00,4.3,'Monday,Wednesday,Friday'),
('SRS P102','Pune','Mumbai','07:00','08:30','1h30m',36,219.00,4.2,'Tuesday,Thursday,Saturday'),
('VRL P103','Pune','Mumbai','08:30','10:00','1h30m',30,179.00,4.1,'Monday,Friday,Sunday'),
('Neeta P104','Pune','Mumbai','09:30','11:00','1h30m',28,189.00,4.0,'Wednesday,Saturday'),
('Orange P105','Pune','Mumbai','12:00','13:30','1h30m',24,209.00,4.4,'Tuesday,Thursday,Sunday'),
('KSRTC P106','Pune','Mumbai','14:00','15:30','1h30m',32,179.00,4.2,'Monday,Thursday,Saturday'),
('GreenLine P107','Pune','Mumbai','16:00','17:30','1h30m',26,199.00,4.1,'Friday,Sunday');

-- 14) Bangalore -> Mumbai (5 buses)
INSERT INTO buses (name, from_city, to_city, departure_time, arrival_time, duration, seats_left, price, rating, available_days) VALUES
('RedBus B101','Bangalore','Mumbai','06:00','18:00','12h',22,1299.00,4.3,'Monday,Wednesday,Friday'),
('SRS B102','Bangalore','Mumbai','08:00','20:00','12h',18,1199.00,4.2,'Tuesday,Thursday,Saturday'),
('VRL B103','Bangalore','Mumbai','09:30','21:30','12h',24,1249.00,4.4,'Monday,Friday,Sunday'),
('National B104','Bangalore','Mumbai','11:00','23:00','12h',20,1399.00,4.5,'Wednesday,Saturday'),
('KPN B105','Bangalore','Mumbai','13:00','01:00','12h',16,1349.00,4.1,'Tuesday,Thursday,Sunday');
