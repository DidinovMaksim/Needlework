using NeedleWork2016.Models;
using System.Collections.Generic;
using System.Linq;

namespace NeedleWork2016.Repository
{
    //class to work with User Data
    public class UserProfileRepository
    {
        //method with using predicate
        //public static List<ApplicationUser> GetAllUsers(Func<ApplicationUser, bool> predicate)
        //{
        //...
        //}

        //select data about all users
        public static List<ApplicationUser> GetAllUsers()
        {
            using (var context = new ApplicationDbContext())
            {
                return context.Users.Select(x => new ApplicationUser()
                {
                    Id = x.Id,
                    Email = x.Email,
                    FirstName = x.FirstName,
                    LastName = x.LastName,
                    EmailConfirmed = x.EmailConfirmed
                }).ToList();
            }
        }

        //User editing by Id
        public static void EditUser(ApplicationUser user)
        {
            using (var context = new ApplicationDbContext())
            {
                var User = context.Users.Where(c => c.Id == user.Id).FirstOrDefault();
                User.Id = user.Id;
                User.Email = user.Email;
                User.FirstName = user.FirstName;
                User.LastName = user.LastName;
                context.SaveChanges();
            }
        }

        //User deletion by Id
        public static void DeleteUserData(string _id)
        {
            //GetAllUsers(x=>x.Email=="@mail.ru");
            if (!string.IsNullOrEmpty(_id))
            {
                using (var context = new ApplicationDbContext())
                {
                    //Linq request for delition user by Id
                    var user = context.Users.Where(x => x.Id == _id).FirstOrDefault();
                    context.Users.Remove(user);
                    context.SaveChanges();
                }
            }

        }

        //mathod for check user registration
        public static bool UserIsRegistered(string email)
        {
            using (var context = new ApplicationDbContext())
            {
                return context.Users.Any(x => x.Email == email);
            }
        }

        //check email confirmation
        public static bool IsUserConfirmedEmail(string email)
        {
            if (!string.IsNullOrEmpty(email))
            {
                using (var context = new ApplicationDbContext())
                {
                    if (UserIsRegistered(email))
                    {
                        return context.Users.Where(m => m.Email == email).Select(x => x.EmailConfirmed).FirstOrDefault();
                    }
                    return true;
                }
            }
            return false;
        }

        //confirm user email
        public static void EmailConfirm(string email)
        {
            if (!string.IsNullOrEmpty(email))
            {
                using (var context = new ApplicationDbContext())
                {
                    var user = context.Users.Where(m => m.Email == email).FirstOrDefault();
                    user.EmailConfirmed = true;
                    context.SaveChanges();
                }
            }
        }

        public static string GetUserNameByEmail(string email)
        {
            if (!string.IsNullOrEmpty(email))
            {
                using (var context = new ApplicationDbContext())
                {
                    if (UserIsRegistered(email))
                    {
                        return context.Users.Where(m => m.Email == email).Select(x => x.FirstName).FirstOrDefault();
                    }
                }
            }
            return null;
        }
    }
}
