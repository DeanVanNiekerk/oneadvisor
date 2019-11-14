--TO RUN: Shift + Cmd + E

DECLARE @sql NVARCHAR(max)=''

SELECT @sql += ' DROP TABLE ' + TABLE_NAME + '; '
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_CATALOG='OneAdvisor'
Order by TABLE_NAME

--just run untill all droppped...

Exec sp_executesql @sql

