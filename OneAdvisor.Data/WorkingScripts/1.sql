--TO RUN: Shift + Cmd + E

select *
from dir_Application
select *
from dir_Role
select *
from dir_UseCase
select *
from dir_RoleToUseCase
select *
from dir_Organisation
select *
from dir_Branch
select *
from dir_User
select *
from dir_AuditLog

select *
from mem_Member
select *
from mem_Policy


select *
from com_CommissionStatement

select *
from dir_AuditLog
where JSON_VALUE(AuditData,'$.Table') = 'mem_Member'
    and JSON_VALUE(AuditData,'$.PrimaryKey.Id') = 'd494d4d5-6ca2-4cf6-b335-5a7e54ff16b3'



--delete from lkp_CommissionType