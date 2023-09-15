using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using User.Models;

namespace User.Functions
{
    public static class CreateUser
    {
        [FunctionName("user")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "post", "put", "delete", Route = null)] HttpRequest req, 
            [CosmosDB(
		databaseName: "sgq",
		collectionName: "user",
		ConnectionStringSetting = "myCosmosDb")]IAsyncCollector<UserModel> documentsOut, 
            ILogger log)
        {
            log.LogInformation("Create User started");

			string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            UserModel user = JsonConvert.DeserializeObject<UserModel>(requestBody);
			await documentsOut.AddAsync(user);

            log.LogInformation($"User id: {user.Id}");

			return new OkObjectResult(user);
        }
    }
}
