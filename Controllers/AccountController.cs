using System.Threading.Tasks;
using Microsoft.AspNet.Authorization;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Mvc;
using Microsoft.Extensions.Logging;
using NeedleWork2016.Models;
using System.Security.Claims;
using System;
using NeedleWork2016.Core;
using NeedleWork2016.Repository;
using System.IO;
using Microsoft.AspNet.Mvc.ViewEngines;
using Microsoft.AspNet.Mvc.Rendering;
using Microsoft.AspNet.Mvc.ViewFeatures;
using System.Web;
using ExtensionMethods;

namespace NeedleWork2016.Controllers
{
    [Authorize]
    public class AccountController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly ILogger _logger;
        protected ILogger Logger { get; }
        public AccountController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            ILoggerFactory loggerFactory, IServiceProvider serviceProvider)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _logger = loggerFactory.CreateLogger<AccountController>();
            Logger = loggerFactory.CreateLogger(GetType().Namespace);
        }

        public UserManager<ApplicationUser> UserManager { get; private set; }

        [HttpPost]
        [AllowAnonymous]
        //Method for user LogIn
        public async Task<string> Login(string email, string password, bool remember)
        {
            try
            {
                if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password))
                //The data was not entered
                {
                    Logger.LogError("The data was not entered "+email);
                    return new Message(Status.Error, 1003).ToJson();
                }
                if (!Core.Validation.EmailValidation(email))
                //Incorrect e-mail
                {
                    Logger.LogError("Incorrect e - mail "+ email);
                    return new Message(Status.Error, 1016).ToJson();
                }
                if (!Core.Validation.PasswordValidation(password))
                //Wrong password
                {
                    Logger.LogError("Wrong password "+ password);
                    return new Message(Status.Error, 1004).ToJson();
                }
                //Сhecking e-mail on the registered
                if (UserProfileRepository.UserIsRegistered(email))
                {
                    //Checking user email confirm
                    if (!UserProfileRepository.IsUserConfirmedEmail(email))
                    //Email unconfirmed
                    {
                        Logger.LogError("Email unconfirmed "+ email);
                        return new Message(Status.Error, 1002).ToJson();
                    }
                    //LogIn user
                    var result = await _signInManager.PasswordSignInAsync(email, password, remember, lockoutOnFailure: false);

                    if (result.Succeeded)
                    {
                        //Success LogIn
                        Logger.LogInformation("Success LogIn " + email);
                        return new Message(Status.Success, 2001).ToJson();
                    }
                    else
                    //Wrong password
                    {
                        Logger.LogError("Wrong password "+password);
                        return new Message(Status.Error, 1004).ToJson();
                    }

                }
                //Not registered
                Logger.LogError("Not registered " );
                return new Message(Status.Error, 1005).ToJson();
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.Message);
                return new Message(Status.Exception, ex).ToJson();
            }
        }

        [HttpPost]
        [AllowAnonymous]
        //Method for user registration
        public async Task<string> Register(string firstName, string lastName, string email, string password, string captchaResponse)
        {
            try
            {
                //CAPTCHA validation
                bool IsCaptchaValid = reCaptchaClass.Validate(captchaResponse) == "True" ? true : false;

                if (IsCaptchaValid)
                {
                    //Checking user data
                    if (string.IsNullOrEmpty(firstName) || string.IsNullOrEmpty(lastName))
                    {
                        //Data was not enter
                        Logger.LogError("Data was not enter");
                        return new Message(Status.Error, 1007).ToJson();
                    }

                    if (string.IsNullOrEmpty(email))
                    //Email was not enter
                    {
                        Logger.LogError("Email was not enter");
                        return new Message(Status.Error, 1008).ToJson();
                    }

                    if (!Core.Validation.EmailValidation(email))
                    //Incorrect e-mail
                    {
                        Logger.LogError("Incorrect e-mail");
                        return new Message(Status.Error, 1016).ToJson();
                    }

                    if (!Core.Validation.PasswordValidation(password))
                    //Wrong password
                    {
                        Logger.LogError("Wrong password");
                        return new Message(Status.Error, 1004).ToJson();
                    }

                    //Сhecking e-mail on the registered
                    if (UserProfileRepository.UserIsRegistered(email))
                    {
                        //Is registered
                        Logger.LogError("Is registered");
                        return new Message(Status.Error, 1009).ToJson();
                    }                   

                    //Creating new user
                    var user = new ApplicationUser
                    {
                        UserName = email,
                        Email = email,
                        FirstName = firstName,
                        LastName = lastName,
                        EmailConfirmed = false
                    };

                    //Sending message on e-mail
                    //Generation message body
                    // 2003 - Success E-mail confirm
                    var callbackUrl = GetLinkForUser(user, 2003, "Account", "ConfirmEmail");

                    //Add message tempalate
                    string template = RenderPartialViewToString("/Templates/Messages/RegistrationConfirmationMessage", GetMessageViewModel(user, callbackUrl));

                    //Sending message to user e-mail
                    EmailSender.SendEmail(email, "Confirm your account", template);

                    //Add user into DB
                    var result = await _userManager.CreateAsync(user, password);

                    //Sending confirmation email of registration
                    if (result.Succeeded)
                    {
                        //Add user role
                        await _userManager.AddToRoleAsync(user, "User");                       

                        //User LogOff
                        await _signInManager.SignOutAsync();

                        //Registration was successful
                        Logger.LogInformation("Registration was successful "+email);
                        return new Message(Status.Success, 2002).ToJson();
                    }
                    else
                    {
                        //Wrong password 
                        Logger.LogError("Wrong password");
                        return new Message(Status.Error, 1004).ToJson();
                    }
                }
                //CAPTCHA is invalid
                Logger.LogError("CAPTCHA is invalid");
                return new Message(Status.Error, 1001).ToJson();
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.Message);
                return new Message(Status.Exception, ex).ToJson();
            }
        }

        [HttpPost]
        //Method for user logOff
        public void LogOff()
        {
            _signInManager.SignOutAsync();
        }

        [HttpGet]
        [AllowAnonymous]
        //Method for confirm user mail 
        public async Task<IActionResult> ConfirmEmail(string userId, string code)
        {
            //Checking userId and email identity code
            if (userId == null || code == null)
            {
                return RedirectToAction(nameof(HomeController.Index), "Home");
            }

            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
                return RedirectToAction(nameof(HomeController.Index), "Home");

            if (UserProfileRepository.IsUserConfirmedEmail(user.Email))
                //Success E-mail confirm
                return RedirectToAction(nameof(HomeController.Index), "Home", new { successCode = 2003 });

            UserProfileRepository.EmailConfirm(user.Email);
                //Success E-mail confirm
            return RedirectToAction(nameof(HomeController.Index), "Home", new { successCode = 2003 });
        }

        

        [HttpPost]
        [AllowAnonymous]
        //Method to send message after entering the mail for the page forgot password
        public async Task<string> ForgotPassword(string email)
        {
            try
            {
                if (!Core.Validation.EmailValidation(email))
                //Incorrect e-mail
                {
                    Logger.LogError("Incorrect e - mail "+email);
                    return new Message(Status.Error, 1016).ToJson();
                }
                //Checking mail is register
                if (UserProfileRepository.UserIsRegistered(email))
                {
                    var user = await _userManager.FindByNameAsync(email);

                    //Generation message body
                    //Password is changed
                    var callbackUrl = GetLinkForUser(user, 2007, "Home", "Index");

                    //Add message template
                    string template = RenderPartialViewToString("/Templates/Messages/ResetPasswordMessage", GetMessageViewModel(user, callbackUrl));

                    //Sending message
                    EmailSender.SendEmail(email, "Change your password", template);

                    //Reset password was successful
                    Logger.LogInformation("Reset password was successful "+email);
                    return new Message(Status.Success, 2006).ToJson();
                }
                //Not registered
                Logger.LogError("Not registered");
                return new Message(Status.Error, 1005).ToJson();
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.Message);
                return new Message(Status.Exception, ex).ToJson();
            }
        }      

        [HttpPost]
        [AllowAnonymous]
        //Method for reset password
        public async Task<string> ResetPassword(string email, string password, string code)
        {
            try
            {
                //Checking e-mail identity code
                if (string.IsNullOrEmpty(code))
                //Wrong email code or userId
                {
                    Logger.LogError("Wrong email code or userId "+email);
                    return new Message(Status.Error, 1006).ToJson();
                }

                if (!Core.Validation.EmailValidation(email))
                //Incorrect e-mail
                {
                    Logger.LogError("Incorrect e - mail "+email);
                    return new Message(Status.Error, 1016).ToJson();
                }

                if (!Core.Validation.PasswordValidation(password))
                //Wrong password
                {
                    Logger.LogError("Wrong password "+password);
                    return new Message(Status.Error, 1004).ToJson();
                }

                //Check e-mail on the registered
                if (UserProfileRepository.UserIsRegistered(email))
                {
                    var user = await _userManager.FindByNameAsync(email);

                    //Reset user password
                    var result = await _userManager.ResetPasswordAsync(user, code, password);

                    if (result.Succeeded)
                    {
                        //User logIn
                        await _signInManager.PasswordSignInAsync(email, password, true, lockoutOnFailure: false);
                        //Password is changed
                        Logger.LogInformation("Password is changed "+password);
                        return new Message(Status.Success, 2007).ToJson();
                    }
                    else
                    {
                        //Wrong password
                        Logger.LogError("Wrong password "+ password);
                        return new Message(Status.Error, 1004).ToJson();
                    }
                }
                //Not registered
                Logger.LogError("Not registered");
                return new Message(Status.Error, 1005).ToJson();
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.Message);
                return new Message(Status.Exception, ex).ToJson();
            }
        }

        [HttpPost]
        //Method for change password
        public async Task<string> ChangePassword(string oldPassword, string newPassword)
        {
            try
            {
                //Get current user
                var user = await _userManager.FindByNameAsync(User.GetUserName());

                if (string.IsNullOrEmpty(oldPassword) || string.IsNullOrEmpty(newPassword))
                {
                    //Wrong password
                    Logger.LogError("Wrong password "+newPassword);
                    return new Message(Status.Error, 1004).ToJson();
                }

                //Changing user password
                var result = await _userManager.ChangePasswordAsync(user, oldPassword, newPassword);

                if (result.Succeeded)
                {
                    //Password is changed
                    Logger.LogInformation("Password is changed "+ newPassword);
                    return new Message(Status.Success, 2007).ToJson();
                }
                //Wrong password
                Logger.LogError("Wrong password "+newPassword);
                return new Message(Status.Error, 1004).ToJson();
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.Message);
                return new Message(Status.Exception, ex).ToJson();
            }
        }

        //#Region Helper
        public string GetLinkForUser(ApplicationUser user, int parametr, string controller, string action)
        {
            var code = _userManager.GeneratePasswordResetTokenAsync(user);
            var url = Url.Action(action, controller, null, protocol: HttpContext.Request.Scheme);
            url += string.Format("/?userId={0}&code={1}&successCode={2}", user.Id, code.Result, parametr);
            return url;
        }

        //method for rendering view to string
        public string RenderPartialViewToString(string viewName, object model)
        {
            if (string.IsNullOrEmpty(viewName))
                viewName = ActionContext.ActionDescriptor.Name;

            HttpCookie cookie = new HttpCookie("lang");
            cookie.Value = Request.Cookies["lang"];

            if (cookie.Value == null)
                viewName += ".en";
            else
                viewName += "." + cookie.Value;

            ViewData.Model = model;

            //reading and rendering view to string
            using (StringWriter sw = new StringWriter())
            {
                var engine = Resolver.GetService(typeof(ICompositeViewEngine)) as ICompositeViewEngine;
                ViewEngineResult viewResult = engine.FindPartialView(ActionContext, viewName);

                ViewContext viewContext = new ViewContext(ActionContext, viewResult.View, ViewData, TempData, sw, new HtmlHelperOptions());

                var t = viewResult.View.RenderAsync(viewContext);
                t.Wait();

                return sw.GetStringBuilder().ToString();
            }
        }

        //filling MessageViewModel by the data
        public object GetMessageViewModel(ApplicationUser user, string callBackUrl)
        {
            ViewModels.MessageViewModel model = new ViewModels.MessageViewModel();
            model.FirstName = user.FirstName;
            model.Link = callBackUrl;
            return model;
        }
        //End region
    }
}
