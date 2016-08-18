using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using NeedleWork2016.Models;
using NeedleWork2016.Core;
using Newtonsoft.Json;

namespace NeedleWork2016.ViewModels.Palettes
{
    //Model to interaction whith view which contains color data
    public class ColorViewModel : AbstractResult
    {

        private Guid _id;
        private string _name;
        private string _hex;
        private Guid _idPalette;

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

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string Hex
        {
            get
            {
                return _hex;
            }

            set
            {
                _hex = value;
            }
        }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public Guid IdPalette
        {
            get
            {
                return _idPalette;
            }

            set
            {
                _idPalette = value;
            }
        }

        public ColorViewModel() { }

        public ColorViewModel(Color model) : base()
        {
            _id = model.Id;
            _name = model.Name;
            _hex = model.Hex;
            _idPalette = model.IdPalette;
        }
    }
}
