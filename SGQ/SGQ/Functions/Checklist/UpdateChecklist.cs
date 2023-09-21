using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Microsoft.Azure.Documents.Client;
using Microsoft.Azure.Documents;
using SGQ.Models;
using Microsoft.Azure.WebJobs.ServiceBus;
using User.Models;
using System.Collections.Generic;
using Utils;
using System.Linq;

namespace SGQ.Functions.Checklist
{
	public static class UpdateChecklist
	{
		[FunctionName("checklist-update")]
		[return: ServiceBus("notification", EntityType = EntityType.Queue)]
		public static async Task<IActionResult> Run(
			[HttpTrigger(AuthorizationLevel.Anonymous, "put", Route = null)] HttpRequest req, [CosmosDB(
		databaseName: "sgq",
		collectionName: "checklist",
		Id = "{Query.id}",
		PartitionKey = "{Query.id}",
		ConnectionStringSetting = "myCosmosDb")] Document document,
			[CosmosDB(
		databaseName: "sgq",
		collectionName: "checklist",
		ConnectionStringSetting = "myCosmosDb")] DocumentClient client,
			ILogger log)
		{
			log.LogInformation("Update Checklist started");

			List<UserModel> users = client.CreateDocumentQuery<UserModel>(UriFactory.CreateDocumentCollectionUri("sgq", "user")).ToList();
            List<UserModel> convertedUsers = users.Select(u => new UserModel(u.Id, u.Name, u.Email, u.Role)).ToList();
			var allowed = new Jwt().ValidateUserAndRoles(new List<UserRole> { UserRole.ADMIN, UserRole.MANAGER }, req, users);
            if (allowed == false)
            {
                return new UnauthorizedResult();
            }

			string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
			var checklist = JsonConvert.DeserializeObject<ChecklistModel>(requestBody);
			ChecklistModel convertedChecklist = new ChecklistModel(req.Query["id"], checklist.Name, checklist.Description, checklist.Sections);

			Uri collection = UriFactory.CreateDocumentCollectionUri("sgq", "checklist");
			await client.DeleteDocumentAsync(document.SelfLink, new RequestOptions() { PartitionKey = new PartitionKey(convertedChecklist.Id) });
			await client.UpsertDocumentAsync(collection, convertedChecklist);

			log.LogInformation($"Checklist id: {convertedChecklist.Id}");

			return new OkObjectResult(checklist);
		}
	}
}