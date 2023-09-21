using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Azure.Documents.Client;
using Microsoft.Azure.Documents;
using Utils;
using System.Collections.Generic;
using User.Models;
using System.Linq;

namespace User.Functions
{
    public static class DeleteUser
    {
        [FunctionName("user-delete")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = null)] HttpRequest req,
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
			log.LogInformation("Delete Users started");

			List<UserModel> users = client.CreateDocumentQuery<UserModel>(UriFactory.CreateDocumentCollectionUri("sgq", "user")).ToList();
            List<UserModel> convertedUsers = users.Select(u => new UserModel(u.Id, u.Name, u.Email, u.Role)).ToList();
			var allowed = new Jwt().ValidateUserAndRoles(new List<UserRole> { UserRole.ADMIN }, req, users);
            if (allowed == false)
            {
                return new UnauthorizedResult();
            }

			string id = req.Query["id"];

			await client.DeleteDocumentAsync(document.SelfLink, new RequestOptions() { PartitionKey = new PartitionKey(id) });

			log.LogInformation($"User deleted");

			return new OkResult();
		}
    }
}
