using System;
using System.Threading.Tasks;

namespace OneAdvisor.Data
{
    public class DbInitializer : IDefaultDbContextInitializer
    {
        private readonly DataContext _context;

        public DbInitializer(DataContext context)
        {
            _context = context;
        }

        public async Task Seed()
        {
            var applications = await _context.Application.FindAsync(Guid.Parse("66c3b4e8-8a30-4a4b-be4d-3928d12fefe9"));


            // var brokers = new BrokerEntity[]
            // {
            //     new BrokerEntity{Id=dean_brokerId,FirstName="Dean",LastName="van Niekerk",Company="Alchemy"},
            //     new BrokerEntity{Id=kate_brokerId,FirstName="Kate",LastName="Tindall",Company="Alchemy"},
            //     new BrokerEntity{Id=holly_brokerId,FirstName="Holly",LastName="Woolard",Company="Alchemy"},
            //     new BrokerEntity{Id=noah_brokerId,FirstName="Noah",LastName="van Niekerk",Company="Alchemy"},
            //     new BrokerEntity{Id=becky_brokerId,FirstName="Becky",LastName="van Niekerk",Company="Alchemy"},
            //     new BrokerEntity{Id=lyla_brokerId,FirstName="Lyla",LastName="Woolard",Company="Alchemy"},
            // };
            // foreach (BrokerEntity b in brokers)
            // {
            //     _context.Broker.Add(b);
            // }

            _context.SaveChanges();
        }
    }

    public interface IDefaultDbContextInitializer
    {
        Task Seed();
    }

}