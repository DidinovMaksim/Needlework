using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NeedleWork2016.Repository.Abstract
{
    //Interface for repository container which provides coupling decrease for domain layer and business logic
    public interface IRepositoryContainer
    {
        IPaletteRepository PaletteRepository { get; }
        IColorRepository ColorRepository { get; }
    }
}
