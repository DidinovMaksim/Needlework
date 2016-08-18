using System;

namespace NeedleWork2016.Models
{
    //Feedback model
    public partial class Feedback
    {
        public Guid Id { get; set; }
        public string Text { get; set; }
        public string IdUser { get; set; }
        public virtual ApplicationUser User { get; set; }
    }
}
