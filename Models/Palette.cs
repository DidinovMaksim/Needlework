using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace NeedleWork2016.Models
{
    //Palette model
    public partial class Palette
    {
        //constructor for initialize HeshSet
        public Palette()
        {
            Colors = new HashSet<Color>();
        }

        public Guid Id { get; set; }

        public string IdUser { get; set; }

        [Required]
        [RegularExpression(@"^[0-9a-zA-Z]{3,30}$")]
        [StringLength(50, MinimumLength = 3)]
        public string Name { get; set; }

        public virtual ICollection<Color> Colors { get; set; }
        public virtual ApplicationUser User { get; set; }
    }
}
