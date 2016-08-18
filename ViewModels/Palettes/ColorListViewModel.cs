using NeedleWork2016.Core;
using NeedleWork2016.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NeedleWork2016.ViewModels.Palettes
{
    //Model to interaction whith view which contains list of colors
    public class ColorListViewModel : AbstractResult
    {
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public IEnumerable<ColorViewModel> Colors { get; set; }

        public ColorListViewModel() { }

        public ColorListViewModel (IEnumerable<Color> colors) : base()
        {
            Colors = colors.Select(c => new ColorViewModel(c));
        }
    }
}
