using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Azure.Documents.Client;
using System.Collections.Generic;
using System.Linq;
using User.Models;
using SGQ.Models;
using Utils;

namespace SGQ.Functions.Checklist
{
    public static class GetChecklists
    {
        [FunctionName("checklists")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = null)] HttpRequest req, [CosmosDB(
		databaseName: "sgq",
		collectionName: "checklist",
		ConnectionStringSetting = "myCosmosDb")] DocumentClient client,
			ILogger log)
        {
			log.LogInformation("Get checklists started");

			List<UserModel> users = client.CreateDocumentQuery<UserModel>(UriFactory.CreateDocumentCollectionUri("sgq", "user")).ToList();
            List<UserModel> convertedUsers = users.Select(u => new UserModel(u.Id, u.Name, u.Email, u.Role)).ToList();
			var allowed = new Jwt().ValidateUserAndRoles(new List<UserRole> { UserRole.ADMIN, UserRole.MANAGER }, req, users);
            if (allowed == false)
            {
                return new UnauthorizedResult();
            }

			List<ChecklistModel> checklists = client.CreateDocumentQuery<ChecklistModel>(UriFactory.CreateDocumentCollectionUri("sgq", "checklist")).ToList();

			log.LogInformation($"Checklists count: {checklists.Count}");

			return new OkObjectResult(checklists);
		}
    }
}
