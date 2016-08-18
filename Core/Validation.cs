using System.Text.RegularExpressions;

namespace NeedleWork2016.Core
{
    //class for validation 
    public static class Validation
    {
        //Method for e-mail validation
        public static bool NameValidation(string name)
        {
            if (string.IsNullOrEmpty(name))
                return false;

            Regex reg = new Regex(@"^([a-zA-Zа-яА-Я]+)$");
            if (!reg.Match(name).Success)
                return false;

            return true;
        }

        //Method for e-mail validation
        public static bool EmailValidation(string email)
        {
            if (string.IsNullOrEmpty(email))
                return false;

            Regex reg = new Regex(@"^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,12}$");
            if (!reg.Match(email).Success)
                return false;

            return true;
        }

        //Method for password validation
        public static bool PasswordValidation(string password)
        {
            Message error = new Message();
            error.Name = "Password error";

            if (string.IsNullOrEmpty(password))
                return false;

            Regex reg;

            if (password.Length < 6)
                return false;

            reg = new Regex(@"[a-z]{1,}");
            if (!reg.Match(password).Success)
                return false;

            reg = new Regex(@"[A-Z]{1,}");
            if (!reg.Match(password).Success)
                return false;

            reg = new Regex(@"[\W]{1,}");
            if (!reg.Match(password).Success)
                return false;

            return true;
        }
    }
}
