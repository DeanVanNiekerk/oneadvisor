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
from lkp_PolicyType


--update AspNetUsers set EmailConfirmed = 0 where id = '69e858df-093e-41a0-c031-08d6ab01fec0'