using NeedleWork2016.Models;
using NeedleWork2016.Repository.Abstract;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NeedleWork2016.Repository.Concete
{
    //Repository for colors which implement methods to operate colors data
    public class ColorRepository : IColorRepository
    {
        private readonly ApplicationDbContext _context;

        public ColorRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public IEnumerable<Color> GetColors(Guid paletteId)
        {
            return _context.Color.Where(c => c.IdPalette == paletteId);
        }

        public Color AddColor(Color color)
        {
            _context.Color.Add(color);
            _context.SaveChanges();
            return color;
        }

        public bool UpdateColor(Color color)
        {
            if (_context.Color.Any(c => c.Id == color.Id))
            {
                _context.Update(color);
                _context.SaveChanges();
                return true;
            }
            return false;
        }

        public void ChangeColorsPalette (IEnumerable<Palette> srcPalettes, Palette dstPalette)
        {
            var colorlist = _context.Color.Where(c => srcPalettes.Any(p => p.Id == c.IdPalette));
            foreach (var color in colorlist)
            {
                color.IdPalette = dstPalette.Id;
                color.Palette = dstPalette;
            }
            _context.SaveChanges();
        }

        public bool DeleteColor(Guid colorId)
        {
            if(_context.Color.Any(c => c.Id == colorId))
            {
                _context.Color.Remove(new Color { Id = colorId });
                _context.SaveChanges();
                return true;
            }
            else
                return false;
        }
    }
}
