using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using User.Models;
using Microsoft.Azure.Documents;
using Microsoft.Azure.Documents.Client;
using System;

namespace User.Functions
{
    public static class UpdateUser
    {
        [FunctionName("user-update")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "put", Route = null)] HttpRequest req, 
            			 [CosmosDB(
			databaseName: "sgq",
			collectionName: "user", 
			Id = "{Query.id}",
			PartitionKey = "{Query.id}",
			ConnectionStringSetting = "myCosmosDb")] Document document,
            [CosmosDB(
		databaseName: "sgq",
		collectionName: "user",
		ConnectionStringSetting = "myCosmosDb")] DocumentClient client,
            ILogger log)
        {
            log.LogInformation("Update User started");

			string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            var user = JsonConvert.DeserializeObject<UserModel>(requestBody);
			UserModel convertedUser = new UserModel(req.Query["id"], user.Name, user.Email, user.Password, user.Role);

            Uri collection = UriFactory.CreateDocumentCollectionUri("sgq", "user");
            await client.DeleteDocumentAsync(document.SelfLink, new RequestOptions() { PartitionKey = new PartitionKey(convertedUser.Id) });
            await client.UpsertDocumentAsync(collection, convertedUser);

            log.LogInformation($"User id: {convertedUser.Id}");

			return new OkObjectResult(user);
        }
    }
}
