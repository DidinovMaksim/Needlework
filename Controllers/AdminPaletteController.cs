using Microsoft.AspNet.Mvc;
using NeedleWork2016.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Mvc.Rendering;
using Microsoft.Data.Entity;
using System.Web.Security;
using System.Security.Claims;
using Microsoft.AspNet.Identity;
using System.ComponentModel;
using NeedleWork2016.Core;
using NeedleWork2016.ViewModels.Palettes;
using System.Collections;
using NeedleWork2016.Repository.Abstract;
using System.Web.Script.Serialization;
using Microsoft.Extensions.Logging;
using ExtensionMethods;

namespace NeedleWork2016.Controllers
{
    public class AdminPaletteController : Controller
    {
        private ApplicationDbContext _context;


        IRepositoryContainer _repository;

        protected ILogger Logger { get; }
        public AdminPaletteController(ApplicationDbContext context, IRepositoryContainer repository,
            ILoggerFactory loggerFactory, IServiceProvider serviceProvider)        {
            Logger = loggerFactory.CreateLogger(GetType().Namespace);
            _context = context;
            _repository = repository;
        }

        [HttpPost]
        public string GetData() 
        {
            var results = _context.Palette.Select(
                    a => new
                    {
                        Id = a.Id,
                        Name = a.Name,
                        Remove = a.Id,
                    });
            return results.ToJson();
        }

        [HttpPost]
        public string GetColors(Guid paletteId)
        {
            var results = _context.Color.Select(
                    a => new
                    {
                        Id = a.Id,
                        Name = a.Name,
                        Hex = a.Hex,
                    });
            return results.ToJson();
        }
    }
}
