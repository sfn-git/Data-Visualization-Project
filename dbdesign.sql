CREATE TABLE DV_Project (
    id INT(11) AUTO_INCREMENT NOT NULL,
    uid INT(11) NOT NULL,
    login varchar(20),
    AvgWage FLOAT(11),
    EstPop INT(11),
    datetime DATETIME,
    PRIMARY KEY (id),
    FOREIGN KEY (uid) REFERENCES datamining.DV_User(uid)
)