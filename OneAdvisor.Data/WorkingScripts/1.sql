--TO RUN: Shift + Cmd + E

select *
from AspNetUsers
select *
from AspNetRoles
select *
from AspNetUserRoles

select *
from dir_Application
select *
from dir_UseCase
select *
from dir_RoleToUseCase
select *
from dir_Organisation
select *
from dir_Branch
select *

from dir_AuditLog

select *
from mem_Member
select *
from mem_Policy


select *
from com_Commission
select *
from com_CommissionStatement
select *
from com_CommissionError

select *
from lkp_CommissionType

/*
select *
from dir_AuditLog
where JSON_VALUE(AuditData,'$.Table') = 'mem_Member'
    and JSON_VALUE(AuditData,'$.PrimaryKey.Id') = 'd494d4d5-6ca2-4cf6-b335-5a7e54ff16b3'

INSERT INTO lkp_CommissionType VALUES ('7216609a-9f0b-4c74-9c50-b4c5377b72d6', '023107f5-97a6-456d-9182-7bbda72ca82a', 'Unknown', 'unknown')
*/


--delete from dir_Application where Id = '2dc6f9ac-728b-4e19-9d72-0bad5fc84a03'