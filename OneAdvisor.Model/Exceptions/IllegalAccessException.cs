using System;

namespace OneAdvisor.Model.Exceptions
{
    public class IllegalAccessException : Exception
    {
        public IllegalAccessException(Guid offendingOrganisation, Guid victimOrganisation, object targetData = null)
        {
            OffendingOrganisation = offendingOrganisation;
            VictimOrganisation = victimOrganisation;
            TargetData = targetData;
        }

        public Guid OffendingOrganisation { get; private set; }
        public Guid VictimOrganisation { get; private set; }
        public object TargetData { get; private set; }
    }
}