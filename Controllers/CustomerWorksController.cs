using log4net.Repository.Hierarchy;
using Microsoft.AspNet.Mvc;
using NeedleWork2016.Core;
using NeedleWork2016.Models;
using NeedleWork2016.Repository.Abstract;
using NeedleWork2016.ViewModels.Palettes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;


namespace NeedleWork2016.Controllers
{
    public class CustomerWorksController : Controller
    {
        ApplicationDbContext _context;

        IRepositoryContainer _repository;

        public CustomerWorksController(IRepositoryContainer repository, ApplicationDbContext context)
        {
            _repository = repository;
            _context = context;
        }

        //Method without frontend binding
        //Get customer Works
        [HttpGet]
        public JsonResult GetCustomerWorks()
        {
            var customerWorks = _context.CustomerWork;
            return Json(customerWorks);
        }


        //Method without frontend binding
        //Add customer works
        [HttpGet]
        public JsonResult AddCustomerWork(CustomerWork customerWork)
        {
            try
            {
                if (!User.Identity.IsAuthenticated)
                    return Json(new Message(Status.Error, 1050)); //"User is unauthenticated"
                customerWork.IdUser = User.GetUserId();
                _context.CustomerWork.Add(customerWork);
                _context.SaveChanges();
                return Json(new Message(Status.Success));
            }
            catch (Exception ex)
            {
                return Json(new Message(Status.Exception, ex));
            }
        }

    }
}
