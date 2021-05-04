using System;
using System.IO;

namespace MicroWin.Common
{
    public static class DotEnv
    {
        private static readonly string DEFAULT_ENVFILENAME = ".env";

        public static void Load(string filePath=null)
        {
            var file = Path.GetFileName(filePath);
            if (file == null || file == string.Empty) file = DEFAULT_ENVFILENAME;
            var dir = Path.GetDirectoryName(filePath);
            if (dir == null || dir == string.Empty) dir = Directory.GetCurrentDirectory();
            filePath = Path.Combine(dir, file);

            while (!File.Exists(filePath))
            {
                var parent = Directory.GetParent(dir);
                if (parent == null)
                {
                    filePath = null;
                    break;
                }
                dir = parent.FullName;
                filePath = Path.Combine(dir, file);
            }

            if (!File.Exists(filePath))
                return;

            foreach (var line in File.ReadAllLines(filePath))
            {
                var parts = line.Split(
                    '=',
                    StringSplitOptions.RemoveEmptyEntries);

                if (parts.Length != 2)
                    continue;
                if(parts[0].StartsWith("#"))
                    continue;

                if (Environment.GetEnvironmentVariable(parts[0]) == null)
                    Environment.SetEnvironmentVariable(parts[0], parts[1]);
            }
        }
    }
}