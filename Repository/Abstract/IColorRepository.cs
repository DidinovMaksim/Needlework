using NeedleWork2016.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NeedleWork2016.Repository.Abstract
{
    //Inerface repository for colors which describes methods to operate colors data
    public interface IColorRepository
    {
        IEnumerable<Color> GetColors(Guid paletteId);
        Color AddColor(Color color);
        bool UpdateColor(Color color);
        bool DeleteColor(Guid colorId);
        void ChangeColorsPalette(IEnumerable<Palette> srcPalettes, Palette dstPalette);
    }
}
