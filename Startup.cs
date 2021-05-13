using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using MicroWin.Authorization;
using MicroWin.Common;
using MicroWin.Common.Database;
using MicroWin.Configuration;
using MicroWin.EnrollmentService;
using MicroWin.IdService;

namespace MicroWin
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            DotEnv.Load();

            services.AddControllers();

            services.AddSingleton<IdRepo>();
            services.AddSingleton<UserRepo>();
            services.AddSingleton<ApplicationConfigurationRepo>();
            services.AddSingleton<TelegramTokenValidator>((serviceProvider) => new TelegramTokenValidator(AppEnvironment.BotToken));
            services.AddSingleton<AdminUserNamesProvider>((serviceProvider) => new AdminUserNamesProvider(AppEnvironment.AdminUserNames));
            services.AddSingleton<AuthJwtTokenHandler>((serviceProvider) => new AuthJwtTokenHandler(
                AuthJwtTokenOptions.SecuirtyKey, AuthJwtTokenOptions.Issuer, AuthJwtTokenOptions.Audience)
            );

            services.AddSingleton<EnrollmentRepo>();

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
           .AddJwtBearer(x =>
           {
               x.TokenValidationParameters = new TokenValidationParameters
               {
                   IssuerSigningKey = AuthJwtTokenOptions.SecuirtyKey,
                   ValidateIssuer = true,
                   ValidateAudience = true,
                   ValidIssuer = AuthJwtTokenOptions.Issuer,
                   ValidAudience = AuthJwtTokenOptions.Audience,
                   ValidateLifetime=true,
               };
           });

            services.AddSingleton((serviceProvider) =>
                 new DbConnectionFactory(Configuration["DatabaseName"].Replace("~", serviceProvider.GetRequiredService<IHostEnvironment>().ContentRootPath))
                 );
            services.AddSingleton<IDatabaseBootstrap, DatabaseBootstrap>();

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.ApplicationServices.GetRequiredService<IDatabaseBootstrap>().Setup();

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseRouting();
            JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
            });
           

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });
        }
    }
}
