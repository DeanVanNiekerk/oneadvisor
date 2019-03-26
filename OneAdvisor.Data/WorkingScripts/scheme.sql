--TO RUN: Shift + Cmd + E

SELECT TABLE_NAME
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_CATALOG='OneAdvisor'
Order by TABLE_NAME

/*
DROP TABLE dir_Application
DROP TABLE dir_Role
DROP TABLE dir_UseCase
DROP TABLE dir_Organisation
DROP TABLE dir_RoleToUseCase
DROP TABLE dir_Branch
DROP TABLE dir_User
DROP TABLE __EFMigrationsHistory
DROP TABLE AspNetRoleClaims
DROP TABLE AspNetRoles
DROP TABLE AspNetUserClaims
DROP TABLE AspNetUserLogins
DROP TABLE AspNetUserRoles
DROP TABLE AspNetUsers
DROP TABLE AspNetUserTokens
DROP TABLE com_Commission
DROP TABLE com_CommissionError
DROP TABLE com_CommissionStatement
DROP TABLE clt_Contact
DROP TABLE clt_Policy
DROP TABLE clt_Client
DROP TABLE lkp_ContactType
DROP TABLE lkp_MarritalStatus
DROP TABLE lkp_PolicyType
DROP TABLE lkp_CommissionType
DROP TABLE lkp_Company
DROP TABLE dir_AuditLog
*/