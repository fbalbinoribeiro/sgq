using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using SGQ.Models;
using User.Models;
using System.Collections.Generic;
using Microsoft.Azure.Documents.Client;
using System.Linq;
using Utils;

namespace SGQ.Functions.Checklist
{
    public static class CreateChecklist
    {
        [FunctionName("checklist-create")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = null)] HttpRequest req,
			 [CosmosDB(
		databaseName: "sgq",
		collectionName: "checklist",
		ConnectionStringSetting = "myCosmosDb")] DocumentClient client,
			[CosmosDB(
		databaseName: "sgq",
		collectionName: "checklist",
		ConnectionStringSetting = "myCosmosDb")]IAsyncCollector<ChecklistModel> documentsOut,
			ILogger log)
		{
			log.LogInformation("Create Checklist started");


			List<UserModel> users = client.CreateDocumentQuery<UserModel>(UriFactory.CreateDocumentCollectionUri("sgq", "user")).ToList();
            List<UserModel> convertedUsers = users.Select(u => new UserModel(u.Id, u.Name, u.Email, u.Role)).ToList();
			var allowed = new Jwt().ValidateUserAndRoles(new List<UserRole> { UserRole.ADMIN, UserRole.MANAGER }, req, users);
            if (allowed == false)
            {
                return new UnauthorizedResult();
            }
			
			string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
			var checklist = JsonConvert.DeserializeObject<ChecklistModel>(requestBody);
			ChecklistModel convertedChecklist = new ChecklistModel(checklist.Id, checklist.Name, checklist.Description, checklist.Sections);

			await documentsOut.AddAsync(convertedChecklist);

			log.LogInformation($"Checklist id: {convertedChecklist.Id}");

			return new OkObjectResult(convertedChecklist);
		}
    }
}
