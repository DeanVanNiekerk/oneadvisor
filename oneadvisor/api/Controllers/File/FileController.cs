using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OneAdvisor.Model.Storage.Interface;

namespace api.Controllers.Email
{
    [Authorize]
    [ApiController]
    [Route("api/file")]
    public class FileController : Controller
    {
        public FileController(IFileStorageService fileStorageService)
        {
            FileStorageService = fileStorageService;
        }

        private IFileStorageService FileStorageService { get; }

        [HttpGet()]
        public async Task<IActionResult> Get([FromQuery]string url)
        {
            var stream = new MemoryStream();

            string fileName = await FileStorageService.GetFile(url, stream);

            stream.Position = 0;

            return File(stream, "application/octet-stream", fileName);
        }
    }
}