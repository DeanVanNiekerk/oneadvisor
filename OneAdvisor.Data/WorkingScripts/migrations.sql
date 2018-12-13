--TO RUN: Shift + Cmd + E

select *
from __EFMigrationsHistory

--update __EFMigrationsHistory set MigrationId = '20181213151930_addMemberTable' where MigrationId = '20181213151930_eddMemberTable'