using System.IO;

namespace NeedleWork2016.Core
{
    //Serialize resources
    public class ResourceWriter
    {
        //Method for writing string into file
        public static void WriteJson(string json, string path)
        {
            try
            {
                using (StreamWriter streamWriter = new StreamWriter(path))
                {
                    streamWriter.Write(json);
                    streamWriter.Close();
                }
            }
            catch {}
            
        }    
    }
}

