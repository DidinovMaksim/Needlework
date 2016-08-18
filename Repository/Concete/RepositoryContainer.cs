using NeedleWork2016.Models;
using NeedleWork2016.Repository.Abstract;
using NeedleWork2016.Repository.Concete;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NeedleWork2016.Repository.Concrete
{
    //Repository container which consolidate all other repositories
    public class RepositoryContainer : IRepositoryContainer
    {
        private ApplicationDbContext _context;

        public RepositoryContainer(ApplicationDbContext context)
        {
            _context = context;
        }

        public IPaletteRepository PaletteRepository
        {
            get { return new PaletteRepository(_context); }
        }

        public IColorRepository ColorRepository
        {
            get { return new ColorRepository(_context); }
        }
    }
}
