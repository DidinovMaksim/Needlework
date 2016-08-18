using NeedleWork2016.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NeedleWork2016.Repository
{
    public class FeedbackRepository
    {
        /// <summary>
        /// Method for selecting data about all feedbacks
        /// </summary>
        /// <returns></returns>
        public static List<Feedback> GetAllFeedbacks()
        {
            using (var context = new ApplicationDbContext())
            {
                return context.Feedback.Select(x => new Feedback()
                {
                    Id = x.Id,
                    Text = x.Text,
                    IdUser = x.IdUser,
                    User = x.User
                }).ToList();
            }
        }


        /// <summary>
        /// Method for feedback deletion by Id
        /// </summary>
        /// <param name="_id"></param>
        public static void DeleteFeedbackData(Guid _id)
        {
        
            using (var context = new ApplicationDbContext())
            {
                // Check of id
                if (context.Feedback.Any(c => c.Id == _id))
                {
                    context.Feedback.Remove(new Feedback { Id = _id });
                    context.SaveChanges();
                }
            }
       
        }

    }
}
