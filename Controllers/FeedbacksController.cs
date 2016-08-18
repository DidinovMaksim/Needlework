using System.Linq;
using Microsoft.AspNet.Mvc;
using Microsoft.Data.Entity;
using NeedleWork2016.Models;
using System.Security.Claims;

using System.Collections.Generic;
using NeedleWork2016.Repository;
using NLog.Config;
using NLog.Targets;
using System.IO;
using NLog;
using System;
using ExtensionMethods;
using Microsoft.Extensions.Logging;
using NeedleWork2016.Core;
using System.Web.Script.Serialization;

namespace NeedleWork2016.Controllers
{
    public class FeedbacksController : Controller
    {  
        ApplicationDbContext _context;
        protected Microsoft.Extensions.Logging.ILogger Logger { get; }

        public FeedbacksController(ApplicationDbContext context, ILoggerFactory loggerFactory, IServiceProvider serviceProvider)
        {
            Logger = loggerFactory.CreateLogger(GetType().Namespace);     
            _context = context;
        }
        /// <summary>
        /// Method for get feedbacks from the database
        /// </summary>
        /// <returns></returns>
      
        [HttpPost]
        public string GetFeedbackData()
        {
            try
            {
                List<object> list = new List<object>();
                list.AddRange(FeedbackRepository.GetAllFeedbacks().Select(x => new
                {
                    Id = x.Id,
                    FirstName = x.User.FirstName,
                    LastName = x.User.LastName,
                    Email = x.User.Email,
                    Text = x.Text

                }));
                //serialized list of users and return it
                string temp = list.ToJson();
                return temp;
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.Message);
                return new Message(Status.Exception, ex).ToJson();
            }
        }

        /// <summary>
        /// Method for create a new feedback
        /// </summary>
        /// <param name="text"></param>
        /// <returns></returns>
        [HttpPost]
        public string CreateFeedBack(string text)
        {
            try
            {
                if (User.Identity.IsAuthenticated)
                {
                    Feedback _feedback = new Feedback();
                    _feedback.Text = text;
                    _feedback.IdUser = User.GetUserId();
                    _context.Feedback.Add(_feedback);
                    _context.SaveChanges();


                }
                Logger.LogInformation("Feedback successfully sent by " + User.GetUserName().ToString());
                return new Message(Status.Success, 2008).ToJson();
            }
            catch(Exception ex)
            {
                Logger.LogError(ex.Message);
                return new Message(Status.Exception, ex).ToJson();
            }
        }

        /// <summary>
        /// Method for deleting a feedback
        /// </summary>
        /// <param name="id"></param>
        [HttpDelete]
        public void DeleteFeedbackData(Guid id)
        {
            try
            {
                FeedbackRepository.DeleteFeedbackData(id);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.Message);            
            }
        }
    }
}
