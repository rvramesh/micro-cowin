using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;

namespace MicroWin.Common
{
    public class TelegramTokenValidator
    {
        /// <summary>
        /// How old (in seconds) can authorization attempts be to be considered valid (compared to the auth_date field)
        /// </summary>
        public long AllowedTimeOffset = 60*30; //30 mins in seconds

        private bool _disposed = false;
        private readonly HMACSHA256 _hmac;
        private static readonly DateTime _unixStart = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc);

        /// <summary>
        /// Construct a new <see cref="LoginWidget"/> instance
        /// </summary>
        /// <param name="token">The bot API token used as a secret parameter when checking authorization</param>
        public TelegramTokenValidator(string token)
        {
            if (token == null) throw new ArgumentNullException(nameof(token));

            using (SHA256 sha256 = SHA256.Create())
            {
                _hmac = new HMACSHA256(sha256.ComputeHash(Encoding.ASCII.GetBytes(token)));
            }
        }
        /// <summary>
        /// Checks whether the authorization data received from the user is valid
        /// </summary>
        /// <param name="fields">A collection containing query string fields as sorted key-value pairs</param>
        /// <returns></returns>
        public bool CheckAuthorization(SortedDictionary<string, string> fields)
        {
            if (_disposed) throw new ObjectDisposedException(nameof(TelegramTokenValidator));
            if (fields == null) throw new ArgumentNullException(nameof(fields));
            if (fields.Count < 3) return false;

            if (!fields.ContainsKey(Field.Id) ||
                !fields.TryGetValue(Field.AuthDate, out string authDate) ||
                !fields.TryGetValue(Field.Hash, out string hash)
            ) return false; //Authorization.MissingFields;

            if (hash.Length != 64) return false;// Authorization.InvalidHash;

            if (!long.TryParse(authDate, out long timestamp))
                return false;// Authorization.InvalidAuthDateFormat;

            if (Math.Abs(DateTime.UtcNow.Subtract(_unixStart).TotalSeconds - timestamp) > AllowedTimeOffset)
                return false; //Authorization.TooOld;

            fields.Remove(Field.Hash);
            StringBuilder dataStringBuilder = new StringBuilder(256);
            foreach (var field in fields)
            {
                dataStringBuilder.Append(field.Key);
                dataStringBuilder.Append('=');
                dataStringBuilder.Append(field.Value);
                dataStringBuilder.Append('\n');
            }
            dataStringBuilder.Length -= 1; // Remove the last \n

            byte[] signature = _hmac.ComputeHash(Encoding.UTF8.GetBytes(dataStringBuilder.ToString()));
            var signatureComputed = BitConverter.ToString(signature).Replace("-","").ToLower();
            return hash.ToLower().Equals(signatureComputed);

        
        }

        public void Dispose()
        {
            if (!_disposed)
            {
                _disposed = true;
                _hmac?.Dispose();
            }
        }

        static bool ByteArrayCompare(ReadOnlySpan<byte> a1, ReadOnlySpan<byte> a2)
        {
            return a1.SequenceEqual(a2);
        }

        private static class Field
        {
            public const string AuthDate = "auth_date";
            public const string Id = "id";
            public const string Hash = "hash";
        }

    }
}