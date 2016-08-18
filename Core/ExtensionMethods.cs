using System;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace ExtensionMethods
{
    public static class Extensions
    {
        //Method for convert object to Json
        public static string ToJson(this Object obj)
        {
            return JsonConvert.SerializeObject(obj);
        }
    }
}
