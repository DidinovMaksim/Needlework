using System.Collections.Generic;
using Microsoft.AspNet.Identity.EntityFramework;

namespace NeedleWork2016.Models
{
    // Add profile data for application users by adding properties to the ApplicationUser class
    public class ApplicationUser : IdentityUser
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public virtual ICollection<Palette> Palettes { get; set; }
        public virtual ICollection<Feedback> Feedbacks { get; set; }
        public virtual ICollection<PDF> PDFs { get; set; }
        public virtual ICollection<CustomerWork> CustomerWorks { get; set; }
    }

}
