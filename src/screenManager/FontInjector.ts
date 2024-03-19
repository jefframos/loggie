
export default class FontInjector {
    static injectFonts(fontName: string, woff2Path: string, ignoreCss: boolean) {


        if (!ignoreCss) {
            // Create the @font-face CSS rule
            const fontFaceCSS = `
    @font-face {
        font-family: '${fontName}';
        src: url('${woff2Path}') format('woff2'),
        font-weight: normal;
        font-style: normal;
    }
`;

            // Create a style element
            const styleElement = document.createElement('style');
            styleElement.type = 'text/css';

            // Check if the styleSheet property exists (for older browsers)
            if ('styleSheet' in styleElement) {
                styleElement['styleSheet'].cssText = fontFaceCSS;
            } else {
                styleElement.appendChild(document.createTextNode(fontFaceCSS));
            }

            // Append the style element to the head of the document
            document.head.appendChild(styleElement);
        }

        const textElement = document.createElement('div');
        textElement.textContent = `Hello`; // Add a word using the font

        textElement.style.fontFamily = fontName;
        textElement.style.visibility = 'hidden';
        textElement.style.position = 'fixed';
        document.body.appendChild(textElement);

    }
}