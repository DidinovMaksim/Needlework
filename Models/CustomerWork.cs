using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NeedleWork2016.Models
{
    public partial class CustomerWork
    {
        public Guid Id { get; set; }
        public string Img { get; set; }
        public string IdUser { get; set; }
        public decimal Rating { get; set; }
        [JsonIgnore]
        public virtual ApplicationUser User { get; set; }
    }
}
