namespace OneAdvisor.Email.Templates.Commission
{
    public class ImportUnknownCommissionTypes
    {
        public static readonly string Template = @"

        <p>Alert: Unknown commission types where found during the import of a commission file. See details below.</p>
        <hr/>
        <h3>Environment Details</h3>
        <p><b>Environment:</b> @Model.Environment</p>
        <p><b>Organisation:</b> @Model.OrganisationName</p>
        <p><b>User:</b> @Model.UserFirstName @Model.UserLastName</p>
        <p><b>Username:</b> @Model.Username</p>
        <p><b>Email:</b> @Model.UserEmail</p>
        <hr/>
        <h3>Statement Details</h3>
        <p><b>Company:</b> @Model.CompanyName</p>
        <p><b>Statement Date:</b> @Model.StatementDate</p>
        <p><b>Statement Status:</b> @Model.StatementStatus</p>
        <p><b>Statement Template:</b> @Model.StatementTemplateName</p>
        <hr/>
        <h3>Unknown Commission Types</h3>
        <ul>
        @foreach (var commissionType in @Model.CommissionTypes)
        {
            <li>@commissionType</li>
        }
        </ul>
        ";
    }
}