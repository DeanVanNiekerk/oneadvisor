using System;
using System.Collections.Generic;

namespace OneAdvisor.Model.Directory.Interface
{
    public interface ITelemetryService
    {
        void TrackException(Exception exception, IDictionary<string, string> properties = null, IDictionary<string, double> metrics = null);
    }
}