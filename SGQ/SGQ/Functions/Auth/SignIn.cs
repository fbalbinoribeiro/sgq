using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Documents.Client;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using User.Models;
using Utils;

namespace SGQ.Functions.Auth
{
    public static class SignIn
    {
        [FunctionName("sign-in")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = null)] HttpRequest req, 
            [CosmosDB(
        databaseName: "sgq",
        collectionName: "user",
        ConnectionStringSetting = "myCosmosDb")] DocumentClient client,
            ILogger log)
        {
            log.LogInformation("Sign In started");

            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            var user = JsonConvert.DeserializeObject<UserModel>(requestBody);
            UserModel convertedUser = new(user.Id, user.Name, user.Email, user.Password, user.Role);
            var users = client.CreateDocumentQuery<UserModel>(UriFactory.CreateDocumentCollectionUri("sgq", "user")).ToList();

            if (users.Any(u => u.Email == convertedUser.Email && u.Password == convertedUser.Password))
            {
                Jwt jwt = new();
                string token = jwt.IssuingJWT(convertedUser);

                log.LogInformation($"User id: {convertedUser.Id}");

                return new OkObjectResult(token);
            } else {
                log.LogInformation($"User not found");

                return new UnauthorizedResult();
            }
        }
    }
}
