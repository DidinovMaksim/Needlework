using System;
using System.Collections.Generic;
using Microsoft.AspNet.Mvc;
using NeedleWork2016.Models;
using NeedleWork2016.Core;
using System.Web;



using ExtensionMethods;

namespace NeedleWork2016.Controllers
{
    public class HomeController : Controller
    {
        private ApplicationDbContext _context;
       
        public HomeController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {           
            return View();
        }

        public IActionResult About()
        {
            
            return View();
        }

        public string ChangeCulture(string lang)
        {
            try
            {
                string returnUrl = Request.Path;
                // List of culture
                List<string> cultures = new List<string>() { "ru", "en", "de" };

                if (!cultures.Contains(lang))
                {
                    lang = "en";
                }

                // save selected culture 
                HttpCookie cookie = new HttpCookie("lang");
                cookie.Value = Request.Cookies["lang"];

                if (cookie.Value != null)
                    cookie.Value = lang;   
                else
                {
                    cookie = new HttpCookie("lang");
                    cookie.HttpOnly = false;
                    cookie.Value = lang;
                    cookie.Expires = DateTime.Now.AddYears(1);
                }
                Response.Cookies.Append("lang", cookie.Value);

                return new Message(Status.Success, 2010).ToJson();
            }
            catch (Exception ex)
            {
                return new Message(Status.Exception, ex).ToJson();
            }
            
        }
    }


}
