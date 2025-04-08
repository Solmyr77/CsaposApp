using Microsoft.AspNetCore.Http;
using System.IO;
using System.Text;

namespace CsaposApi.Tests
{
    public static class TestUtils
    {
        /// <summary>
        /// Creates a fake HTTP context with a "Bearer XYZ" Authorization header.
        /// </summary>
        public static HttpContext FakeHttpContextWithAuthHeader(string token)
        {
            var context = new DefaultHttpContext();
            context.Request.Headers["Authorization"] = $"Bearer {token}";
            return context;
        }
    }
}
