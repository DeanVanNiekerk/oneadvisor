using System;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using OneAdvisor.Model;
using OneAdvisor.Model.Directory.Model.Auth;
using OneAdvisor.Model.Directory.Model.User;
using OneAdvisor.Service.Okta.Service.Validators;

namespace OneAdvisor.Service.Okta.Test.Service.Validators
{
    [TestClass]
    public class UserValidatorTest
    {
        public UserEdit GetValidUserEditModel()
        {
            return new UserEdit()
            {
                Id = "123456",
                FirstName = "Dean",
                LastName = "van Niekerk",
                BranchId = Guid.NewGuid(),
                Login = "dean",
                Scope = Scope.Organisation,
                Email = "dean@email.com"
            };
        }

        [TestMethod]
        public void Validate_Valid()
        {
            var scope = new ScopeOptions(Guid.NewGuid(), Guid.NewGuid(), "123123", Scope.Organisation);

            var user = GetValidUserEditModel();

            var validator = new UserValidator(scope, false);
            var result = validator.Validate(user).GetResult();

            Assert.IsTrue(result.Success);
        }

        [TestMethod]
        public void Validate_InValid_Scope()
        {
            var scope = new ScopeOptions(Guid.NewGuid(), Guid.NewGuid(), "123123", Scope.User);

            var user = GetValidUserEditModel();

            var validator = new UserValidator(scope, false);
            var result = validator.Validate(user).GetResult();

            Assert.IsFalse(result.Success);

            Assert.AreEqual("Scope must be equal or to less than yours", result.ValidationFailures.Single().ErrorMessage);
        }
    }
}
