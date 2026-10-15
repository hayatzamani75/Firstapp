// Approximate display conversion for prices stored in USD.
const USD_TO_AFN = 65;

export function formatDualPrice(amount: number | string): string {
    const usd = Number(amount);
    const afn = usd * USD_TO_AFN;

    return `AFN ${new Intl.NumberFormat('en-US', {
        maximumFractionDigits: 0,
    }).format(afn)} / USD ${new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(usd)}`;
}
