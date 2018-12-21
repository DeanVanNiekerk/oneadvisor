using System;

namespace OneAdvisor.Model.Exceptions
{
    public class IllegalAccessException : Exception
    {
        public IllegalAccessException(string offender, string victim, object targetData = null)
        {
            Offender = offender;
            Victim = victim;
            TargetData = targetData;
        }

        public string Offender { get; private set; }
        public string Victim { get; private set; }
        public object TargetData { get; private set; }
    }
}