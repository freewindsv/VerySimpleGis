using System;

namespace VerySimpleGis.Models
{
    public class GisException : Exception
    {
        public GisException() { }
        public GisException(string message) : base(message) { }
        public GisException(string message, Exception innerException) : base(message, innerException) { }
    }
}