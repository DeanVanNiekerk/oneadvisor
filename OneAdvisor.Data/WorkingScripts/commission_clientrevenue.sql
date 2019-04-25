
WITH
    CommissionQuery
    AS
    (
        SELECT
            m.Id AS 'ClientId',
            m.LastName AS 'ClientLastName',
            m.Initials AS 'ClientInitials',
            m.DateOfBirth AS 'ClientDateOfBirth',
            SUM(CASE 
            WHEN (cs.DateMonth = 4 AND cs.DateYear = 2019 AND ct.CommissionEarningsTypeId = '8b42edc0-fac6-e946-c779-9d90a805c294') 
            THEN c.AmountIncludingVAT ELSE 0 END) AS 'MonthlyAnnuityMonth',
            SUM(CASE 
            WHEN ct.CommissionEarningsTypeId = 'e8799015-6f4a-5d45-5be9-0fcd516e0951'
            THEN c.amountIncludingVat ELSE 0 END) AS 'AnnualAnnuity',
            SUM(CASE 
            WHEN ct.CommissionEarningsTypeId = '9f8fc29d-0f1c-b952-d446-79cc3ed967d7'
            THEN c.AmountIncludingVAT ELSE 0 END) AS 'OnceOff',
            SUM(CASE 
            WHEN ct.CommissionEarningsTypeId = 'e7f98561-f018-3edd-2118-e3646c89e2a2'
            THEN c.AmountIncludingVAT ELSE 0 END) AS 'LifeFirstYears'
        FROM com_commission c
            JOIN com_CommissionStatement cs ON c.CommissionStatementId = cs.Id
            JOIN clt_Policy p ON c.PolicyId = p.Id
            JOIN clt_Client m ON p.ClientId = m.Id
            JOIN com_CommissionType ct ON c.CommissionTypeId = ct.id
            JOIN com_CommissionEarningsType cet ON ct.CommissionEarningsTypeId = cet.Id
        WHERE m.OrganisationId = '9a46c5ae-3f6f-494c-b0de-d908f08507c3'
            AND cs.Date > '2018-04-30'
            AND cs.Date <= '2019-04-30'
        GROUP BY m.Id, m.LastName, m.Initials, m.DateOfBirth
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