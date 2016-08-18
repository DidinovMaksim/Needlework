using NeedleWork2016.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NeedleWork2016.Repository.Abstract
{
    //Inerface repository for palettes which describes methods to operate palettes data
    public interface IPaletteRepository
    {
        IEnumerable<Palette> GetPalettes(string userId);
        IEnumerable<Palette> GetUserPalettes(string userId);
        Palette AddUserPalette(Palette palette);
        bool UpdatePalette(Palette palette);
        bool DeletePalette(Guid paletteId);
        void DeletePalettes(IEnumerable<Palette> palettes);
        bool IsPaletteExist(Guid paletteId);
        IEnumerable<Palette> GetStandartPalettes();
    }
}
