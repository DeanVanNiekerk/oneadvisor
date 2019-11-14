using System;
using System.Linq;

namespace api.Test
{
    public static class ExtensionMethods
    {
        public static bool HasProperty(this Type obj, string propertyName)
        {
            return obj.GetProperty(propertyName) != null;
        }

        public static int PropertyCount(this Type obj)
        {
            return obj.GetProperties().Count();
        }
    }
}