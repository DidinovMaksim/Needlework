using Microsoft.AspNet.Mvc;
using System.Security.Claims;
using System.Collections.Generic;
using System;
using NeedleWork2016.Core;
using NeedleWork2016.ViewModels.Palettes;
using NeedleWork2016.Repository.Abstract;
using NeedleWork2016.Models;
using Microsoft.Extensions.Logging;
using System.Linq;

namespace NeedleWork2016.Controllers
{
    public class PalettesController : Controller
    {

        IRepositoryContainer _repository;
        protected Microsoft.Extensions.Logging.ILogger Logger { get; }

        public PalettesController(IRepositoryContainer repository, ILoggerFactory loggerFactory, IServiceProvider serviceProvider)        {
            _repository = repository;
            Logger = loggerFactory.CreateLogger(GetType().Namespace);
        }

        public IActionResult Index()
        {
            return View();
        }

        //Get palettes
        [HttpGet]
        public JsonResult GetPalettes()
        {
            try
            {
                IEnumerable<Palette> palettes = _repository.PaletteRepository.GetPalettes(User.GetUserId());
                return Json(new PaletteListViewModel(palettes));
            }
            catch (Exception ex)
            {
                Logger.LogInformation(ex.Message);
                return Json(new PaletteListViewModel() { Result = new Message(Status.Exception, ex) });
            }
        }

        [HttpPost]
        public JsonResult GetStandartPalettes()
        {
            IEnumerable<Palette> palettes = _repository.PaletteRepository.GetStandartPalettes();
            return Json((new PaletteListViewModel(palettes)).Palettes);
        }

        //Get palettes for current user
        [HttpGet]
        public JsonResult GetUserPalettes()
        {
            try
            {
                if (!User.Identity.IsAuthenticated)
                    return Json(new PaletteListViewModel(){ Result = new Message(Status.Error, 1050) }); //"User is unauthenticated"

                IEnumerable< Palette > palettes = _repository.PaletteRepository.GetUserPalettes(User.GetUserId());
                var qw = Json(new PaletteListViewModel(palettes));
                return Json(new PaletteListViewModel(palettes));
            }
            catch (Exception ex)
            {
                Logger.LogInformation(ex.Message);
                return Json(new PaletteListViewModel() { Result = new Message(Status.Exception, ex) });
            }
        }

        //Remove user palette by id
        [HttpDelete]
        public JsonResult RemovePalette(Guid id)
        {
            try
            {
                if (_repository.PaletteRepository.DeletePalette(id))
                    return Json(new Message(Status.Success));
                else
                    return Json(new Message(Status.Error, 1051)); //Inaccessible palette
            }
            catch (Exception ex)
            {
                Logger.LogInformation(ex.Message);
                return Json(new Message(Status.Exception, ex));
            }
        }

        //Create new user palette without colors
        [HttpPost]
        public JsonResult CreatePalette(Palette palette)
        {
            try
            {
                if (!ModelState.IsValid)
                    return Json(new PaletteViewModel() { Result = new Message(Status.Error, 1053) });
                if (!User.Identity.IsAuthenticated)
                    return Json(new PaletteViewModel() { Result = new Message(Status.Error, 1050) }); //"User is unauthenticated"
                palette.IdUser = User.GetUserId();
                Palette AddedPalette = _repository.PaletteRepository.AddUserPalette(palette);
                return Json(new PaletteViewModel(AddedPalette));
            }
            catch (Exception ex)
            {
                Logger.LogInformation(ex.Message);
                return Json(new PaletteViewModel() { Result = new Message(Status.Exception, ex) });
            }
        }

        //Edit palette using inputed data
        [HttpPost]
        public JsonResult EditPalette(Palette palette) 
        {
            try
            {
                if (!ModelState.IsValid)
                    return Json(new Message(Status.Error, 1053));
                palette.IdUser = User.GetUserId();
                if (_repository.PaletteRepository.UpdatePalette(palette))
                    return Json(new Message(Status.Success));
                else
                    return Json(new Message(Status.Error, 1051)); //"Palette doesn't exist"
            }
            catch (Exception ex)
            {
                Logger.LogInformation(ex.Message);
                return Json(new Message(Status.Exception, ex));
            }
        }

        //Method without frontend binding
        //Combines several palettes in new one
        [HttpPost]
        public JsonResult CombinePalettes(List<Palette> palettesCollection, Palette newPalette)
        {
            try
            {
                if (!User.Identity.IsAuthenticated)
                    return Json(new PaletteViewModel() { Result = new Message(Status.Error, 1050) }); //"User is unauthenticated"

                newPalette.IdUser = User.GetUserId();
                Palette AddedPalette = _repository.PaletteRepository.AddUserPalette(newPalette);

                _repository.ColorRepository.ChangeColorsPalette(palettesCollection, AddedPalette);

                _repository.PaletteRepository.DeletePalettes(palettesCollection);
                return Json(new PaletteViewModel() { Result = new Message(Status.Success) });
            }
            catch (Exception ex)
            {
                Logger.LogInformation(ex.Message);
                return Json(new PaletteViewModel() { Result = new Message(Status.Exception, ex) });
            }
        }



        //Get colors in RGB
        [HttpGet]
        public JsonResult GetRGBColors(Guid paletteId)
        {
            try
            {
                IEnumerable<Color> colors = _repository.ColorRepository.GetColors(paletteId);
                return Json(new RGBColorsViewModel(colors));
            }
            catch (Exception ex)
            {
                Logger.LogInformation(ex.Message);
                return Json(new RGBColorsViewModel() { Result = new Message(Status.Exception, ex) });

            }
        }

        //Get colors for particular palette
        [HttpGet]
        public JsonResult GetColors(Guid paletteId)
        {
            try
            {
                IEnumerable<Color> colors = _repository.ColorRepository.GetColors(paletteId);
                return Json(new ColorListViewModel(colors));
            }
            catch (Exception ex)
            {
                Logger.LogInformation(ex.Message);
                return Json(new ColorListViewModel() { Result = new Message(Status.Exception, ex) });
            }
        }

        //Remove color by id
        [HttpDelete]
        public JsonResult RemoveColor(Guid id)
        {
            try
            {
                if (_repository.ColorRepository.DeleteColor(id))
                    return Json(new Message(Status.Success));
                else
                    return Json(new Message(Status.Error, 1052)); // "Color doesn't exist"
            }
            catch (Exception ex)
            {
                Logger.LogInformation(ex.Message);
                return Json(new Message(Status.Exception, ex));
            }
        }

        //Create new color for palette
        [HttpPost]
        public JsonResult CreateColor(Color color)
        {
            try
            {
                if (!ModelState.IsValid)
                    return Json(new Message(Status.Error, 1053));
                if (!User.Identity.IsAuthenticated)
                    return Json(new ColorViewModel() { Result = new Message(Status.Error, 1050) }); //"User is unauthenticated"

                if (!_repository.PaletteRepository.IsPaletteExist(color.IdPalette))
                    return Json(new ColorViewModel() { Result = new Message(Status.Error, 1051) }); //"Palette doesn't exist"

                Color AddedColor = _repository.ColorRepository.AddColor(color);

                if (AddedColor.Name != color.Name)
                    return Json(new ColorViewModel() { Result = new Message(Status.Error, 1052) }); // "Color doesn't exist"

                return Json(new ColorViewModel(AddedColor));
            }
            catch (Exception ex)
            {

                Logger.LogInformation(ex.Message);
                return Json(new ColorViewModel() { Result = new Message(Status.Exception, ex) });
            }
        }

        //Edit color using inputed data
        [HttpPost]
        public JsonResult EditColor(Color color) 
        {
            try
            {
                if (!ModelState.IsValid)
                    return Json(new Message(Status.Error, 1053)); 
                if (_repository.ColorRepository.UpdateColor(color))
                    return Json(new Message(Status.Success));
                else
                    return Json(new Message(Status.Error, 1052)); // "Color doesn't exist"
            }
            catch (Exception ex)
            {
                Logger.LogInformation(ex.Message);
                return Json(new Message(Status.Exception, ex));
            }
        }

    }
}
