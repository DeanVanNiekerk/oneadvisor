
WITH
    CommissionQuery
    AS
    (
        SELECT
            m.Id AS 'ClientId',
            m.LastName AS 'ClientLastName',
            m.Initials AS 'ClientInitials',
            m.DateOfBirth AS 'ClientDateOfBirth',

            SUM(CASE WHEN 
            (MONTH(cs.date) = 3 AND YEAR(cs.date) = 2019 AND ct.commissionEarningsTypeId = '8b42edc0-fac6-e946-c779-9d90a805c294')
            THEN c.amountIncludingVat ELSE 0 END) AS 'MonthlyAnnuityMonth',

            SUM(CASE WHEN 
            ct.commissionEarningsTypeId = 'e8799015-6f4a-5d45-5be9-0fcd516e0951' 
            THEN c.amountIncludingVat ELSE 0 END) AS 'AnnualAnnuity',

            SUM(CASE WHEN 
            ct.commissionEarningsTypeId = 'e7f98561-f018-3edd-2118-e3646c89e2a2' 
            THEN c.amountIncludingVat ELSE 0 END) AS 'LifeFirstYears',

            SUM(CASE WHEN 
            ct.commissionEarningsTypeId = '9f8fc29d-0f1c-b952-d446-79cc3ed967d7' 
            THEN c.amountIncludingVat ELSE 0 END) AS 'OnceOff'

        FROM com_commission c
            JOIN com_commissionStatement cs ON c.commissionStatementId = cs.id
            JOIN clt_policy p ON c.policyId = p.id
            JOIN clt_client m ON p.clientId = m.id
            JOIN lkp_commissionType ct ON c.commissionTypeId = ct.id
            JOIN lkp_commissionEarningsType cet ON ct.commissionEarningsTypeId = cet.id
        GROUP BY m.Id, m.LastName, m.Initials, m.DateOfBirth
    )
    ,
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
            ((((AnnualAnnuity / 12) + MonthlyAnnuityMonth) * 12) + LifeFirstYears + OnceOff) AS 'GrandTotal'
        FROM CommissionQuery
    ),
    CommissionQueryNumbered
    AS
    (
        SELECT
            Row_number() OVER(ORDER BY TotalMonthlyEarnings DESC) AS RowNumber,
            *
        FROM CommissionQueryTotaled
    )

SELECT *
FROM CommissionQueryNumbered
WHERE RowNumber BETWEEN 1 AND 10

-- SELECT * FROM clt_client

--AND cs.Date >= '2018-02-28' AND cs.Date <= '2019-02-28' 
--WHERE m.OrganisationId = '9a46c5ae-3f6f-494c-b0de-d908f08507c3'



WITH
    CommissionQuery
    AS
    (
        SELECT
            m.Id AS 'ClientId',
            m.LastName AS 'ClientLastName',
            m.Initials AS 'ClientInitials',
            m.DateOfBirth AS 'ClientDateOfBirth',
            SUM(CASE WHEN (cs.DateMonth = 2 AND cs.DateYear = 2019 AND ct.CommissionEarningsTypeId = '8b42edc0-fac6-e946-c779-9d90a805c294')
    THEN c.AmountIncludingVAT ELSE 0 END) AS 'MonthlyAnnuityMonth',
            SUM(CASE WHEN ct.CommissionEarningsTypeId = 'e8799015-6f4a-5d45-5be9-0fcd516e0951'
    THEN c.amountIncludingVat ELSE 0 END) AS 'AnnualAnnuity',
            SUM(CASE WHEN ct.CommissionEarningsTypeId = '9f8fc29d-0f1c-b952-d446-79cc3ed967d7'
    THEN c.AmountIncludingVAT ELSE 0 END) AS 'OnceOff',
            SUM(CASE WHEN ct.CommissionEarningsTypeId = 'e7f98561-f018-3edd-2118-e3646c89e2a2'
    THEN c.AmountIncludingVAT ELSE 0 END) AS 'LifeFirstYears'

        FROM com_commission c
            JOIN com_CommissionStatement cs ON c.CommissionStatementId = cs.Id
            JOIN clt_Policy p ON c.PolicyId = p.Id
            JOIN clt_Client m ON p.ClientId = m.Id
            JOIN lkp_CommissionType ct ON c.CommissionTypeId = ct.id
            JOIN lkp_CommissionEarningsType cet ON ct.CommissionEarningsTypeId = cet.Id
        WHERE m.OrganisationId = '9a46c5ae-3f6f-494c-b0de-d908f08507c3'
            AND cs.Date >= '2018-02-28' AND cs.Date <= '2019-02-28'
        GROUP BY m.Id, m.LastName, m.Initials, m.DateOfBirth
    ),
    CommissionQueryTotaled
    AS
    (
        SELECT
            ClientId, ClientLastName, ClientInitials, ClientDateOfBirth, MonthlyAnnuityMonth,
            (AnnualAnnuity / 12) AS 'AnnualAnnuityAverage',
            ((AnnualAnnuity / 12) + MonthlyAnnuityMonth) AS 'TotalMonthlyEarnings',
            LifeFirstYears,
            OnceOff,
            ((((AnnualAnnuity / 12) + MonthlyAnnuityMonth) * 12) + LifeFirstYears + OnceOff) AS 'GrandTotal'
        FROM CommissionQuery
    ),
    CommissionQueryNumbered
    AS
    (
        SELECT *, Row_number() OVER(ORDER BY MonthlyAnnuityMonth DESC) AS RowNumber
        FROM CommissionQueryTotaled
    )
SELECT *
FROM CommissionQueryNumbered
WHERE RowNumber BETWEEN 1 AND 10


--CREATE NONCLUSTERED INDEX [clientOrganisationId] ON [dbo].[clt_Client] ([OrganisationId])
--DROP INDEX [clt_client_OrganisationId_Index] ON [dbo].[clt_Client]

IF NOT EXISTS(SELECT *
FROM sys.indexes
WHERE name = 'clt_client_OrganisationId_Index')
    BEGIN
    CREATE NONCLUSTERED INDEX [clt_client_OrganisationId_Index] ON [dbo].[clt_Client] ([OrganisationId])
END

SELECT *
FROM sys.indexes


SELECT
    -- TOP 100
    m.Id AS 'ClientId',
    m.LastName AS 'ClientLastName',
    m.Initials AS 'ClientInitials',
    m.DateOfBirth AS 'ClientDateOfBirth',
    m.OrganisationId AS 'OrganisationId'

FROM com_commission c
    JOIN com_CommissionStatement cs ON c.CommissionStatementId = cs.Id
    JOIN clt_Policy p ON c.PolicyId = p.Id
    JOIN clt_Client m ON p.ClientId = m.Id
    JOIN lkp_CommissionType ct ON c.CommissionTypeId = ct.id
    JOIN lkp_CommissionEarningsType cet ON ct.CommissionEarningsTypeId = cet.Id
WHERE m.OrganisationId = '9a46c5ae-3f6f-494c-b0de-d908f08507c3'
    --AND cs.Date >= '2018-02-28' AND cs.Date <= '2019-02-28' 










