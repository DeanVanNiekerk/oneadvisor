using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using FluentValidation.Results;
using OneAdvisor.Model.Common;

namespace OneAdvisor.Model
{
    public static class ExtensionMethods
    {
        const string PARAMETER_NAME = "Entity";
        const string ORDER_BY_METHOD_NAME = "OrderBy";
        const string ORDER_BY_DESCENDING_METHOD_NAME = "OrderByDescending";

        public static IQueryable<TEntity> OrderBy<TEntity>(this IQueryable<TEntity> source, string sortColumn, SortDirection sortDirection) where TEntity : class
        {
            //If there is no SortColumn, just return the original query
            if (string.IsNullOrWhiteSpace(sortColumn))
                return source;

            // Get the type of the entity being sorted.
            var type = typeof(TEntity);

            // Create a parameter to pass into the Lambda expression (Entity => Entity.OrderByField).
            var parameter = Expression.Parameter(type, PARAMETER_NAME);

            // Get a reference to the type of the property being sorted.
            sortColumn = Char.ToUpperInvariant(sortColumn[0]) + sortColumn.Substring(1);
            var property = type.GetProperty(sortColumn);

            // If null we have an invalid property name 
            if (property == null)
                return source;

            // Get a reference to the properties access member ( Entity.OrderByField ).
            var propertyAccess = Expression.MakeMemberAccess(parameter, property);

            // Create the order by expression.
            var orderByExp = Expression.Lambda(propertyAccess, parameter);

            string methodName;

            // Determine the method to actually call on the IQueryable interface.
            if (sortDirection == SortDirection.Ascending)
                methodName = ORDER_BY_METHOD_NAME;
            else
                methodName = ORDER_BY_DESCENDING_METHOD_NAME;

            // Get a reference to the method call.
            MethodCallExpression resultExp = Expression.Call(typeof(Queryable), methodName,
            new Type[] { type, property.PropertyType },
            source.Expression, Expression.Quote(orderByExp));

            // Now apply the sort.
            return (IQueryable<TEntity>)source.Provider.CreateQuery(resultExp);
        }

        public static IQueryable<T> TakePage<T>(this IQueryable<T> query, int pageNumber, int pageSize)
        {
            if (pageSize == 0 || pageNumber == 0)
                return query;

            return query.Skip((pageNumber - 1) * pageSize).Take(pageSize);
        }

        public static Result GetResult(this ValidationResult validationResult)
        {
            var result = new Result();
            result.LoadValidationResults(validationResult);
            return result;
        }

        public static async Task<IEnumerable<T1>> SelectManyAsync<T, T1>(this IEnumerable<T> enumeration, Func<T, Task<IEnumerable<T1>>> func)
        {
            return (await Task.WhenAll(enumeration.Select(func))).SelectMany(s => s);
        }

        public static async Task<IEnumerable<T1>> SelectManyAsync<T, T1>(this IQueryable<T> enumeration, Func<T, Task<IQueryable<T1>>> func)
        {
            return (await Task.WhenAll(enumeration.Select(func))).SelectMany(s => s);
        }

        public static string SplitCamelCase(this string str)
        {
            return Regex.Replace(
                Regex.Replace(
                    str,
                    @"(\P{Ll})(\P{Ll}\p{Ll})",
                    "$1 $2"
                ),
                @"(\p{Ll})(\P{Ll})",
                "$1 $2"
            );
        }

        public static bool IgnoreCaseEquals(this string str, string target)
        {
            return String.Equals(str, target, StringComparison.OrdinalIgnoreCase); ;
        }

        public static DateTime LastDayOfMonth(this DateTime dateTime)
        {
            return new DateTime(dateTime.Year, dateTime.Month, DateTime.DaysInMonth(dateTime.Year, dateTime.Month));
        }
    }
}