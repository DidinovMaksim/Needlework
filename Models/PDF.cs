using System;

namespace NeedleWork2016.Models
{
    //PDF model
    public class PDF
    {
        public Guid Id { get; set; }
        public byte[] PdfData { get; set; }
        public string IdUser { get; set; }
        public virtual ApplicationUser User { get; set; }
    }
}
