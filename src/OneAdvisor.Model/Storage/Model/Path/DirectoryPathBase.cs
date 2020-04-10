using System;
using System.Collections.Generic;

namespace OneAdvisor.Model.Storage.Model.Path
{
    public abstract class DirectoryPathBase
    {
        public abstract string GetContainerName();
        public abstract string GetDirectoryPath();

        protected string Join(IEnumerable<string> paths)
        {
            return String.Join("/", paths);
        }
    }
}