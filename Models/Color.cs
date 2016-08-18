using System;
using System.ComponentModel.DataAnnotations;

namespace NeedleWork2016.Models
{
    //Color model
    public partial class Color
    {
        public Guid Id { get; set; }
        [Required]
        [RegularExpression(@"#(?:[0-9a-fA-F]{6})")]
        public string Hex { get; set; }
        [Required]
        public Guid IdPalette { get; set; }
        [Required]
        [RegularExpression(@"[0-9a-zA-Z]{3,30}$")]
        [StringLength(50, MinimumLength = 3)]
        public string Name { get; set; }

        public virtual Palette Palette { get; set; }
    }
}
