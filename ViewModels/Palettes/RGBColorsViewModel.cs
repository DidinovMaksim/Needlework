using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using NeedleWork2016.Models;
using NeedleWork2016.Core;
using Newtonsoft.Json;

namespace NeedleWork2016.ViewModels.Palettes
{
    //Model to interaction whith view which contains RGB colors list
    public class RGBColorsViewModel : AbstractResult
    {
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public ArrayList RGBColors { get; private set; }

        public RGBColorsViewModel() { }

        //Initializing RGB color list
        public RGBColorsViewModel(IEnumerable<Color> colors) : base()
        {
            RGBColors = new ArrayList();
            RGBColors.AddRange(colors.Select(c => ColorConverter.HexToRGB(c.Hex, c.Name)).ToList());
        }
    }
}
