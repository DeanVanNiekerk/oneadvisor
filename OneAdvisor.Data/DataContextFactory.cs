

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace OneAdvisor.Data
{
    public class DataContextFactory : IDesignTimeDbContextFactory<DataContext>
    {
        public DataContext CreateDbContext(string[] args)
        {
            //This is the connection string used for local updates
            var optionsBuilder = new DbContextOptionsBuilder<DataContext>();
            //optionsBuilder.UseSqlServer("Server=127.0.0.1,1433;Database=OneAdvisor;User ID=sa;Password=2x&%bLn3c47Y!y&hv7");
            optionsBuilder.UseSqlServer("Data Source=.\\SQLExpress;Initial Catalog=OneAdvisor;User ID=sa;Password=lead2gold");

            return new DataContext(optionsBuilder.Options);
        }
    }
}