using System;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace NeedleWork2016.Core
{
    //Enumeration of possible statuses
    [JsonConverter(typeof(StringEnumConverter))]
    public enum Status
    {
        Success,
        Error,
        Exception,
        ServerError
    }
     //Error/Success result message format describing
    public class Message
    {

        public Status Status { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int Code { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string InnerException { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string Name { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string Definition { get; set; }

        public Message() { }
        
        //Constructor for success result without code
        public Message(Status status)
        {
            Status = status;
        }

        //Constructor for success/error result with code
        public Message(Status status, int code) : this(status)
        {
            Code = code;
        }

        //Constructor for Exception result
        public Message(Status result, Exception ex) : this(result)
        {
            InnerException = ex.InnerException.Message;
            Name = ex.Source;
            Definition = ex.Message;
            Code = ex.HResult;
        }
    }
}
