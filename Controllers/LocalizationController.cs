using Microsoft.AspNet.Mvc;
using NeedleWork2016.Core;
using Newtonsoft.Json.Linq;

namespace NeedleWork2016.Controllers
{
    public class LocalizationController : Controller
    {
        public object JsonRequestBehavior { get; private set; }

        //Method for convert json object into js and writing to Localization file
        public void Update(string language, string json)
        {
            JObject jObject = JObject.Parse(json);
            json = "var Localization = " + jObject.ToString();
            ResourceWriter.WriteJson(json, @"../wwwroot/js/Localization." + language + ".js");
        }
    }
}
