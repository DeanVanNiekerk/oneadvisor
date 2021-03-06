using System;
using System.Collections.Generic;

namespace OneAdvisor.Model.Storage.Model.Path
{
    public abstract class PathBase
    {
        protected string Join(IEnumerable<string> paths)
        {
            return String.Join("/", paths);
        }
    }
}