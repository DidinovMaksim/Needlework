using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Drawing;
using System.Net;
using Microsoft.AspNet.Http;

namespace NeedleWork2016.Core
{
    public class PDFdata
    {

        private iTextSharp.text.Image image;
        public void P(byte[] data)
        {
            using (FileStream file = new FileStream("file.pdf", FileMode.Create, System.IO.FileAccess.Write))
            {
                file.Write(data, 0, data.Length);
            }

        }
        /// <summary>
        /// This method convers base64 string to byte array
        /// </summary>
        /// <param name="imageData"></param>
        /// <returns></returns>
        public byte[] StringToCode(string imageData)
        {
            byte[] data = Convert.FromBase64String(imageData);

            return data;
        }
        /// <summary>
        /// This method get text of the html via the url
        /// </summary>
        /// <param name="url"></param>
        /// <returns></returns>
        public string GetHtmlPageText(string url)
        {
            string txt = String.Empty;
            WebRequest req = WebRequest.Create(url);
            WebResponse resp = req.GetResponse();
            using (Stream stream = resp.GetResponseStream())
            {
                using (StreamReader sr = new StreamReader(stream))
                {
                    txt = sr.ReadToEnd();
                }
            }

            return txt;
        }
        /// <summary>
        /// This method convers html text to the byte array
        /// </summary>
        /// <param name="html"></param>
        /// <returns></returns>
        public Byte[] PdfSharpConvert(String html)
        {
            Byte[] res = null;
            using (MemoryStream ms = new MemoryStream())
            {
                var pdf = TheArtOfDev.HtmlRenderer.PdfSharp.PdfGenerator.GeneratePdf(html, PdfSharp.PageSize.A4);
                pdf.Save(ms);
                res = ms.ToArray();
            }
            return res;
        }
        /// <summary>
        /// 
        /// This method create the image on the base of the byte array
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        public iTextSharp.text.Image GetImage(byte[] data)
        {

            image = iTextSharp.text.Image.GetInstance(byteArrayToImage1(data), System.Drawing.Imaging.ImageFormat.Jpeg);

            image.ScalePercent(200);

            return image;

        }
        /// <summary>
        /// This method converts byte array to the image
        /// </summary>
        /// <param name="byteArrayIn"></param>
        /// <returns></returns>
        public System.Drawing.Image byteArrayToImage1(byte[] byteArrayIn)
        {

            MemoryStream ms = new MemoryStream(byteArrayIn);

            return System.Drawing.Image.FromStream(ms);

        }
    }
}
