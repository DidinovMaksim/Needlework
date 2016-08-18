using System.Net.Mail;
using System.Net;

namespace NeedleWork2016.Core
{
    public class EmailSender
    {
        //Method that send message with body, subject
        public static void SendEmail(string email, string subject, string body)
        {
            try
            {
                SmtpClient client = new SmtpClient();
                client.DeliveryMethod = SmtpDeliveryMethod.Network;
                client.EnableSsl = true;
                client.Host = "smtp.gmail.com";
                client.Port = 587;

                client.UseDefaultCredentials = false;
                client.Credentials = new NetworkCredential("needlework2016@gmail.com", "24912696");

                MailMessage msg = new MailMessage();
                msg.From = new MailAddress("needlework2016@gmail.com");
                msg.To.Add(new MailAddress(email));

                msg.Subject = subject;
                msg.IsBodyHtml = true;
                msg.Body = body;

                client.Send(msg);
            }
            catch {}
            
        }        
    }
}
