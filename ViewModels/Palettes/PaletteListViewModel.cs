using System;
using System.Collections.Generic;
using NeedleWork2016.Models;
using System.Linq;
using NeedleWork2016.Core;
using Newtonsoft.Json;

namespace NeedleWork2016.ViewModels.Palettes
{
    //Model to interaction whith view which contains list of palettes
    public class PaletteListViewModel : AbstractResult
    {
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public IEnumerable<PaletteViewModel> Palettes { get; set; }

        public PaletteListViewModel() { }

        public PaletteListViewModel(IEnumerable<Palette> palettes) : base()
        {
            Palettes = palettes.Select(p => new PaletteViewModel(p));
        }

    }
}
