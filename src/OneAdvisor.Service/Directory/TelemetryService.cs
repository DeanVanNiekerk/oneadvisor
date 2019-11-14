using System;
using System.Collections.Generic;
using Microsoft.ApplicationInsights;
using OneAdvisor.Model.Directory.Interface;

namespace OneAdvisor.Service.Directory
{
    public class TelemetryService : ITelemetryService
    {
        private TelemetryClient _telemetryClient;

        public TelemetryService(TelemetryClient telemetry)
        {
            _telemetryClient = telemetry;
        }

        public void TrackException(Exception exception, IDictionary<string, string> properties = null, IDictionary<string, double> metrics = null)
        {
            _telemetryClient.TrackException(exception, properties, metrics);
        }
    }
}