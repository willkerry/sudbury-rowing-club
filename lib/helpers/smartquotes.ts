// Convert straight quotes to contextually appropriate smart quotes.
const smartQuotes = (text: string): string => {
    // Replace double quotes first.
    text = text.replace(/"([^"]*)"/g, '&ldquo;$1&rdquo;');
    // Replace single quotes.
    text = text.replace(/'([^']*)'/g, '&lsquo;$1&rsquo;');
    // Fix apostrophes.
    text = text.replace(/([^\s])\'/g, '$1&rsquo;');
    return text;
}
export default smartQuotes;