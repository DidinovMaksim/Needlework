using System.Collections.Generic;
using Newtonsoft.Json;
using ExtensionMethods;

namespace NeedleWork2016.Core
{
    //class for class for a working with reCaptcha
    public class reCaptchaClass
    {
        private string m_Success;

        [JsonProperty("success")] 
        public string Success
        {
            get { return m_Success; }
            set { m_Success = value; }           
        }

        private List<string> m_ErrorCodes;

        [JsonProperty("error-codes")]
        public List<string> ErrorCodes
        {
            get { return m_ErrorCodes; }
            set { m_ErrorCodes = value; }
        }

        //Method that send request for the check CAPTCHA validation
        public static string Validate(string EncodedResponse)
        {
            try
            {
                var client = new System.Net.WebClient();
                string PrivateKey = "6LeTQxcTAAAAACs7Za-iYjtPzOTOBBHxdx4zW29E";
                var reply = client.DownloadString(string.Format("https://www.google.com/recaptcha/api/siteverify?secret={0}&response={1}", PrivateKey, EncodedResponse));
                var captchaResponse = JsonConvert.DeserializeObject<reCaptchaClass>(reply);
                return captchaResponse.Success;
            }
            catch (System.Exception ex)
            {
                return new Message(Status.Exception, ex).ToJson();
            }
           
        }

    }
}
