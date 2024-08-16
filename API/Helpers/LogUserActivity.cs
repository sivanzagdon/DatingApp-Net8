using API.Extensions;
using Microsoft.AspNetCore.Mvc.Filters;

namespace API;

//is an asynchronous filter designed to update the last active time of the connected user
public class LogUserActivity : IAsyncActionFilter //IAsyncActionFilter, is a filter that is performed before and after a certain action in ASP.NET Core.
{
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var resultContext= await next();

        if(context.HttpContext.User.Identity?.IsAuthenticated!=true) return;

        var userId= context.HttpContext.User.GetUserId();

        var repo=resultContext.HttpContext.RequestServices.GetRequiredService<IUserRepository>();
        var user= await repo.GetUserByIdAsync(userId);
        if(user==null) return;
        user.LastActive=DateTime.UtcNow;
        await repo.SaveAllAsync();
    }
}
