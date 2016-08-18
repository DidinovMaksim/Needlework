using NeedleWork2016.Core;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NeedleWork2016.ViewModels.Palettes
{
    //Abstract method which contains Result field used by all palettes and colors view models
    public abstract class AbstractResult
    {
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public Message Result { get; set; }

        public AbstractResult()
        {
            Result = new Message(Status.Success);
        }
    }
}
