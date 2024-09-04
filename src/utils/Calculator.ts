/**
 * Calculate profits from staking based on duration and investment amount
 * @param duration - Duration (day/week/month/year)
 * @param investment - Investment amount
 * @param apr - Annual Percentage Rate
 * @returns Profit calculated based on duration and investment amount, or an error message if the duration is invalid
 */
export const calculateProfit = (duration: string, investment: number, apr: number): number | string => {  
    switch (duration) {
      case "day":
        // Calculate daily profit
        return (investment * apr) / 365;
      case "week":
        // Calculate weekly profit
        return (investment * apr) / 52;
      case "month":
        // Calculate monthly profit
        return (investment * apr) / 12;
      case "year":
        // Calculate yearly profit
        return investment * apr;
      default:
        // Invalid duration case
        return 0;
    }
  }