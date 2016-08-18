using NeedleWork2016.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Security.Claims;
using NeedleWork2016.Repository.Abstract;
using Microsoft.AspNet.Mvc.Rendering;


namespace NeedleWork2016.Repository.Concrete
{
    //Repository for palettes which implement methods to operate palettes data
    public class PaletteRepository : IPaletteRepository
    {
        private readonly ApplicationDbContext _context;

        public PaletteRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public IEnumerable<Palette> GetStandartPalettes()
        {
            return _context.Palette.Where(p => p.IdUser == null);
        }

        public IEnumerable<Palette> GetUserPalettes(string userId)
        {
            return _context.Palette.Where(p => p.IdUser == userId);
        }

        public IEnumerable<Palette> GetPalettes(string userId)
        {
            return _context.Palette.Where(p => (p.IdUser == null) || (p.IdUser == userId));
        }

        public Palette AddUserPalette(Palette palette)
        {
            _context.Palette.Add(palette);
            _context.SaveChanges();
            return palette;
        }

        public bool UpdatePalette(Palette palette)
        {
            if (_context.Palette.Any(p => p.Id == palette.Id))
            {
                _context.Update(palette);
                _context.SaveChanges();
                return true;
            }
            return false;
        }

        public bool DeletePalette(Guid paletteId)
        {
            if (_context.Palette.Any(p => p.Id == paletteId))
            {
                _context.Palette.Remove(new Palette { Id = paletteId });
                _context.SaveChanges();
                return true;
            }
            else
                return false;
        }

        public void DeletePalettes(IEnumerable<Palette> palettes)
        {
                _context.Palette.RemoveRange(palettes);
                _context.SaveChanges();
        }

        public bool IsPaletteExist(Guid paletteId)
        {
            return _context.Palette.Any(p => p.Id == paletteId);
        }
    }
}

