using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using OneAdvisor.Model.Directory.Interface.Repository;
using OneAdvisor.Model.Directory.Interface.Service;
using OneAdvisor.Model.Directory.Model.User;

namespace OneAdvisor.Service.Directory
{
	public class UserService : IUserService
	{
		public UserService(IUserRepository userRepository)
		{
			UserRepository = userRepository;
		}

		private IUserRepository UserRepository { get; }

		public Task<IEnumerable<UserInfo>> GetUsers()
		{
			return UserRepository.GetUsers();
		}
	}
}
