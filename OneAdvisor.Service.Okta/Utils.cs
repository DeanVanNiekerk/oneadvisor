using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using Newtonsoft.Json;

namespace OneAdvisor.Service.Okta.Service
{
    public class Utils
    {
        public static HttpClient GetHttpClient(OktaSettings settings) 
        {
            var httpClient = new HttpClient();

            httpClient.BaseAddress = new Uri(settings.BaseApi);
            httpClient.DefaultRequestHeaders.Add("Accept", "application/json");
            httpClient.DefaultRequestHeaders.Add("Authorization", $"SSWS {settings.ApiKey}");

            return httpClient;
        }

        public static HttpContent FormatObject(object model) 
        {
            return new StringContent(JsonConvert.SerializeObject(model), Encoding.UTF8, "application/json");
        }

        public static DateTime? ParseDate(string date)
        {
            if(string.IsNullOrWhiteSpace(date))
                return null;

            return DateTime.Parse(date);
        }


    }
}