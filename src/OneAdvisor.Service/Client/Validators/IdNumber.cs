using System;
using System.Linq;
using OneAdvisor.Model;

namespace OneAdvisor.Service.Client.Validators
{
    public class IdNumber
    {
        public IdNumber(string identityNumber)
        {
            IsValid = false;
            this.Initialize(identityNumber);
        }

        public string IdentityNumber { get; private set; }

        public DateTime? DateOfBirth { get; private set; }

        public string Gender { get; private set; }

        public bool IsSouthAfrican { get; private set; }

        public bool IsValid { get; private set; }

        private void Initialize(string identityNumber)
        {
            try
            {
                this.IdentityNumber = (identityNumber ?? string.Empty).TrimWhiteSpace();
                if (this.IdentityNumber.Length == 13)
                {
                    var digits = new int[13];
                    for (int i = 0; i < 13; i++)
                    {
                        digits[i] = int.Parse(this.IdentityNumber.Substring(i, 1));
                    }
                    int control1 = digits.Where((v, i) => i % 2 == 0 && i < 12).Sum();
                    string second = string.Empty;
                    digits.Where((v, i) => i % 2 != 0 && i < 12).ToList().ForEach(v =>
                          second += v.ToString());
                    var string2 = (int.Parse(second) * 2).ToString();
                    int control2 = 0;
                    for (int i = 0; i < string2.Length; i++)
                    {
                        control2 += int.Parse(string2.Substring(i, 1));
                    }
                    var control = (10 - ((control1 + control2) % 10)) % 10;
                    if (digits[12] == control)
                    {
                        try
                        {
                            this.DateOfBirth = DateTime.ParseExact(this.IdentityNumber
                                .Substring(0, 6), "yyMMdd", null);

                            if (this.DateOfBirth > DateTime.UtcNow)
                                this.DateOfBirth = this.DateOfBirth.Value.AddYears(-100);
                        }
                        catch { }

                        this.Gender = digits[6] < 5 ? "Female" : "Male";
                        this.IsSouthAfrican = digits[10] == 0;
                        this.IsValid = true;
                    }
                }
            }
            catch
            {
                this.IsValid = false;
            }
        }
    }
}