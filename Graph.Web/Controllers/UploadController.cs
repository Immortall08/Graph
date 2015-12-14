using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.IO;

namespace Graph.Web.Controllers
{
    public class UploadController : ApiController
    {
        [HttpPost, Route("api/upload")]
        public async Task<IHttpActionResult> Upload()
        {
            if (!Request.Content.IsMimeMultipartContent())
                throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);

            var provider = new MultipartMemoryStreamProvider();            
            await Request.Content.ReadAsMultipartAsync (provider);
            foreach (var file in provider.Contents)
            {
                var filename = file.Headers.ContentDisposition.FileName.Trim('\"');
                //Stream stream = await file.ReadAsStreamAsync();               
                var buffer = await file.ReadAsStringAsync();
                return Ok(buffer);

                //Do whatever you want with filename and its binaray data.
            }
            
            //result = buffer; //(HttpStatusCode.OK);


            return Ok();
        }
    }
}
