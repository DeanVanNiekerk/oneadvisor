using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.SqlServer.Migrations.Internal;

namespace OneAdvisor.Data.Extensions
{
    public class ExtendedSqlServerMigrationsAnnotationProvider : SqlServerMigrationsAnnotationProvider
    {
        public ExtendedSqlServerMigrationsAnnotationProvider(MigrationsAnnotationProviderDependencies dependencies)
            : base(dependencies)
        { }

        public override IEnumerable<IAnnotation> For(IIndex index)
        {
            var baseAnnotations = base.For(index);
            var customAnnotations = index.GetAnnotations().Where(a => a.Name == "SqlServer:IncludeIndex");

            return baseAnnotations.Concat(customAnnotations);
        }
    }
}