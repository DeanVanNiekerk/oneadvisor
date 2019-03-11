

SELECT
    m.id AS 'MemberId',
    m.firstName AS 'MemberFirstName',
    m.lastName AS 'MemberLastName',

    SUM(CASE WHEN 
    ct.commissionEarningsTypeId = 'e8799015-6f4a-5d45-5be9-0fcd516e0951' 
    THEN c.amountIncludingVat ELSE 0 END) AS 'AnnualAnnuity',
    SUM(CASE WHEN 
    (MONTH(cs.date) = 3 AND YEAR(cs.date) = 2019 AND ct.commissionEarningsTypeId = 'e8799015-6f4a-5d45-5be9-0fcd516e0951')
    THEN c.amountIncludingVat ELSE 0 END) AS 'AnnualAnnuityMonth',

    SUM(CASE WHEN 
    ct.commissionEarningsTypeId = '8b42edc0-fac6-e946-c779-9d90a805c294' 
    THEN c.amountIncludingVat ELSE 0 END) AS 'MonthlyAnnuity',
    SUM(CASE WHEN 
    (MONTH(cs.date) = 3 AND YEAR(cs.date) = 2019 AND ct.commissionEarningsTypeId = '8b42edc0-fac6-e946-c779-9d90a805c294')
    THEN c.amountIncludingVat ELSE 0 END) AS 'MonthlyAnnuityMonth',

    SUM(CASE WHEN 
    ct.commissionEarningsTypeId = '9f8fc29d-0f1c-b952-d446-79cc3ed967d7' 
    THEN c.amountIncludingVat ELSE 0 END) AS 'OnceOff',
    SUM(CASE WHEN 
    (MONTH(cs.date) = 3 AND YEAR(cs.date) = 2019 AND ct.commissionEarningsTypeId = '9f8fc29d-0f1c-b952-d446-79cc3ed967d7')
    THEN c.amountIncludingVat ELSE 0 END) AS 'OnceOffMonth',

    SUM(CASE WHEN 
    ct.commissionEarningsTypeId = 'e7f98561-f018-3edd-2118-e3646c89e2a2' 
    THEN c.amountIncludingVat ELSE 0 END) AS 'LifeFirstYears',
    SUM(CASE WHEN 
    (MONTH(cs.date) = 3 AND YEAR(cs.date) = 2019 AND ct.commissionEarningsTypeId = 'e7f98561-f018-3edd-2118-e3646c89e2a2')
    THEN c.amountIncludingVat ELSE 0 END) AS 'LifeFirstYearsMonth'

FROM com_commission c
    JOIN com_commissionStatement cs ON c.commissionStatementId = cs.id
    JOIN mem_policy p ON c.policyId = p.id
    JOIN mem_member m ON p.memberId = m.id
    JOIN lkp_commissionType ct ON c.commissionTypeId = ct.id
    JOIN lkp_commissionEarningsType cet ON ct.commissionEarningsTypeId = cet.id
WHERE cs.date BETWEEN '2018-03-02' AND '2019-03-02'
GROUP BY m.id, m.firstName, m.lastName

-- SELECT * FROM lkp_commissionEarningsType

-- select
--     COUNT(p.userId)
-- from com_commission c
--     join com_commissionStatement cs on c.commissionStatementId = cs.id
--     join mem_policy p on c.policyId = p.id
--     join lkp_commissionType ct on c.commissionTypeId = ct.id
--     join lkp_commissionEarningsType cet on ct.commissionEarningsTypeId = cet.id







