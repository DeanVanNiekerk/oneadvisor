--TO RUN: Shift + Cmd + E

select *
from __EFMigrationsHistory

--update __EFMigrationsHistory set MigrationId = '20181213151930_addClientTable' where MigrationId = '20181213151930_eddClientTable'