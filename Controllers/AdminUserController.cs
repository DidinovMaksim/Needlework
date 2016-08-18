using System.Linq;
using Microsoft.AspNet.Mvc;
using System.Collections.Generic;
using NeedleWork2016.Repository;
using NeedleWork2016.Models;
using NeedleWork2016.Core;
using ExtensionMethods;
using Microsoft.Extensions.Logging;

namespace NeedleWork2016.Controllers
{
    public class AdminUserController : Controller
    {
        private ApplicationDbContext _context;
        protected ILogger Logger { get; }
        public AdminUserController(ApplicationDbContext context,
            ILoggerFactory loggerFactory, System.IServiceProvider serviceProvider)
        {
            Logger = loggerFactory.CreateLogger(GetType().Namespace);
            _context = context;
        }

        public IActionResult Index()
        {
            return View();
        }

        //Serialize to JSON
        [HttpPost]
        public string GetUserData()
        {
            try
            {
                List<object> list = new List<object>();

                list.AddRange(UserProfileRepository.GetAllUsers().Select(i => new
                {
                    Id = i.Id,
                    FirstName = i.FirstName,
                    LastName = i.LastName,
                    Email = i.Email,
                    Remove = i.Id,
                    EmailConfirmed = i.EmailConfirmed
                }));
                //serialized list of users and return it
                return list.ToJson();
            }
            catch (System.Exception ex)
            {
                return new Message(Status.Exception, ex).ToJson();
            }

        }

        //POST method for call method to user editing by Id from UserProfileRepository
        [HttpPost]
        public void EditUser(ApplicationUser user)
        {
            try
            {
                if (!(string.IsNullOrEmpty(user.Id) && string.IsNullOrEmpty(user.FirstName) && string.IsNullOrEmpty(user.LastName) && string.IsNullOrEmpty(user.Email)))
                {
                    UserProfileRepository.EditUser(user);
                }
            }
            catch {}
        }

        //POST method for call method from UserProfileRepository
        [HttpDelete]
        public void DeleteUserData(string id)
        {
            try
            {
                UserProfileRepository.DeleteUserData(id);
            }
            catch {}         
        }

        //POST method for save editing
        [HttpPost]
        public string GridSave(string id, string firstname, string lastname, string email, bool emailConfirmed)
        {
            try
            {
                if (!(string.IsNullOrEmpty(id) && string.IsNullOrEmpty(firstname) && string.IsNullOrEmpty(lastname) && string.IsNullOrEmpty(email)))
                {
                    if (!Core.Validation.EmailValidation(email))
                        //Incorrect e-mail
                        return new Message(Status.Error, 1016).ToJson();

                    if (!Core.Validation.NameValidation(firstname))
                        //Incorrect first name
                        return new Message(Status.Error, 1018).ToJson();

                    if (!Core.Validation.NameValidation(lastname))
                        //Incorrect last name
                        return new Message(Status.Error, 1019).ToJson();

                    UserProfileRepository.EditUser(new ApplicationUser()
                    {
                        Id = id,
                        FirstName = firstname,
                        LastName = lastname,
                        Email = email,
                        EmailConfirmed = emailConfirmed
                    });
                }
                //Successful editing
                Logger.LogInformation("Registration of" + email + "was successful");
                return new Message(Status.Success, 2009).ToJson();
            }
            catch (System.Exception ex)
            {
                return new Message(Status.Exception, ex).ToJson();
            }
            
        }
    }
}
