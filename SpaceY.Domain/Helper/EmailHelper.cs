using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Threading.Tasks;

namespace SpaceY.Domain.Helper
{
    public static class EmailHelper
    {
        public static string GetUserName(string email){
            var address = new MailAddress(email);
            return address.User;
        }
    }
}