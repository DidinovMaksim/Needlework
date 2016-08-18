using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace NeedleWork2016.Core
{
    public class ColorConverter
    {
        //Convertation color in hexademical format to RGB format with name
        public static object[] HexToRGB(string hexColor, string colorname)
        {
            if (hexColor.IndexOf('#') != -1)
                hexColor = hexColor.Replace("#", "");
            int red = 0;
            int green = 0;
            int blue = 0;

            red = int.Parse(hexColor.Substring(0, 2), NumberStyles.AllowHexSpecifier);
            green = int.Parse(hexColor.Substring(2, 2), NumberStyles.AllowHexSpecifier);
            blue = int.Parse(hexColor.Substring(4, 2), NumberStyles.AllowHexSpecifier);

            return new object[4] { red, green, blue, colorname };
        }
    }
}
