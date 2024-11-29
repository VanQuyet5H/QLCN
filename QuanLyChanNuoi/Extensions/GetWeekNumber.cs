using System.Globalization;

namespace QuanLyChanNuoi.Extensions
{
    public static class GetWeekNumber
    {
        public static int SoTuan(DateTime date)
        {
            var culture = CultureInfo.CurrentCulture;
            var week = culture.Calendar.GetWeekOfYear(date, CalendarWeekRule.FirstDay, DayOfWeek.Monday);
            return week;
        }
    }
}
