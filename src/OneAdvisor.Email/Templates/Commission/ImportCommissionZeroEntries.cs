namespace OneAdvisor.Email.Templates.Commission
{
    public class ImportCommissionZeroEntries
    {
        public static readonly string Template = @"

        <p>Alert: A commission file was imported but 0 commission entries were imported. See details below.</p>
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
        ";
    }
}