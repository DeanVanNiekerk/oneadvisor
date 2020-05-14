
DROP TABLE IF EXISTS #CommissionQueryTemp

GO

CREATE TABLE #CommissionQueryTemp
(
    ClientId UNIQUEIDENTIFIER,
    ClientLastName NVARCHAR(max),
    ClientInitials NVARCHAR(max),
    ClientDateOfBirth DATETIME2(7),
    MonthlyAnnuityMonth MONEY,
    AnnualAnnuity MONEY,
    OnceOff MONEY,
    LifeFirstYears MONEY,
    GrandTotal MONEY
)

DECLARE @BranchId0 UNIQUEIDENTIFIER;
DECLARE @StartDate DATETIME2;
DECLARE @EndDate DATETIME2;

SET @BranchId0 = 'cfaa7bf4-bff8-4c8c-b71e-f64bd8249750';;
SET @StartDate = '2019-01-01';
SET @EndDate = '2019-06-30';

--BASE QUERY
INSERT INTO #CommissionQueryTemp
SELECT
    m.Id AS 'ClientId',
    m.LastName AS 'ClientLastName',
    m.Initials AS 'ClientInitials',
    m.DateOfBirth AS 'ClientDateOfBirth',

    SUM(CASE WHEN 
        (cs.DateMonth = 4 AND cs.DateYear = 2019 AND ct.CommissionEarningsTypeId = '8b42edc0-fac6-e946-c779-9d90a805c294')
        THEN (c.AmountIncludingVAT - c.VAT) ELSE 0 END) AS 'MonthlyAnnuityMonth',

    SUM(CASE WHEN 
        ct.CommissionEarningsTypeId = 'e8799015-6f4a-5d45-5be9-0fcd516e0951' 
        THEN (c.AmountIncludingVAT - c.VAT) ELSE 0 END) AS 'AnnualAnnuity',

    SUM(CASE WHEN 
        ct.CommissionEarningsTypeId = '9f8fc29d-0f1c-b952-d446-79cc3ed967d7'
        THEN (c.AmountIncludingVAT - c.VAT) ELSE 0 END) AS 'OnceOff',

    SUM(CASE WHEN 
        ct.CommissionEarningsTypeId = 'e7f98561-f018-3edd-2118-e3646c89e2a2'  
        THEN (c.AmountIncludingVAT - c.VAT) ELSE 0 END) AS 'LifeFirstYears',

    SUM(c.AmountIncludingVAT - c.VAT) AS 'GrandTotal'

FROM clt_Client m
JOIN clt_Policy p ON p.ClientId = m.Id
JOIN com_commission c ON c.PolicyId = p.Id
JOIN com_CommissionType ct ON c.CommissionTypeId = ct.id
JOIN com_CommissionStatement cs ON c.CommissionStatementId = cs.Id
JOIN idn_User u ON c.UserId = u.Id
WHERE m.OrganisationId = '9a46c5ae-3f6f-494c-b0de-d908f08507c3'
AND m.IsDeleted = 0
AND u.BranchId IN (@BranchId0)
AND cs.Date > @StartDate
AND cs.Date <= @EndDate
GROUP BY m.Id, m.LastName, m.Initials, m.DateOfBirth

--ALLOCATIONS QUERY
INSERT INTO #CommissionQueryTemp
SELECT
    m.Id AS 'ClientId',
    m.LastName AS 'ClientLastName',
    m.Initials AS 'ClientInitials',
    m.DateOfBirth AS 'ClientDateOfBirth',

    SUM(CASE WHEN 
        (cs.DateMonth = 4 AND cs.DateYear = 2019 AND ct.CommissionEarningsTypeId = '8b42edc0-fac6-e946-c779-9d90a805c294')
        THEN (c.AmountIncludingVAT - c.VAT) ELSE 0 END) AS 'MonthlyAnnuityMonth',

    SUM(CASE WHEN 
        ct.CommissionEarningsTypeId = 'e8799015-6f4a-5d45-5be9-0fcd516e0951' 
        THEN (c.AmountIncludingVAT - c.VAT) ELSE 0 END) AS 'AnnualAnnuity',

    SUM(CASE WHEN 
        ct.CommissionEarningsTypeId = '9f8fc29d-0f1c-b952-d446-79cc3ed967d7'
        THEN (c.AmountIncludingVAT - c.VAT) ELSE 0 END) AS 'OnceOff',

    SUM(CASE WHEN 
        ct.CommissionEarningsTypeId = 'e7f98561-f018-3edd-2118-e3646c89e2a2'  
        THEN (c.AmountIncludingVAT - c.VAT) ELSE 0 END) AS 'LifeFirstYears',

    SUM(c.AmountIncludingVAT - c.VAT) AS 'GrandTotal'

FROM clt_Client m
JOIN com_CommissionAllocation ca on m.Id = ca.ToClientId
JOIN com_CommissionAllocationPolicy cap on ca.Id = cap.CommissionAllocationId
JOIN clt_Policy p ON p.Id = cap.PolicyId
JOIN com_commission c ON c.PolicyId = p.Id
JOIN com_CommissionType ct ON c.CommissionTypeId = ct.id
JOIN com_CommissionStatement cs ON c.CommissionStatementId = cs.Id
JOIN idn_User u ON c.UserId = u.Id
WHERE m.OrganisationId = '9a46c5ae-3f6f-494c-b0de-d908f08507c3'
AND m.IsDeleted = 0
AND u.BranchId IN (@BranchId0)
AND cs.Date > @StartDate
AND cs.Date <= @EndDate
GROUP BY m.Id, m.LastName, m.Initials, m.DateOfBirth
        
GO

WITH
    AllocationCounts
    AS
    (
        SELECT 
            c.Id AS 'ClientId', 
            COUNT(a.ToClientId) AS 'AllocationCount' 
        FROM clt_Client c
        LEFT JOIN com_CommissionAllocation a ON c.Id = a.ToClientId
        WHERE c.OrganisationId = '9a46c5ae-3f6f-494c-b0de-d908f08507c3'
        GROUP BY c.Id
    ),
    CommissionQueryTotaled
    AS
    (
        SELECT
            ClientId,
            ClientLastName,
            ClientInitials,
            ClientDateOfBirth,
            MonthlyAnnuityMonth,
            (AnnualAnnuity / 12) AS 'AnnualAnnuityAverage',
            ((AnnualAnnuity / 12) + MonthlyAnnuityMonth) AS 'TotalMonthlyEarnings',
            LifeFirstYears,
            OnceOff,
            GrandTotal
        FROM #CommissionQueryTemp
    ),
    CommissionQueryTotalGrouped
    AS
    (
        SELECT
            CommissionQueryTotaled.ClientId,
            ClientLastName,
            ClientInitials,
            ClientDateOfBirth,
            SUM(MonthlyAnnuityMonth) AS 'MonthlyAnnuityMonth',
            SUM(AnnualAnnuityAverage) AS 'AnnualAnnuityAverage',
            SUM(TotalMonthlyEarnings) AS 'TotalMonthlyEarnings',
            SUM(LifeFirstYears) AS 'LifeFirstYears',
            SUM(OnceOff) AS 'OnceOff',
            SUM(GrandTotal) AS 'GrandTotal',
            MAX(AllocationCounts.AllocationCount) AS 'AllocationsCount'
        FROM CommissionQueryTotaled
        LEFT JOIN AllocationCounts ON CommissionQueryTotaled.ClientId = AllocationCounts.ClientId
        GROUP BY CommissionQueryTotaled.ClientId, ClientLastName, ClientInitials, ClientDateOfBirth
    ),
    CommissionQueryNumbered
    AS
    (
        SELECT *, Row_number() OVER(ORDER BY MonthlyAnnuityMonth DESC) AS RowNumber
        FROM CommissionQueryTotalGrouped
    )

SELECT *
FROM CommissionQueryNumbered
WHERE RowNumber BETWEEN 1 AND 10

