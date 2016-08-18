using NeedleWork2016.Core;
using NeedleWork2016.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NeedleWork2016.ViewModels.Palettes
{
    //Model to interaction whith view which contains palette data
    public class AdminPaletteViewModel
    {
        private Guid _id;
        private string _name;

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public Guid Id
        {
            get
            {
                return _id;
            }

            set
            {
                _id = value;
            }
        }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string Name
        {
            get
            {
                return _name;
            }

            set
            {
                _name = value;
            }
        }

        public AdminPaletteViewModel() { }

        public AdminPaletteViewModel(Palette model)
        {
            _id = model.Id;
            _name = model.Name;
        }
    }
}
